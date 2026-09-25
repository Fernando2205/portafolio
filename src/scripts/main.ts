import { TOTAL_SECRETOS } from '../data/secretos'
import { iniciarSobre } from './about'
import { iniciarLogros } from './achievements'
import { limpiar } from './bus'
import { iniciarReloj } from './clock'
import { iniciarContacto } from './contact'
import { iniciarCursor } from './cursor'
import { iniciarHuevos } from './eggs'
import { iniciarHero } from './hero'
import { iniciarTrayectoria } from './journey'
import { iniciarLoader } from './loader'
import { invalidarLayout } from './loop'
import { iniciarMarquesina } from './marquee'
import { iniciarNav } from './nav'
import { iniciarParticulas } from './particles'
import { iniciarFisica } from './physics'
import { iniciarProyectos } from './projects'
import { cargarSecretos, totalEncontrados } from './secrets'
import { iniciarScroll } from './scroll'
import { iniciarTerminal } from './terminal'
import { inicializarTema } from './theme'

/**
 * Único punto de entrada del cliente. Con el ClientRouter de Astro los módulos
 * se cargan una sola vez y el DOM se reemplaza en cada navegación, así que todo
 * el cableado va en `astro:page-load` y las bajas en `astro:before-swap`.
 */

type Baja = (() => void) | void

const bajas: Baja[] = []
let iniciado = false

/*
  El orden importa: el loader va al final porque avisa de `introFin` en cuanto
  arranca si la intro ya se vio, y quien lo escucha tiene que estar listo antes.
*/
const modulos = [
  iniciarNav,
  iniciarCursor,
  iniciarReloj,
  iniciarHero,
  iniciarMarquesina,
  iniciarSobre,
  iniciarTrayectoria,
  iniciarLogros,
  iniciarProyectos,
  iniciarFisica,
  iniciarContacto,
  iniciarParticulas,
  iniciarTerminal,
  iniciarHuevos,
  iniciarScroll,
  iniciarLoader
]

function iniciar () {
  if (iniciado) return
  iniciado = true

  cargarSecretos()
  inicializarTema(totalEncontrados(), TOTAL_SECRETOS)
  invalidarLayout()

  for (const modulo of modulos) bajas.push(modulo())
}

function destruir () {
  for (const baja of bajas) baja?.()
  bajas.length = 0
  limpiar()
  iniciado = false
}

document.addEventListener('astro:page-load', iniciar)
document.addEventListener('astro:before-swap', evento => {
  destruir()
  // Al cambiar de idioma no se repite la intro: se quita del documento
  // entrante antes del swap para que no haya ni un parpadeo.
  evento.newDocument.querySelector('[data-cargador]')?.remove()
})

// Red de seguridad: si el módulo llegara tarde al evento inicial.
if (document.readyState !== 'loading') iniciar()
