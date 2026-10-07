/**
 * Ecosistema de servicios: un núcleo y las seis líneas de servicio en órbita,
 * unidas por pulsos de datos. Pasar el puntero muestra el beneficio; pulsar abre
 * el mismo detalle que la tarjeta. Equivalente accesible: las tarjetas de la sección.
 */
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  EdgesGeometry,
  Group,
  IcosahedronGeometry,
  Line,
  LineBasicMaterial,
  LineLoop,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  OctahedronGeometry,
  Raycaster,
  ShaderMaterial,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  Vector2,
  Vector3,
} from "three";
import { Escena, type OpcionesEscena } from "./Escena";
import { ceder } from "./motor";
import { COLOR, brillo, easeOut, fresnelFragment, fresnelVertex } from "./util";

export interface NodoServicio {
  codigo: string;
  titulo: string;
  beneficio: string;
}

export interface DatosEcosistema {
  servicios: NodoServicio[];
}

interface Nodo {
  datos: NodoServicio;
  grupo: Group;
  cuerpo: Mesh;
  halo: Sprite;
  linea: ShaderMaterial;
  trazo: BufferAttribute;
  anillo: number;
  angulo: number;
  escala: number; // valor animado
  rotulo: HTMLDivElement;
}

const RADIOS = [1.25, 1.85];
const INCLINACION = [
  [0.42, 0.1],
  [-0.28, -0.22],
];

export class EscenaEcosistema extends Escena {
  private nodos: Nodo[] = [];
  private activo: Nodo | null = null;
  private nucleo = new Group();
  private raycaster = new Raycaster();
  private tip: HTMLDivElement;
  private alSeleccionar: (codigo: string) => void;
  private t0 = 0;
  private reloj = 0;
  private entrada = 0;
  private readonly datos: DatosEcosistema;
  // Reutilizados en cada cuadro (sin asignaciones en el bucle)
  private p = new Vector3();
  private m = new Vector3();
  private pantalla = { x: 0, y: 0 };
  private ejeX = new Vector3(1, 0, 0);
  private ejeZ = new Vector3(0, 0, 1);

  constructor(host: HTMLElement, datos: DatosEcosistema, alSeleccionar: (codigo: string) => void, op: OpcionesEscena = {}) {
    super(host, { fov: 34, distancia: 6, giroReposo: 0.12, inclinacionMax: 0.3, ...op });
    this.alSeleccionar = alSeleccionar;
    this.datos = datos;
    this.tip = document.createElement("div");
    this.tip.className = "tip-3d";
    this.tip.setAttribute("role", "presentation");
    this.capaEtiquetas.append(this.tip);
    this.rotable.rotation.x = 0.12;
  }

  protected async construir() {
    this.construirNucleo();
    await ceder();
    this.construirOrbitas(this.datos.servicios);
    if (this.reducido) this.entrada = 1;
  }

  protected alIniciar() {
    this.t0 = performance.now() / 1000;
  }

  private construirNucleo() {
    const geo = new IcosahedronGeometry(0.46, 1);
    this.nucleo.add(
      new Mesh(geo, new MeshBasicMaterial({ color: "#081a5c", transparent: true, opacity: 0.92 })),
      new LineSegments(new EdgesGeometry(geo), new LineBasicMaterial({ color: COLOR.cyan, transparent: true, opacity: 0.75 })),
      new Mesh(
        new SphereGeometry(0.5, 48, 32),
        new ShaderMaterial({
          vertexShader: fresnelVertex,
          fragmentShader: fresnelFragment,
          uniforms: { uColor: { value: COLOR.cyan }, uPotencia: { value: 2.2 }, uIntensidad: { value: 0.8 } },
          transparent: true,
          depthWrite: false,
          blending: AdditiveBlending,
        }),
      ),
    );
    const halo = new Sprite(
      new SpriteMaterial({ map: brillo(), color: COLOR.tech, transparent: true, opacity: 0.85, depthWrite: false, blending: AdditiveBlending }),
    );
    halo.scale.setScalar(2.4);
    this.nucleo.add(halo);
    this.rotable.add(this.nucleo);
  }

  private construirOrbitas(servicios: NodoServicio[]) {
    // Anillos de órbita
    RADIOS.forEach((r, i) => {
      const pts: Vector3[] = [];
      for (let k = 0; k < 128; k++) {
        const a = (k / 128) * Math.PI * 2;
        pts.push(new Vector3(Math.cos(a) * r, 0, Math.sin(a) * r));
      }
      const anillo = new LineLoop(
        new BufferGeometry().setFromPoints(pts),
        new LineBasicMaterial({ color: COLOR.cyan, transparent: true, opacity: 0.2, depthWrite: false }),
      );
      anillo.rotation.set(INCLINACION[i]![0]!, 0, INCLINACION[i]![1]!);
      this.rotable.add(anillo);
    });

    servicios.forEach((s, i) => {
      const anillo = i % 2;
      const enAnillo = servicios.filter((_, k) => k % 2 === anillo).length;
      const orden = Math.floor(i / 2);
      const angulo = (orden / enAnillo) * Math.PI * 2 + anillo * 0.6;

      const grupo = new Group();
      const cuerpo = new Mesh(
        new OctahedronGeometry(0.15, 0),
        new MeshBasicMaterial({ color: COLOR.cyan, transparent: true, opacity: 0.95 }),
      );
      const aristas = new LineSegments(
        new EdgesGeometry(new OctahedronGeometry(0.2, 0)),
        new LineBasicMaterial({ color: COLOR.blanco, transparent: true, opacity: 0.55 }),
      );
      const halo = new Sprite(
        new SpriteMaterial({ map: brillo(), color: COLOR.cyan, transparent: true, opacity: 0.55, depthWrite: false, blending: AdditiveBlending }),
      );
      halo.scale.setScalar(0.85);
      // Zona de pulsación generosa e invisible (objetivo táctil amplio)
      const zona = new Mesh(new SphereGeometry(0.34, 12, 8), new MeshBasicMaterial({ visible: false }));
      zona.userData.codigo = s.codigo;
      grupo.add(cuerpo, aristas, halo, zona);
      this.rotable.add(grupo);

      // Línea del núcleo al nodo con pulso de datos
      const g = new BufferGeometry();
      g.setAttribute("position", new BufferAttribute(new Float32Array(32 * 3), 3));
      g.setAttribute("aT", new BufferAttribute(new Float32Array(Array.from({ length: 32 }, (_, k) => k / 31)), 1));
      const linea = new ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        uniforms: { uColor: { value: COLOR.cyan }, uCabeza: { value: -1 }, uBase: { value: 0.16 } },
        vertexShader: /* glsl */ `
          attribute float aT;
          varying float vT;
          void main() { vT = aT; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: /* glsl */ `
          uniform vec3 uColor; uniform float uCabeza; uniform float uBase;
          varying float vT;
          void main() {
            float d = uCabeza - vT;
            float estela = d >= 0.0 ? exp(-d * 7.0) : 0.0;
            gl_FragColor = vec4(uColor, uBase + estela * 0.8);
          }`,
      });
      const ln = new Line(g, linea);
      ln.frustumCulled = false;
      this.rotable.add(ln);

      const rotulo = document.createElement("div");
      rotulo.className = "rotulo-3d rotulo-3d--codigo";
      rotulo.textContent = s.codigo;
      this.capaEtiquetas.append(rotulo);

      const trazo = g.getAttribute("position") as BufferAttribute;
      this.nodos.push({ datos: s, grupo, cuerpo, halo, linea, trazo, anillo, angulo, escala: 1, rotulo });
    });
  }

  private posicionNodo(n: Nodo, t: number, destino: Vector3) {
    const vel = this.reducido ? 0 : n.anillo === 0 ? 0.16 : -0.11;
    const a = n.angulo + t * vel;
    const r = RADIOS[n.anillo]!;
    destino.set(Math.cos(a) * r, 0, Math.sin(a) * r);
    const [rx, rz] = INCLINACION[n.anillo]!;
    destino.applyAxisAngle(this.ejeX, rx!).applyAxisAngle(this.ejeZ, rz!);
    return destino;
  }

  protected alRedimensionar(ancho: number, alto: number) {
    const fov = (this.camara.fov * Math.PI) / 180;
    const radio = 1.78;
    const dV = radio / Math.tan(fov / 2) / 0.96;
    const dH = radio / (Math.tan(fov / 2) * (ancho / alto)) / 0.96;
    const d = Math.max(dV, dH);
    this.camara.position.set(0, d * 0.2, d);
    this.camara.lookAt(0, 0, 0);
  }

  protected actualizar(t: number, dt: number): boolean {
    const vivo = !this.reducido;
    if (this.entrada < 1) this.entrada = vivo ? easeOut((t - this.t0) / 1.2) : 1;
    const tiempo = t - this.t0;
    const p = this.p;
    // Reloj de las órbitas: se detiene mientras el puntero señala un nodo,
    // para que el nodo no se escape del cursor
    if (!this.activo) this.reloj += dt;
    this.enPausa = this.activo !== null;

    this.nucleo.rotation.y = vivo ? tiempo * 0.25 : 0.4;
    this.nucleo.rotation.x = vivo ? Math.sin(tiempo * 0.3) * 0.2 : 0.2;

    this.nodos.forEach((n, i) => {
      // Entrada escalonada: cada nodo sale del núcleo a su órbita
      const e = vivo ? easeOut((tiempo - i * 0.06) / 0.9) : 1;
      this.posicionNodo(n, this.reloj, p).multiplyScalar(Math.max(0.001, e));
      n.grupo.position.copy(p);
      n.grupo.rotation.y = vivo ? tiempo * 0.8 + i : i;

      // Resalte con resorte amortiguado (seguimiento suave, interrumpible)
      const objetivo = n === this.activo ? 1.45 : 1;
      n.escala += (objetivo - n.escala) * (1 - Math.exp(-dt * 14));
      n.grupo.scale.setScalar(n.escala * Math.max(0.001, e));
      (n.halo.material as SpriteMaterial).opacity = n === this.activo ? 0.95 : 0.55;

      // Línea núcleo → nodo
      for (let k = 0; k < 32; k++) {
        const f = k / 31;
        n.trazo.setXYZ(k, p.x * f, p.y * f + Math.sin(f * Math.PI) * 0.08, p.z * f);
      }
      n.trazo.needsUpdate = true;
      const ciclo = vivo ? ((tiempo * 0.45 + i * 0.17) % 1) * 1.3 : 2;
      n.linea.uniforms.uCabeza!.value = ciclo <= 1 ? ciclo : 2;
      n.linea.uniforms.uBase!.value = n === this.activo ? 0.5 : 0.16;
    });
    return vivo || this.nodos.some((n) => Math.abs((n === this.activo ? 1.45 : 1) - n.escala) > 0.002);
  }

  protected trasDibujar() {
    const m = this.m;
    for (const n of this.nodos) {
      n.grupo.getWorldPosition(m);
      m.y += 0.32;
      const pp = this.proyectar(m, this.pantalla);
      n.rotulo.style.transform = `translate3d(${pp.x.toFixed(1)}px, ${pp.y.toFixed(1)}px, 0)`;
      n.rotulo.style.opacity = String(Math.min(1, this.entrada * 1.4));
      if (n === this.activo) n.rotulo.dataset.activo = "";
      else delete n.rotulo.dataset.activo;
    }
    if (this.activo) {
      this.activo.grupo.getWorldPosition(m);
      const pp = this.proyectar(m, this.pantalla);
      // El tooltip se abre hacia el lado con más espacio
      const izquierda = pp.x > this.anchoCss * 0.6;
      this.tip.style.transform = `translate3d(${pp.x.toFixed(1)}px, ${pp.y.toFixed(1)}px, 0) translate(${izquierda ? "calc(-100% - 22px)" : "22px"}, -50%)`;
    }
  }

  private buscar(ndc: { x: number; y: number }): Nodo | null {
    this.raycaster.setFromCamera(new Vector2(ndc.x, ndc.y), this.camara);
    const zonas = this.nodos.map((n) => n.grupo.children[3]!);
    const hit = this.raycaster.intersectObjects(zonas, false)[0];
    const codigo = hit?.object.userData.codigo as string | undefined;
    return this.nodos.find((n) => n.datos.codigo === codigo) ?? null;
  }

  protected alPasar(ndc: { x: number; y: number } | null) {
    const n = ndc ? this.buscar(ndc) : null;
    if (n === this.activo) return;
    this.activo = n;
    this.lienzo.style.cursor = n ? "pointer" : "";
    if (n) {
      this.tip.replaceChildren();
      const titulo = document.createElement("p");
      titulo.className = "tip-3d__titulo";
      titulo.textContent = `${n.datos.codigo} · ${n.datos.titulo}`;
      const cuerpo = document.createElement("p");
      cuerpo.className = "tip-3d__cuerpo";
      cuerpo.textContent = n.datos.beneficio;
      const pie = document.createElement("p");
      pie.className = "tip-3d__pie";
      pie.textContent = "Clic para ver el detalle";
      this.tip.append(titulo, cuerpo, pie);
      this.tip.dataset.visible = "";
    } else {
      delete this.tip.dataset.visible;
    }
    this.pedirDibujo();
  }

  protected alPulsar(ndc: { x: number; y: number }) {
    const n = this.buscar(ndc);
    if (n) this.alSeleccionar(n.datos.codigo);
  }
}
