import { PERFIL } from '../data/perfil'
import { pausarCursor } from './cursor'
import { tactil } from './loop'

/**
 * Visor del CV. El enlace apunta al PDF de verdad, así que sin JavaScript
 * sigue abriéndolo en una pestaña; con JavaScript se intercepta el clic y se
 * muestra el <dialog>.
 *
 * En táctil y en pantallas estrechas no se intercepta: iOS no renderiza PDF
 * dentro de un iframe, y el visor nativo del navegador funciona mejor.
 */
const ANCHO_MINIMO = 768

export function iniciarVisorCv () {
  const disparador = document.querySelector<HTMLAnchorElement>('[data-ver-cv]')
  const visor = document.querySelector<HTMLDialogElement>('[data-visor-cv]')
  if (!disparador || !visor) return

  const marco = visor.querySelector<HTMLIFrameElement>('[data-visor-marco]')
  const cerrar = visor.querySelector<HTMLElement>('[data-cerrar-cv]')

  const alAbrir = (e: MouseEvent) => {
    if (tactil || window.innerWidth < ANCHO_MINIMO) return
    e.preventDefault()

    // El PDF se pide la primera vez que se abre, no al cargar la página.
    if (marco && !marco.getAttribute('src')) marco.setAttribute('src', PERFIL.cv)

    visor.showModal()
    // El cursor personalizado queda por debajo de la capa superior del
    // <dialog>, así que dentro del visor no se vería: se devuelve el nativo.
    pausarCursor(true)
    document.body.style.overflow = 'hidden'
  }

  const alCerrar = () => visor.close()

  // Clic en el fondo: el <dialog> recibe el evento cuando se pulsa fuera.
  const alClicFondo = (e: MouseEvent) => {
    if (e.target === visor) visor.close()
  }

  // Cubre también el cierre con Escape, que lo hace el navegador por su cuenta.
  const alCerrarse = () => {
    pausarCursor(false)
    document.body.style.overflow = ''
  }

  disparador.addEventListener('click', alAbrir)
  cerrar?.addEventListener('click', alCerrar)
  visor.addEventListener('click', alClicFondo)
  visor.addEventListener('close', alCerrarse)

  return () => {
    disparador.removeEventListener('click', alAbrir)
    cerrar?.removeEventListener('click', alCerrar)
    visor.removeEventListener('click', alClicFondo)
    visor.removeEventListener('close', alCerrarse)
    if (visor.open) visor.close()
    alCerrarse()
  }
}
