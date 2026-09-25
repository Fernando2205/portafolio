/**
 * Acceso a localStorage tolerante a fallos: en modo privado o con las cookies
 * bloqueadas los accesos lanzan, y el sitio tiene que seguir funcionando.
 */
export const CLAVES = {
  idioma: 'delio-lang',
  paleta: 'delio-palette',
  tema: 'delio-theme',
  secretos: 'delio-secrets',
  pistas: 'delio-hints',
  dorado: 'delio-gold'
} as const

export function leerTexto (clave: string): string | null {
  try {
    return localStorage.getItem(clave)
  } catch {
    return null
  }
}

export function escribirTexto (clave: string, valor: string) {
  try {
    localStorage.setItem(clave, valor)
  } catch {
    // sin persistencia, pero la sesión sigue
  }
}

export function leerJson<T> (clave: string, porDefecto: T): T {
  const texto = leerTexto(clave)
  if (texto === null) return porDefecto
  try {
    return JSON.parse(texto) as T
  } catch {
    return porDefecto
  }
}

export function escribirJson (clave: string, valor: unknown) {
  escribirTexto(clave, JSON.stringify(valor))
}
