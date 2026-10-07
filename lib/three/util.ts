import { CanvasTexture, Color, SRGBColorSpace, Vector3 } from "three";

export const COLOR = {
  navy: new Color("#071A5F"),
  deep: new Color("#040C33"),
  tech: new Color("#1A7AB3"),
  cyan: new Color("#A2D9F9"),
  blanco: new Color("#FFFFFF"),
};

/** Latitud/longitud (grados) a un punto de la esfera; lon 0 mira a +Z (hacia la cámara). */
export function aEsfera(lat: number, lon: number, r = 1, destino = new Vector3()) {
  const f = (lat * Math.PI) / 180;
  const l = (lon * Math.PI) / 180;
  return destino.set(r * Math.cos(f) * Math.sin(l), r * Math.sin(f), r * Math.cos(f) * Math.cos(l));
}

let texturaBrillo: CanvasTexture | null = null;
/** Textura radial suave (para halos, paquetes de datos y destellos). Compartida. */
export function brillo(): CanvasTexture {
  if (texturaBrillo) return texturaBrillo;
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.18, "rgba(255,255,255,0.85)");
  grad.addColorStop(0.45, "rgba(255,255,255,0.22)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  texturaBrillo = new CanvasTexture(c);
  texturaBrillo.colorSpace = SRGBColorSpace;
  return texturaBrillo;
}

/** Brillo de borde (Fresnel): más intenso donde la superficie se ve de canto. */
export const fresnelVertex = /* glsl */ `
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal);
    vV = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;
export const fresnelFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uPotencia;
  uniform float uIntensidad;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), uPotencia);
    gl_FragColor = vec4(uColor, f * uIntensidad);
  }
`;

/** Curva de ease-out fuerte (equivale a cubic-bezier(0.23, 1, 0.32, 1) en forma). */
export const easeOut = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 4);
