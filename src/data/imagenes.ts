import type { ImageMetadata } from 'astro'

/**
 * Las imágenes se descubren por convención de nombre: basta con dejar el
 * archivo en su carpeta y Astro lo optimiza en el build. Si no existe, la
 * sección cae al placeholder de color y el sitio sigue funcionando.
 *
 * - Capturas de proyecto: src/assets/proyectos/<slug>.{png,jpg,webp,avif}
 *   El slug es el de src/data/proyectos.ts (samcore, oculus, clara…).
 * - Foto de perfil:       src/assets/foto.{png,jpg,webp,avif}
 */

type Modulo = { default: ImageMetadata }

const capturas = import.meta.glob<Modulo>(
  '../assets/proyectos/*.{png,jpg,jpeg,webp,avif}',
  { eager: true }
)

export const CAPTURAS: Record<string, ImageMetadata> = Object.fromEntries(
  Object.entries(capturas).map(([ruta, modulo]) => {
    const archivo = ruta.slice(ruta.lastIndexOf('/') + 1)
    return [archivo.replace(/\.[^.]+$/, ''), modulo.default]
  })
)

export function capturaDe (slug: string): ImageMetadata | undefined {
  return CAPTURAS[slug]
}

/**
 * Todas las capturas de un proyecto, en orden: la principal (`<slug>`) y las
 * que se le añadan después (`<slug>-2`, `<slug>-3`…).
 *
 * Con dos o más, un proyecto de móvil las monta en collage en vez de dejar una
 * sola captura estrecha con mucho aire al lado.
 */
export function capturasDe (slug: string): ImageMetadata[] {
  return Object.keys(CAPTURAS)
    .filter(nombre => nombre === slug || nombre.startsWith(`${slug}-`))
    .sort()
    .map(nombre => CAPTURAS[nombre])
}

const fotos = import.meta.glob<Modulo>(
  '../assets/foto.{png,jpg,jpeg,webp,avif}',
  { eager: true }
)

export const FOTO_PERFIL: ImageMetadata | undefined = Object.values(fotos)[0]?.default
