import { emit } from './bus'

/**
 * Intro de carga tipo consola. El porcentaje sube de 1 a 4 puntos cada 35ms y
 * un clic lo salta. Al terminar, el overlay se va con un fundido de .6s y se
 * avisa por el bus para que el hero revele las letras y las partículas pasen
 * de disperso a esfera.
 *
 * Solo se ve una vez por sesión: queda marcado en sessionStorage y el script
 * inline del <head> pone `data-intro="off"` en las visitas siguientes.
 */
export const MARCA_SESION = 'delio-intro'

function yaSeVio () {
  try {
    return sessionStorage.getItem(MARCA_SESION) === 'hecha'
  } catch {
    return false
  }
}

function marcarVista () {
  try {
    sessionStorage.setItem(MARCA_SESION, 'hecha')
  } catch {
    // sin sessionStorage la intro se verá de nuevo, nada más
  }
}

export function iniciarLoader () {
  const cargador = document.querySelector<HTMLElement>('[data-cargador]')
  if (!cargador) {
    emit('introFin')
    return
  }

  if (yaSeVio() || document.documentElement.dataset.intro === 'off') {
    cargador.remove()
    emit('introFin')
    return
  }

  return montar(cargador)
}

function montar (cargador: HTMLElement) {
  const salida = document.querySelector<HTMLElement>('[data-pct]')
  const barra = document.querySelector<HTMLElement>('[data-barra]')
  const lineas = Array.from(document.querySelectorAll<HTMLElement>('[data-boot]'))

  let pct = 0
  let terminado = false
  const salidas: number[] = []

  const intervalo = window.setInterval(avanzar, 35)

  function pintar () {
    if (salida) salida.textContent = String(pct)
    if (barra) barra.style.width = `${pct}%`
    for (const linea of lineas) {
      if (pct >= Number(linea.dataset.boot)) linea.hidden = false
    }
  }

  function avanzar () {
    pct = Math.min(100, pct + 1 + Math.floor(Math.random() * 4))
    pintar()
    if (pct >= 100) terminar()
  }

  function terminar () {
    if (terminado) return
    terminado = true
    window.clearInterval(intervalo)
    marcarVista()

    salidas.push(window.setTimeout(() => { cargador.style.opacity = '0' }, 250))
    salidas.push(window.setTimeout(() => {
      cargador.remove()
      document.documentElement.dataset.intro = 'off'
      emit('introFin')
    }, 850))
  }

  function saltar () {
    pct = 100
    pintar()
    terminar()
  }

  cargador.addEventListener('click', saltar)
  pintar()

  return () => {
    window.clearInterval(intervalo)
    for (const salida of salidas) window.clearTimeout(salida)
    cargador.removeEventListener('click', saltar)
  }
}
