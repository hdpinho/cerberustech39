"""
Extrae el logo oficial de Cerberus Tech 39 del PDF vectorial (brand/ceerberus.pdf)
a SVG para la web (public/brand/). No redibuja ni recolorea: cada SVG es la
conversión directa de los trazos del PDF, recortada a la caja real del dibujo.

- Versiones a color: tal cual.
- Versiones blancas: el PDF las trae sobre un rectángulo navy que es solo el fondo
  de la mesa de trabajo (los PNG oficiales tienen esos huecos transparentes). Se
  usa el propio dibujo como máscara de luminancia: blanco = visible, navy = transparente.
- Isotipo: la franja superior del logo vertical (el escudo con las tres cabezas).

Uso: python scripts/extraer-logo.py   (requiere PyMuPDF: pip install pymupdf)
"""
import os
import re

import pymupdf

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PDF = os.path.join(RAIZ, "brand", "ceerberus.pdf")
SALIDA = os.path.join(RAIZ, "public", "brand")
NAVY_FONDO = "#001a4c"
MARGEN = 2  # puntos alrededor del dibujo

# página del PDF → (nombre, blanco, recortar solo el isotipo)
VARIANTES = [
    (0, "logo-vertical-color", False, False),
    (1, "logo-horizontal-color", False, False),
    (2, "logo-apilado-color", False, False),
    (3, "logo-horizontal-blanco", True, False),
    (4, "logo-vertical-blanco", True, False),
    (0, "isotipo-color", False, True),
    (4, "isotipo-blanco", True, True),
]


def caja_dibujo(pagina, solo_isotipo):
    rects = [d["rect"] for d in pagina.get_drawings() if d["rect"].width < pagina.rect.width * 0.98]
    if solo_isotipo:
        # El isotipo termina antes del primer hueco vertical (el texto va debajo)
        corte = min(r.y0 for r in rects if r.y0 > pagina.rect.height * 0.7)
        rects = [r for r in rects if r.y1 <= corte]
    caja = rects[0]
    for r in rects[1:]:
        caja |= r
    return pymupdf.Rect(caja.x0 - MARGEN, caja.y0 - MARGEN, caja.x1 + MARGEN, caja.y1 + MARGEN)


def a_mascara(svg):
    """Convierte 'blanco sobre navy' en 'blanco sobre transparente' sin tocar el dibujo."""
    m = re.match(r'(<svg[^>]*>)(.*)(</svg>\s*)$', svg, re.S)
    apertura, cuerpo, cierre = m.group(1), m.group(2), m.group(3)
    vb = re.search(r'viewBox="([^"]+)"', apertura).group(1).split()
    x, y, w, h = vb
    # Dentro de la máscara el navy pasa a negro (transparente); el blanco queda blanco
    cuerpo_mascara = cuerpo.replace(f'fill="{NAVY_FONDO}"', 'fill="#000"')
    return (
        f'{apertura}<defs><mask id="m" maskUnits="userSpaceOnUse" x="{x}" y="{y}" width="{w}" height="{h}">'
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="#000"/>{cuerpo_mascara}</mask></defs>'
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="#fff" mask="url(#m)"/>{cierre}'
    )


os.makedirs(SALIDA, exist_ok=True)
doc = pymupdf.open(PDF)
for num, nombre, blanco, isotipo in VARIANTES:
    pagina = doc[num]
    pagina.set_cropbox(caja_dibujo(pagina, isotipo))
    svg = pagina.get_svg_image(text_as_path=True)
    if blanco:
        svg = a_mascara(svg)
    ruta = os.path.join(SALIDA, f"{nombre}.svg")
    with open(ruta, "w", encoding="utf-8") as f:
        f.write(svg)
    caja = pagina.cropbox
    print(f"{nombre}.svg  {caja.width:.0f}×{caja.height:.0f} pt  {len(svg) / 1024:.0f} KB")
    pagina.set_cropbox(pagina.mediabox)
