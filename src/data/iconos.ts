import * as simpleIcons from 'simple-icons'

/**
 * Resuelve un slug de simple-icons a su path SVG en tiempo de build, para
 * poder inyectar el ícono en línea y no pedir nada al cliente.
 *
 * El nombre exportado es `si` + el slug con la primera letra en mayúscula
 * (`nodedotjs` → `siNodedotjs`).
 */
export interface Icono {
  title: string
  slug: string
  hex: string
  path: string
}

const catalogo = simpleIcons as unknown as Record<string, Icono | undefined>

export function iconoDe (slug: string | null | undefined): Icono | undefined {
  if (!slug) return undefined
  return catalogo[`si${slug.charAt(0).toUpperCase()}${slug.slice(1)}`]
}
