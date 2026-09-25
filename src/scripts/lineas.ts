/**
 * Líneas del historial de la terminal. Viven en su propio módulo porque las
 * escriben varios sitios: el intérprete de comandos, el registro de secretos y
 * la propia terminal.
 *
 * - `in`  lo que escribió el visitante
 * - `out` salida normal
 * - `acc` salida destacada, en color de acento
 */
export type TipoLinea = 'in' | 'out' | 'acc'

export interface Linea {
  tipo: TipoLinea
  texto: string
}

export const CLASE_LINEA: Record<TipoLinea, string> = {
  in: 'text-fg',
  out: 'text-mut',
  acc: 'text-acct'
}

export const salida = (texto: string): Linea => ({ tipo: 'out', texto })

export const destacada = (texto: string): Linea => ({ tipo: 'acc', texto })
