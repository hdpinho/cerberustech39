/**
 * Globo holográfico del hero.
 *
 * Datos reales del documento de marca, nada inventado: sede en Caracas y atención
 * remota a Latinoamérica, Estados Unidos y Europa (arcos con paquetes de datos).
 * La órbita con tres nodos representa los tres pilares (construimos, protegemos,
 * automatizamos), el guardián que vigila en todas las direcciones.
 */
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CircleGeometry,
  Group,
  Line,
  LineBasicMaterial,
  LineLoop,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  Points,
  QuadraticBezierCurve3,
  RingGeometry,
  ShaderMaterial,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  Vector3,
} from "three";
import { Escena, type OpcionesEscena } from "./Escena";
import { ceder } from "./motor";
import { PUNTOS_TIERRA_B64 } from "./puntosTierra";
import { COLOR, aEsfera, brillo, easeOut, fresnelFragment, fresnelVertex } from "./util";

export interface DestinoGlobo {
  nombre: string;
  lat: number;
  lon: number;
}

export interface DatosGlobo {
  sede: DestinoGlobo;
  destinos: DestinoGlobo[];
}

interface Arco {
  curva: QuadraticBezierCurve3;
  material: ShaderMaterial;
  paquete: Sprite;
  fase: number;
}

interface Rotulo {
  el: HTMLDivElement;
  local: Vector3;
  x: number;
  y: number;
  o: number;
}

const R = 1;

export class EscenaGlobo extends Escena {
  private globo = new Group();
  private materialPuntos!: ShaderMaterial;
  private arcos: Arco[] = [];
  private pulsos: Mesh[] = [];
  private orbita = new Group();
  private satelites: Sprite[] = [];
  private rotulos: Rotulo[] = [];
  private entrada = 0; // 0→1: el globo se enciende al montar
  private t0 = 0;
  private readonly datos: DatosGlobo;
  // Reutilizados en cada cuadro (sin asignaciones en el bucle)
  private mundo = new Vector3();
  private hacia = new Vector3();
  private normal = new Vector3();
  private pantalla = { x: 0, y: 0 };

  constructor(host: HTMLElement, datos: DatosGlobo, op: OpcionesEscena = {}) {
    super(host, { fov: 32, distancia: 4.6, giroReposo: 0.07, inclinacionMax: 0.4, ...op });
    this.datos = datos;
    // Vista inicial: el Atlántico de frente, con Caracas, EE. UU. y Europa a la vista
    this.rotable.rotation.set(0.38, (52 * Math.PI) / 180, 0);
    this.rotable.add(this.globo);
  }

  protected async construir() {
    this.construirFondo();
    await ceder();
    this.construirGlobo();
    await ceder();
    this.construirArcos(this.datos);
    this.construirOrbita();
    this.construirPlataforma();
    this.alRedimensionar(this.anchoCss, this.altoCss, this.altoPx);
    if (this.reducido) this.entrada = 1;
  }

  protected alIniciar() {
    this.t0 = performance.now() / 1000;
  }

  /* ───────── construcción ───────── */

  private construirFondo() {
    // Estrellas tenues lejanas: profundidad sin distraer
    const n = 360;
    const pos = new Float32Array(n * 3);
    const v = new Vector3();
    for (let i = 0; i < n; i++) {
      v.randomDirection().multiplyScalar(9 + Math.random() * 6);
      pos.set([v.x, v.y, v.z - 4], i * 3);
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new BufferAttribute(pos, 3));
    const m = new ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: { uColor: { value: COLOR.cyan } },
      vertexShader: /* glsl */ `
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = 1.6;
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          if (d > 0.5) discard;
          gl_FragColor = vec4(uColor, 0.35 * (1.0 - d * 2.0));
        }`,
    });
    this.escena.add(new Points(g, m));

    // Halo detrás del globo
    const halo = new Sprite(
      new SpriteMaterial({ map: brillo(), color: COLOR.tech, transparent: true, opacity: 0.55, depthWrite: false, blending: AdditiveBlending }),
    );
    halo.scale.setScalar(4.4);
    halo.position.set(0, 0, -1.2);
    this.escena.add(halo);
  }

  private construirGlobo() {
    // Núcleo opaco: oculta lo que está detrás y da volumen
    const nucleo = new Mesh(new SphereGeometry(R * 0.995, 64, 48), new MeshBasicMaterial({ color: "#061445" }));
    this.globo.add(nucleo);

    // Brillo de borde (atmósfera)
    const borde = new Mesh(
      new SphereGeometry(R * 1.0, 64, 48),
      new ShaderMaterial({
        vertexShader: fresnelVertex,
        fragmentShader: fresnelFragment,
        uniforms: { uColor: { value: COLOR.cyan }, uPotencia: { value: 2.6 }, uIntensidad: { value: 0.9 } },
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
      }),
    );
    this.globo.add(borde);
    const atmosfera = new Mesh(
      new SphereGeometry(R * 1.09, 64, 48),
      new ShaderMaterial({
        vertexShader: fresnelVertex,
        fragmentShader: fresnelFragment,
        uniforms: { uColor: { value: COLOR.tech }, uPotencia: { value: 4.0 }, uIntensidad: { value: 0.75 } },
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
      }),
    );
    this.globo.add(atmosfera);

    // Retícula (meridianos y paralelos cada 30°)
    const seg: number[] = [];
    const a = new Vector3();
    const b = new Vector3();
    for (let lat = -60; lat <= 60; lat += 30) {
      for (let lon = -180; lon < 180; lon += 4) {
        aEsfera(lat, lon, R * 1.002, a);
        aEsfera(lat, lon + 4, R * 1.002, b);
        seg.push(a.x, a.y, a.z, b.x, b.y, b.z);
      }
    }
    for (let lon = -180; lon < 180; lon += 30) {
      for (let lat = -84; lat < 84; lat += 4) {
        aEsfera(lat, lon, R * 1.002, a);
        aEsfera(lat + 4, lon, R * 1.002, b);
        seg.push(a.x, a.y, a.z, b.x, b.y, b.z);
      }
    }
    const gRet = new BufferGeometry();
    gRet.setAttribute("position", new BufferAttribute(new Float32Array(seg), 3));
    this.globo.add(
      new LineSegments(gRet, new LineBasicMaterial({ color: COLOR.tech, transparent: true, opacity: 0.22, depthWrite: false })),
    );

    // Puntos de tierra (Natural Earth 1:110m)
    const bin = atob(PUNTOS_TIERRA_B64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const pares = new Int16Array(bytes.buffer);
    const n = pares.length / 2;
    const pos = new Float32Array(n * 3);
    const brilloP = new Float32Array(n);
    const v = new Vector3();
    for (let i = 0; i < n; i++) {
      aEsfera(pares[i * 2]! / 100, pares[i * 2 + 1]! / 100, R * 1.006, v);
      pos.set([v.x, v.y, v.z], i * 3);
      brilloP[i] = 0.55 + Math.random() * 0.45;
    }
    const gP = new BufferGeometry();
    gP.setAttribute("position", new BufferAttribute(pos, 3));
    gP.setAttribute("aBrillo", new BufferAttribute(brilloP, 1));
    this.materialPuntos = new ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: { uColor: { value: COLOR.cyan }, uTam: { value: 0.022 }, uPx: { value: 600 }, uEntrada: { value: 0 } },
      vertexShader: /* glsl */ `
        attribute float aBrillo;
        uniform float uTam;
        uniform float uPx;
        uniform float uEntrada;
        varying float vBrillo;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          // Encendido de norte a sur al montar
          float barrido = smoothstep(position.y + 1.2, position.y + 1.0, uEntrada * 2.4);
          vBrillo = aBrillo * (1.0 - barrido);
          gl_PointSize = uTam * uPx / -mv.z;
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        varying float vBrillo;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          if (d > 0.5) discard;
          float a = smoothstep(0.5, 0.12, d) * vBrillo;
          gl_FragColor = vec4(uColor * (0.75 + 0.5 * vBrillo), a);
        }`,
    });
    this.globo.add(new Points(gP, this.materialPuntos));
  }

  private construirArcos({ sede, destinos }: DatosGlobo) {
    const origen = aEsfera(sede.lat, sede.lon, R);

    // Sede: punto brillante y dos pulsos que se expanden sobre la superficie
    const marca = new Sprite(
      new SpriteMaterial({ map: brillo(), color: COLOR.blanco, transparent: true, depthWrite: false, blending: AdditiveBlending }),
    );
    marca.position.copy(origen).multiplyScalar(1.012);
    marca.scale.setScalar(0.11);
    this.globo.add(marca);
    for (let i = 0; i < 2; i++) {
      const anillo = new Mesh(
        new RingGeometry(0.03, 0.036, 48),
        new MeshBasicMaterial({ color: COLOR.cyan, transparent: true, opacity: 0, depthWrite: false, blending: AdditiveBlending }),
      );
      anillo.position.copy(origen).multiplyScalar(1.01);
      anillo.lookAt(origen.clone().multiplyScalar(2));
      anillo.userData.fase = i * 0.5;
      this.globo.add(anillo);
      this.pulsos.push(anillo);
    }
    this.rotular(sede.nombre, origen, true);

    destinos.forEach((d, i) => {
      const fin = aEsfera(d.lat, d.lon, R);
      const angulo = origen.angleTo(fin);
      const medio = origen.clone().add(fin).normalize().multiplyScalar(R + 0.12 + angulo * 0.32);
      const curva = new QuadraticBezierCurve3(origen.clone().multiplyScalar(1.006), medio, fin.clone().multiplyScalar(1.006));
      const puntos = curva.getPoints(96);
      const g = new BufferGeometry().setFromPoints(puntos);
      g.setAttribute("aT", new BufferAttribute(new Float32Array(puntos.map((_, k) => k / 96)), 1));
      const material = new ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        uniforms: { uColor: { value: COLOR.cyan }, uCabeza: { value: -1 }, uBase: { value: 0.28 }, uVisible: { value: 0 } },
        vertexShader: /* glsl */ `
          attribute float aT;
          varying float vT;
          void main() {
            vT = aT;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }`,
        fragmentShader: /* glsl */ `
          uniform vec3 uColor;
          uniform float uCabeza;
          uniform float uBase;
          uniform float uVisible;
          varying float vT;
          void main() {
            // El arco se traza desde la sede (uVisible) y una estela sigue al paquete
            if (vT > uVisible) discard;
            float d = uCabeza - vT;
            float estela = d >= 0.0 ? exp(-d * 9.0) : 0.0;
            gl_FragColor = vec4(uColor, uBase + estela * 0.9);
          }`,
      });
      this.globo.add(new Line(g, material));

      const paquete = new Sprite(
        new SpriteMaterial({ map: brillo(), color: COLOR.cyan, transparent: true, depthWrite: false, blending: AdditiveBlending }),
      );
      paquete.scale.setScalar(0.085);
      paquete.visible = false;
      this.globo.add(paquete);

      // Destino: anillo fijo
      const anillo = new Mesh(
        new RingGeometry(0.022, 0.03, 40),
        new MeshBasicMaterial({ color: COLOR.cyan, transparent: true, opacity: 0.9, depthWrite: false }),
      );
      anillo.position.copy(fin).multiplyScalar(1.008);
      anillo.lookAt(fin.clone().multiplyScalar(2));
      this.globo.add(anillo);

      this.arcos.push({ curva, material, paquete, fase: i * 0.33 });
      this.rotular(d.nombre, fin, false);
    });
  }

  private construirOrbita() {
    // Tres nodos en órbita: los tres pilares vigilando en todas las direcciones
    const puntos: Vector3[] = [];
    for (let i = 0; i < 128; i++) {
      const a = (i / 128) * Math.PI * 2;
      puntos.push(new Vector3(Math.cos(a) * 1.42, 0, Math.sin(a) * 1.42));
    }
    const linea = new LineLoop(
      new BufferGeometry().setFromPoints(puntos),
      new LineBasicMaterial({ color: COLOR.cyan, transparent: true, opacity: 0.22, depthWrite: false }),
    );
    this.orbita.add(linea);
    for (let i = 0; i < 3; i++) {
      const s = new Sprite(
        new SpriteMaterial({ map: brillo(), color: COLOR.cyan, transparent: true, depthWrite: false, blending: AdditiveBlending }),
      );
      s.scale.setScalar(0.13);
      s.userData.fase = (i / 3) * Math.PI * 2;
      this.orbita.add(s);
      this.satelites.push(s);
    }
    this.orbita.rotation.set(1.18, 0, -0.32);
    this.escena.add(this.orbita);
  }

  private construirPlataforma() {
    // Plataforma holográfica bajo el globo: anillos concéntricos y un destello
    const base = new Group();
    for (let i = 1; i <= 7; i++) {
      const r = 0.32 * i;
      const pts: Vector3[] = [];
      for (let k = 0; k < 96; k++) {
        const a = (k / 96) * Math.PI * 2;
        pts.push(new Vector3(Math.cos(a) * r, 0, Math.sin(a) * r));
      }
      base.add(
        new LineLoop(
          new BufferGeometry().setFromPoints(pts),
          new LineBasicMaterial({ color: COLOR.cyan, transparent: true, opacity: 0.32 * (1 - i / 8), depthWrite: false }),
        ),
      );
    }
    const destello = new Mesh(
      new CircleGeometry(1.1, 48),
      new MeshBasicMaterial({ map: brillo(), color: COLOR.tech, transparent: true, opacity: 0.55, depthWrite: false, blending: AdditiveBlending }),
    );
    destello.rotation.x = -Math.PI / 2;
    base.add(destello);
    base.position.y = -1.38;
    this.escena.add(base);
  }

  private rotular(texto: string, punto: Vector3, sede: boolean) {
    const el = document.createElement("div");
    el.className = sede ? "rotulo-3d rotulo-3d--sede" : "rotulo-3d";
    el.textContent = texto; // nunca innerHTML
    this.capaEtiquetas.append(el);
    this.rotulos.push({ el, local: punto.clone().multiplyScalar(1.03), x: NaN, y: NaN, o: NaN });
  }

  /* ───────── animación ───────── */

  protected alRedimensionar(ancho: number, alto: number, altoPx: number) {
    // Encuadre: el globo con su órbita ocupa ~82 % de la dimensión más exigida
    const fov = (this.camara.fov * Math.PI) / 180;
    const radioVisible = 1.46;
    const dV = radioVisible / Math.tan(fov / 2) / 0.82;
    const dH = radioVisible / (Math.tan(fov / 2) * (ancho / alto)) / 0.82;
    const d = Math.max(dV, dH);
    this.camara.position.set(0, d * 0.07, d);
    this.camara.lookAt(0, -0.08, 0);
    this.camara.updateProjectionMatrix();
    if (this.materialPuntos) this.materialPuntos.uniforms.uPx!.value = altoPx / (2 * Math.tan(fov / 2));
    // En lienzos muy estrechos los rótulos se solapan: se ocultan
    if (ancho < 360) this.capaEtiquetas.dataset.oculta = "";
    else delete this.capaEtiquetas.dataset.oculta;
  }

  protected actualizar(t: number): boolean {
    const vivo = !this.reducido;
    // Encendido inicial (una vez): 1,6 s con ease-out
    if (this.entrada < 1) this.entrada = vivo ? easeOut((t - this.t0) / 1.6) : 1;
    this.materialPuntos.uniforms.uEntrada!.value = this.entrada;

    this.arcos.forEach((a, i) => {
      // Cada arco se traza tras el encendido, escalonado
      const traza = vivo ? easeOut((t - this.t0 - 0.6 - i * 0.18) / 1.1) : 1;
      a.material.uniforms.uVisible!.value = traza;
      if (!vivo || traza < 1) {
        a.material.uniforms.uCabeza!.value = -1;
        a.paquete.visible = false;
        return;
      }
      // Paquete de datos: viaja de la sede al destino; ciclo de 3,2 s con pausa
      const ciclo = ((t * 0.31 + a.fase) % 1) * 1.35;
      const avance = Math.min(1, ciclo);
      a.material.uniforms.uCabeza!.value = ciclo <= 1 ? avance : 2;
      a.paquete.visible = ciclo <= 1;
      if (a.paquete.visible) a.curva.getPoint(avance, a.paquete.position);
    });

    this.pulsos.forEach((p) => {
      if (!vivo) {
        p.scale.setScalar(1.6);
        (p.material as MeshBasicMaterial).opacity = 0.5;
        return;
      }
      const f = ((t / 2.4 + (p.userData.fase as number)) % 1 + 1) % 1;
      p.scale.setScalar(1 + f * 3.2);
      (p.material as MeshBasicMaterial).opacity = (1 - f) * 0.85;
    });

    this.satelites.forEach((s) => {
      const a = (vivo ? t * 0.22 : 0) + (s.userData.fase as number);
      s.position.set(Math.cos(a) * 1.42, 0, Math.sin(a) * 1.42);
    });

    return vivo;
  }

  protected trasDibujar() {
    if (this.capaEtiquetas.dataset.oculta !== undefined) return;
    this.globo.updateWorldMatrix(true, false);
    for (const r of this.rotulos) {
      this.mundo.copy(r.local).applyMatrix4(this.globo.matrixWorld);
      // Solo se ve el rótulo de la cara visible del globo
      this.hacia.copy(this.camara.position).sub(this.mundo).normalize();
      const frente = this.normal.copy(this.mundo).normalize().dot(this.hacia);
      const p = this.proyectar(this.mundo, this.pantalla);
      const opacidad = Math.round(Math.max(0, Math.min(1, (frente - 0.12) * 4)) * Math.min(1, this.entrada * 1.2) * 100) / 100;
      // Solo se escribe en el DOM si el rótulo se movió de verdad
      const tx = Math.round(p.x * 2) / 2;
      const ty = Math.round(p.y * 2) / 2;
      if (tx !== r.x || ty !== r.y) {
        r.x = tx;
        r.y = ty;
        r.el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      }
      if (opacidad !== r.o) {
        r.o = opacidad;
        r.el.style.opacity = String(opacidad);
      }
    }
  }
}
