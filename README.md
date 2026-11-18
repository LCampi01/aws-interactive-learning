# Pieza a pieza

Guía interactiva y gratuita, en español, para entender los servicios de AWS.
Es independiente: no está afiliada a Amazon Web Services ni cuenta con su respaldo.
Cada lección avanza paso a paso sobre un diagrama animado.

- 50 lecciones: redes, cómputo, almacenamiento, bases de datos, mensajería, datos, IA, seguridad y despliegue.
- 10 lecciones "a fondo" con ejemplos de configuración, casos de coste calculados y errores comunes.
- 150 preguntas de práctica y un catálogo con 87 servicios.

Es una sola página estática: no necesita servidor ni dependencias.

## Verla

Abre `sitio/index.html` en el navegador.

## Editarla

El contenido está en `fuente/`:

| Archivo | Contenido |
|---|---|
| `fuente/lecciones/*.js` | Las lecciones, una sección por archivo |
| `fuente/practica.js` | Las preguntas de cada lección |
| `fuente/servicios.js` | El catálogo de servicios y los pictogramas propios |
| `fuente/iconos.js` | Iconos oficiales de AWS (generado, no se edita a mano) |
| `fuente/motor.js` | El código que dibuja los diagramas y mueve la página |
| `fuente/plantilla.html` | La estructura y los estilos |

Después de cambiar algo, reconstruye la página (hace falta Python 3):

```bash
python construir.py
```

Para comprobar que ningún diagrama tiene piezas o flechas solapadas, abre la página,
entra en la consola del navegador y ejecuta `lint()`. Debe devolver una lista vacía.

## Publicarla

`vercel.json` indica a Vercel que publique la carpeta `sitio`. Cualquier otro hosting
de páginas estáticas sirve igual apuntando a esa carpeta.

Cuando el sitio tenga dirección definitiva, escríbela en `sitio.json` y reconstruye:
así se añaden las etiquetas que usa LinkedIn para la vista previa del enlace.

## Avisos

- Guía independiente. No está afiliada a Amazon Web Services.
- Precios, límites y disponibilidad de los servicios cambian. Los precios de los casos
  de coste son aproximados; confirma siempre en la documentación y la calculadora de AWS.
- Los iconos de servicio son los AWS Architecture Icons, propiedad de Amazon Web Services,
  usados según sus condiciones para diagramas de arquitectura.
