"""Une fuente/ en la página final.

Uso:  python construir.py

Genera dos salidas con el mismo contenido:
  aws-pieza-a-pieza.html   fragmento para publicar como artefacto de Claude
  sitio/index.html         documento HTML completo, listo para Vercel, GitHub Pages, Netlify…

Las lecciones se ordenan por el nombre de archivo de fuente/lecciones/*.js.
Cada archivo contiene uno o varios objetos de lección separados por comas.

Si sitio.json tiene {"url": "https://tu-sitio.vercel.app"}, se añaden las etiquetas
og:url y, si existe sitio/og.png, og:image, que usa LinkedIn para la vista previa.
"""
import glob
import io
import json
import os

AQUI = os.path.dirname(os.path.abspath(__file__))
NOMBRE = "Pieza a pieza"
# La marca AWS va solo en la frase descriptiva, no en el nombre (normas de marca de AWS).
TITULO = NOMBRE + ": guía interactiva para AWS"
DESCRIPCION = (
    "Guía independiente, interactiva y gratuita en español para entender los servicios de AWS: "
    "50 lecciones con diagramas animados, casos de coste calculados y preguntas de práctica."
)
ICONO = (
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E"
    "%3Crect x='3' y='3' width='12' height='12' rx='3' fill='%23D86613'/%3E"
    "%3Crect x='17' y='3' width='12' height='12' rx='3' fill='%232E6AD9'/%3E"
    "%3Crect x='3' y='17' width='12' height='12' rx='3' fill='%23CC2F76'/%3E"
    "%3Crect x='17' y='17' width='12' height='12' rx='3' fill='%230A8C6E'/%3E%3C/svg%3E"
)


def leer(ruta):
    return io.open(os.path.join(AQUI, ruta), encoding="utf-8").read()


def escribir(ruta, texto):
    destino = os.path.join(AQUI, ruta)
    os.makedirs(os.path.dirname(destino), exist_ok=True)
    io.open(destino, "w", encoding="utf-8", newline="\n").write(texto)
    return len(texto.encode("utf-8")) // 1024


def documento(fragmento):
    """Convierte el fragmento del artefacto en un documento HTML completo."""
    corte = fragmento.index('<header class="top">')
    cabeza, cuerpo = fragmento[:corte].strip(), fragmento[corte:]
    cabeza = cabeza.replace("<title>%s</title>" % NOMBRE, "<title>%s</title>" % TITULO)
    url = ""
    if os.path.exists(os.path.join(AQUI, "sitio.json")):
        url = json.loads(leer("sitio.json")).get("url", "").rstrip("/")
    extra = [
        '<meta name="description" content="%s">' % DESCRIPCION,
        '<meta property="og:type" content="website">',
        '<meta property="og:title" content="%s">' % TITULO,
        '<meta property="og:description" content="%s">' % DESCRIPCION,
        '<link rel="icon" href="%s">' % ICONO,
    ]
    if url:
        extra.append('<meta property="og:url" content="%s/">' % url)
        if os.path.exists(os.path.join(AQUI, "sitio", "og.png")):
            extra.append('<meta property="og:image" content="%s/og.png">' % url)
            extra.append('<meta property="og:image:width" content="1200">')
            extra.append('<meta property="og:image:height" content="627">')
            extra.append('<meta name="twitter:card" content="summary_large_image">')
    # mismo punto de partida que añade Claude al publicar un artefacto
    base = "<style>html{color-scheme:light}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>"
    return (
        '<!doctype html>\n<html lang="es">\n<head>\n' + base + "\n" + cabeza + "\n" + "\n".join(extra)
        + "\n</head>\n<body>\n" + cuerpo.strip() + "\n</body>\n</html>\n"
    )


def main():
    plantilla = leer("fuente/plantilla.html")
    archivos = sorted(glob.glob(os.path.join(AQUI, "fuente", "lecciones", "*.js")))
    lecciones = ",\n\n".join(io.open(a, encoding="utf-8").read().strip().rstrip(",") for a in archivos)
    salida = (
        plantilla.replace("/*@@ICONOS@@*/", leer("fuente/iconos.js").strip())
        .replace("/*@@SERVICIOS@@*/", leer("fuente/servicios.js").strip())
        .replace("/*@@LECCIONES@@*/", lecciones)
        .replace("/*@@PRACTICA@@*/", leer("fuente/practica.js").strip())
        .replace("/*@@MOTOR@@*/", leer("fuente/motor.js").strip())
    )
    kb = escribir("aws-pieza-a-pieza.html", salida)
    escribir("sitio/index.html", documento(salida))
    print("%d archivos de lecciones, %d KB -> aws-pieza-a-pieza.html y sitio/index.html" % (len(archivos), kb))


if __name__ == "__main__":
    main()
