import { PERFIL } from '../data/perfil'

/**
 * Reloj en vivo de Cali. Va por setInterval y no por el bucle de frames:
 * cambia una vez por segundo y solo toca el textContent de los nodos, sin
 * volver a pintar nada más.
 */
function horaDeCali () {
  return new Date().toLocaleTimeString('es-CO', {
    timeZone: PERFIL.zonaHoraria,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
}

export { horaDeCali }

export function iniciarReloj () {
  const nodos = Array.from(document.querySelectorAll<HTMLElement>('[data-reloj]'))
  if (nodos.length === 0) return

  let anterior = ''
  const latido = () => {
    const ahora = horaDeCali()
    if (ahora === anterior) return
    anterior = ahora
    for (const nodo of nodos) nodo.textContent = ahora
  }

  latido()
  const id = window.setInterval(latido, 1000)
  return () => window.clearInterval(id)
}
