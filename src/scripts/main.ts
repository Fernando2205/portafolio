import { TOTAL_SECRETOS } from '../data/secretos'
import { limpiar } from './bus'
import { iniciarReloj } from './clock'
import { iniciarCursor } from './cursor'
import { CLAVES, leerJson } from './store'
import { inicializarTema } from './theme'

/**
 * Único punto de entrada del cliente. Con el ClientRouter de Astro los módulos
 * se cargan una sola vez y el DOM se reemplaza en cada navegación, así que todo
 * el cableado va en `astro:page-load` y las bajas en `astro:before-swap`.
 */

type Baja = (() => void) | void

const bajas: Baja[] = []
let iniciado = false

function iniciar () {
  if (iniciado) return
  iniciado = true

  const secretos = leerJson<string[]>(CLAVES.secretos, [])
  inicializarTema(secretos.length, TOTAL_SECRETOS)

  bajas.push(iniciarReloj())
  bajas.push(iniciarCursor())
}

function destruir () {
  for (const baja of bajas) baja?.()
  bajas.length = 0
  limpiar()
  iniciado = false
}

document.addEventListener('astro:page-load', iniciar)
document.addEventListener('astro:before-swap', destruir)

// Red de seguridad: si el módulo llegara tarde al evento inicial.
if (document.readyState !== 'loading') iniciar()
