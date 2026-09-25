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

/**
 * El ClientRouter trata el cambio de idioma como una navegación normal y
 * devuelve el scroll arriba. Como las dos rutas tienen la misma estructura, se
 * guarda la posición antes del swap y se restaura después.
 *
 * No se guarda el scroll en píxeles, sino la sección visible y cuánto se ha
 * bajado dentro de ella: los textos en español y en inglés no miden lo mismo, y
 * un desplazamiento absoluto iría acumulando error hacia el final de la página.
 */
interface Posicion {
  seccion: string | null
  desplazamiento: number
}

let posicionGuardada: Posicion | null = null

function capturarPosicion (): Posicion {
  let visible: HTMLElement | null = null
  for (const seccion of document.querySelectorAll<HTMLElement>('section[id]')) {
    if (seccion.getBoundingClientRect().top <= 1) visible = seccion
  }
  if (!visible) return { seccion: null, desplazamiento: window.scrollY }
  return { seccion: visible.id, desplazamiento: -visible.getBoundingClientRect().top }
}

function restaurarPosicion (posicion: Posicion) {
  const seccion = posicion.seccion ? document.getElementById(posicion.seccion) : null
  const destino = seccion
    ? seccion.getBoundingClientRect().top + window.scrollY + posicion.desplazamiento
    : posicion.desplazamiento

  // `instant` porque el html lleva scroll-behavior: smooth y aquí no queremos
  // ver el recorrido.
  window.scrollTo({ top: Math.max(0, destino), behavior: 'instant' })
}

document.addEventListener('astro:page-load', iniciar)

document.addEventListener('astro:before-swap', evento => {
  destruir()
  // Al cambiar de idioma no se repite la intro: se quita del documento
  // entrante antes del swap para que no haya ni un parpadeo.
  evento.newDocument.querySelector('[data-cargador]')?.remove()
  // Atrás y adelante del navegador los restaura el propio ClientRouter.
  posicionGuardada = evento.direction === 'forward' ? capturarPosicion() : null
})

document.addEventListener('astro:after-swap', () => {
  if (!posicionGuardada) return
  restaurarPosicion(posicionGuardada)
  posicionGuardada = null
})

// Red de seguridad: si el módulo llegara tarde al evento inicial.
if (document.readyState !== 'loading') iniciar()
