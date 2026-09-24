# Imágenes del portafolio

Se descubren por nombre de archivo desde [`src/data/imagenes.ts`](../data/imagenes.ts).
No hay que tocar ningún componente: basta con dejar el archivo aquí con el
nombre correcto y Astro lo optimiza en el build (`astro:assets`).

Formatos válidos: `.png`, `.jpg`, `.jpeg`, `.webp`, `.avif`.

## Foto de perfil

`src/assets/foto.jpg`

Se recorta a 4:5, así que conviene una imagen vertical (por ejemplo
1200 × 1500 px). Mientras no exista, la sección «sobre mí» muestra un marco
vacío con el texto de aviso.

## Capturas de proyecto

`src/assets/proyectos/<slug>.png`

El slug es el de [`src/data/proyectos.ts`](../data/proyectos.ts):

| Archivo | Proyecto |
|---|---|
| `samcore.png` | SamCore |
| `oculus.png` | OCULUS |
| `clara.png` | CLARA |
| `codemaster.png` | CodeMaster |
| `pokecards-3d.png` | PokeCards 3D |
| `peliculas-app.png` | Películas App |

Se muestran en 16:10 dentro del panel del proyecto y en 320 × 210 en la
preview flotante que sigue al cursor, así que lo ideal es una captura
horizontal de al menos 1280 × 800 px. Mientras falten, se ve el placeholder
de color rayado de cada proyecto.
