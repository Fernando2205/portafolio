import type { ClaveSecreto } from '../data/secretos'
import type { NombrePaleta } from '../data/paletas'
import type { Linea } from './lineas'

/**
 * Bus de eventos tipado. Los módulos de cliente no se importan entre sí para
 * reaccionar a cambios: publican y escuchan aquí.
 */
export interface Eventos {
  /** La intro de carga terminó (o no había). */
  introFin: void
  /** Se hizo clic en el logo (lo cuenta eggs.ts). */
  logo: void
  /** Cambió la sección visible. El valor es el id de la <section>. */
  seccion: string
  /** Cambió la paleta, el modo claro/oscuro o el acento. */
  tema: { paleta: NombrePaleta, oscuro: boolean, acento: string }
  /** Se encontró un secreto. */
  secreto: ClaveSecreto
  /** Se completaron los 8 secretos. */
  recompensa: void
  /** Imprime líneas en la terminal desde fuera de ella. */
  imprimir: Linea[]
  /** Abre el panel de un proyecto por su slug y baja hasta él. */
  abrirProyecto: string
  /** Ejecuta un comando en la terminal. */
  ejecutar: string
  /** Enciende el modo fiesta durante N milisegundos. */
  fiesta: number
  /** Las partículas forman una palabra durante N milisegundos. */
  palabra: { texto: string, ms: number }
  /** Empuja un giro extra a la figura 3D. */
  girar: number
  /** El visor cambió de tamaño. */
  medir: void
}

type Oyente<K extends keyof Eventos> = (dato: Eventos[K]) => void

const oyentes = new Map<keyof Eventos, Set<Oyente<never>>>()

export function on<K extends keyof Eventos> (evento: K, oyente: Oyente<K>) {
  let conjunto = oyentes.get(evento)
  if (!conjunto) {
    conjunto = new Set()
    oyentes.set(evento, conjunto)
  }
  conjunto.add(oyente as Oyente<never>)
  return () => { conjunto?.delete(oyente as Oyente<never>) }
}

export function emit<K extends keyof Eventos> (
  evento: K,
  ...dato: Eventos[K] extends void ? [] : [Eventos[K]]
) {
  const conjunto = oyentes.get(evento)
  if (!conjunto) return
  for (const oyente of conjunto) {
    (oyente as Oyente<K>)(dato[0] as Eventos[K])
  }
}

/** Borra todos los oyentes. Se llama antes de cada swap del ClientRouter. */
export function limpiar () {
  oyentes.clear()
}
