/**
 * Base de las escenas 3D del sitio. Gestiona lo que comparten todas:
 * renderer y tamaño, montaje en fases cortas (sin tareas largas), sombreadores
 * compilados en paralelo, bucle que solo dibuja cuando hace falta (nunca fuera de
 * pantalla ni con la pestaña oculta), arrastre con inercia, giro en reposo,
 * movimiento reducido y liberación de recursos.
 */
import {
  BufferGeometry,
  Group,
  Material,
  Mesh,
  PerspectiveCamera,
  Scene,
  Vector3,
  type Object3D,
  type WebGLRenderer,
} from "three";
import { ceder, crearRenderer } from "./motor";

export interface OpcionesEscena {
  fov?: number;
  distancia?: number;
  /** Velocidad del giro en reposo (rad/s). 0 = sin giro. */
  giroReposo?: number;
  /** Límite de inclinación vertical al arrastrar (rad). */
  inclinacionMax?: number;
  reducido?: boolean;
  dprMax?: number;
}

export abstract class Escena {
  protected readonly host: HTMLElement;
  protected readonly lienzo: HTMLCanvasElement;
  protected readonly capaEtiquetas: HTMLDivElement;
  protected readonly escena = new Scene();
  protected readonly camara: PerspectiveCamera;
  /** Lo que el usuario hace girar al arrastrar. */
  protected readonly rotable = new Group();
  protected reducido: boolean;
  /** Detiene el giro en reposo (p. ej. mientras el puntero señala un objeto). */
  protected enPausa = false;
  protected anchoCss = 1;
  protected altoCss = 1;
  protected altoPx = 1;

  private renderer: WebGLRenderer | null = null;
  private dpr = 1;
  private readonly dprMax: number;
  private readonly giroReposo: number;
  private readonly inclinacionMax: number;
  private raf = 0;
  private ultimo = 0;
  private sucio = true;
  private visible = false;
  private oculto = false;
  private liberada = false;
  private ro: ResizeObserver;
  private io: IntersectionObserver;

  // Arrastre con inercia: la velocidad sobrevive al soltar y decae con fricción
  private arrastre: { id: number; x: number; y: number; t: number } | null = null;
  private velYaw = 0;
  private velPitch = 0;
  private reanudarEn = 0;
  private factorReposo = 1;
  private movido = 0;

  constructor(host: HTMLElement, op: OpcionesEscena = {}) {
    this.host = host;
    this.reducido = op.reducido ?? false;
    this.dprMax = op.dprMax ?? 1.5;
    this.giroReposo = op.giroReposo ?? 0;
    this.inclinacionMax = op.inclinacionMax ?? 0.35;

    this.lienzo = document.createElement("canvas");
    this.lienzo.className = "lienzo-3d";
    this.lienzo.setAttribute("aria-hidden", "true");
    // El gesto vertical sigue desplazando la página; el horizontal gira la escena
    this.lienzo.style.touchAction = "pan-y";

    this.capaEtiquetas = document.createElement("div");
    this.capaEtiquetas.className = "capa-etiquetas-3d";
    this.capaEtiquetas.setAttribute("aria-hidden", "true");

    this.camara = new PerspectiveCamera(op.fov ?? 35, 1, 0.1, 100);
    this.camara.position.set(0, 0, op.distancia ?? 4.2);
    this.escena.add(this.rotable);

    this.ro = new ResizeObserver(() => this.medir());
    this.io = new IntersectionObserver(
      ([e]) => {
        this.visible = Boolean(e?.isIntersecting);
        if (this.visible) this.sucio = true;
      },
      { rootMargin: "120px 0px" },
    );
  }

  /**
   * Monta la escena en fases cortas: contexto WebGL, geometría, sombreadores
   * (compilación en paralelo cuando el navegador lo permite) y primer cuadro.
   * Cada `ceder()` devuelve el control al navegador entre fase y fase.
   */
  async montar(): Promise<void> {
    this.host.append(this.lienzo, this.capaEtiquetas);
    this.renderer = crearRenderer(this.lienzo);
    this.ro.observe(this.host);
    this.io.observe(this.host);
    this.medir();
    await ceder();
    await this.construir();
    if (this.liberada) return;
    await ceder();
    await this.renderer.compileAsync(this.escena, this.camara);
    if (this.liberada) return;

    document.addEventListener("visibilitychange", this.alCambiarVisibilidad);
    this.lienzo.addEventListener("pointerdown", this.alPresionar);
    this.lienzo.addEventListener("pointermove", this.alMover);
    this.lienzo.addEventListener("pointerup", this.alSoltar);
    this.lienzo.addEventListener("pointercancel", this.alSoltar);
    this.lienzo.addEventListener("pointerleave", this.alSalir);

    this.ultimo = performance.now();
    this.alIniciar();
    this.raf = requestAnimationFrame(this.bucle);
  }

  /** Crea los objetos de la escena. Puede ceder entre pasos con `await ceder()`. */
  protected abstract construir(): Promise<void>;
  /** Avanza la animación propia. Devuelve true si necesita seguir dibujando. */
  protected abstract actualizar(t: number, dt: number): boolean;
  /** Justo antes del primer cuadro (para fijar el tiempo de inicio de las entradas). */
  protected alIniciar(): void {}
  /** Se llama tras cada cambio de tamaño, con el tamaño CSS del lienzo y su alto en píxeles reales. */
  protected alRedimensionar(_ancho: number, _alto: number, _altoPx: number): void {}
  /** Puntero sobre la escena sin arrastrar (coordenadas normalizadas -1..1), o null al salir. */
  protected alPasar(_ndc: { x: number; y: number } | null): void {}
  /** Clic o toque sin arrastre. */
  protected alPulsar(_ndc: { x: number; y: number }): void {}
  /** Para colocar rótulos HTML tras cada dibujo. */
  protected trasDibujar(): void {}

  fijarMovimientoReducido(r: boolean) {
    this.reducido = r;
    this.sucio = true;
  }

  pedirDibujo() {
    this.sucio = true;
  }

  private v = new Vector3();
  /** Proyecta un punto del mundo a píxeles CSS del lienzo. Sin asignaciones por cuadro. */
  protected proyectar(p: Vector3, destino: { x: number; y: number }) {
    this.v.copy(p).project(this.camara);
    destino.x = (this.v.x * 0.5 + 0.5) * this.anchoCss;
    destino.y = (-this.v.y * 0.5 + 0.5) * this.altoCss;
    return destino;
  }

  private medir() {
    const r = this.host.getBoundingClientRect();
    this.anchoCss = Math.max(1, r.width);
    this.altoCss = Math.max(1, r.height);
    this.dpr = Math.min(window.devicePixelRatio || 1, this.dprMax);
    this.altoPx = Math.round(this.altoCss * this.dpr);
    if (this.renderer) {
      this.renderer.setPixelRatio(this.dpr);
      this.renderer.setSize(this.anchoCss, this.altoCss, false);
    }
    this.camara.aspect = this.anchoCss / this.altoCss;
    this.camara.updateProjectionMatrix();
    this.alRedimensionar(this.anchoCss, this.altoCss, this.altoPx);
    this.sucio = true;
  }

  private alCambiarVisibilidad = () => {
    this.oculto = document.visibilityState === "hidden";
    if (!this.oculto) {
      this.ultimo = performance.now();
      this.sucio = true;
    }
  };

  private bucle = (ahora: number) => {
    this.raf = requestAnimationFrame(this.bucle);
    if (!this.visible || this.oculto || !this.renderer) return;
    const dt = Math.min(0.05, (ahora - this.ultimo) / 1000); // tras una pausa, sin saltos
    this.ultimo = ahora;

    let mueve = this.moverRotable(dt, ahora);
    if (this.actualizar(ahora / 1000, dt)) mueve = true;
    if (mueve || this.sucio) {
      this.sucio = false;
      this.renderer.render(this.escena, this.camara);
      this.trasDibujar();
    }
  };

  private moverRotable(dt: number, ahora: number): boolean {
    let mueve = false;
    if (!this.arrastre) {
      // Inercia: decae con fricción exponencial (independiente de la tasa de cuadros)
      if (Math.abs(this.velYaw) > 0.0005 || Math.abs(this.velPitch) > 0.0005) {
        const f = Math.exp(-dt * 3.2);
        this.velYaw *= f;
        this.velPitch *= f;
        this.rotable.rotation.y += this.velYaw * dt;
        this.inclinar(this.velPitch * dt);
        mueve = true;
      }
      // Giro en reposo, que vuelve con suavidad (sin arranque brusco) tras interactuar
      if (this.giroReposo && !this.reducido && !this.enPausa && ahora > this.reanudarEn) {
        this.factorReposo = Math.min(1, this.factorReposo + dt * 0.6);
        this.rotable.rotation.y += this.giroReposo * this.factorReposo * dt;
        mueve = true;
      }
    }
    return mueve;
  }

  private inclinar(d: number) {
    const x = this.rotable.rotation.x + d;
    this.rotable.rotation.x = Math.max(-this.inclinacionMax, Math.min(this.inclinacionMax, x));
  }

  private ndc(ev: PointerEvent) {
    const r = this.lienzo.getBoundingClientRect();
    return { x: ((ev.clientX - r.left) / r.width) * 2 - 1, y: -((ev.clientY - r.top) / r.height) * 2 + 1 };
  }

  private alPresionar = (ev: PointerEvent) => {
    if (this.arrastre) return; // protección multitáctil: se ignora un segundo dedo
    this.arrastre = { id: ev.pointerId, x: ev.clientX, y: ev.clientY, t: performance.now() };
    this.movido = 0;
    this.velYaw = 0;
    this.velPitch = 0;
    this.factorReposo = 0;
    this.lienzo.setPointerCapture(ev.pointerId);
    this.lienzo.dataset.arrastrando = "";
  };

  private alMover = (ev: PointerEvent) => {
    const a = this.arrastre;
    if (!a) {
      if (ev.pointerType === "mouse") this.alPasar(this.ndc(ev));
      return;
    }
    if (ev.pointerId !== a.id) return;
    const ahora = performance.now();
    const dx = ev.clientX - a.x;
    const dy = ev.clientY - a.y;
    const dts = Math.max(0.008, (ahora - a.t) / 1000);
    const k = 3.2 / Math.max(320, this.anchoCss); // media anchura ≈ media vuelta
    this.rotable.rotation.y += dx * k * Math.PI;
    this.inclinar(dy * k * 1.2);
    // Velocidad suavizada para que el lanzamiento no dependa de un solo evento
    this.velYaw = this.velYaw * 0.6 + ((dx * k * Math.PI) / dts) * 0.4;
    this.velPitch = this.velPitch * 0.6 + ((dy * k * 1.2) / dts) * 0.4;
    this.movido += Math.abs(dx) + Math.abs(dy);
    a.x = ev.clientX;
    a.y = ev.clientY;
    a.t = ahora;
    this.sucio = true;
  };

  private alSoltar = (ev: PointerEvent) => {
    const a = this.arrastre;
    if (!a || ev.pointerId !== a.id) return;
    this.arrastre = null;
    delete this.lienzo.dataset.arrastrando;
    // Si el dedo se detuvo antes de soltar, no hay lanzamiento
    if (performance.now() - a.t > 90 || this.reducido) {
      this.velYaw = 0;
      this.velPitch = 0;
    }
    this.reanudarEn = performance.now() + 2500;
    if (this.movido < 6) this.alPulsar(this.ndc(ev));
  };

  private alSalir = () => {
    if (!this.arrastre) this.alPasar(null);
  };

  liberar() {
    this.liberada = true;
    cancelAnimationFrame(this.raf);
    this.ro.disconnect();
    this.io.disconnect();
    document.removeEventListener("visibilitychange", this.alCambiarVisibilidad);
    this.escena.traverse((o: Object3D) => {
      const m = o as Mesh;
      (m.geometry as BufferGeometry | undefined)?.dispose?.();
      const mat = m.material as Material | Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
      else mat?.dispose?.();
    });
    this.renderer?.dispose();
    this.renderer?.forceContextLoss();
    this.renderer = null;
    this.lienzo.remove();
    this.capaEtiquetas.remove();
  }
}
