export type Idioma = 'es' | 'en'

/** Un valor con una versión por idioma. */
export type Localizado<T = string> = Record<Idioma, T>

export const IDIOMAS: readonly Idioma[] = ['es', 'en']

export const IDIOMA_POR_DEFECTO: Idioma = 'es'

/** Para textos que son iguales en los dos idiomas (nombres propios, siglas). */
export function igual<T> (valor: T): Localizado<T> {
  return { es: valor, en: valor }
}

export function esIdioma (valor: string | undefined): valor is Idioma {
  return valor === 'es' || valor === 'en'
}
