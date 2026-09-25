import { tDelDocumento } from '../i18n/utils'
import { gsap } from './gsap'
import { alFrame, limitar, reducido } from './loop'
import { abrirPanel, cerrarPanel } from './panels'
import { refrescarScroll } from './scroll'

/**
 * Sección de trayectoria: pestañas, línea de tiempo que se rellena con el
 * scroll y items que se despliegan de uno en uno.
 *
 * El filtrado lo hace CSS con `data-filtro`; aquí solo se cambia el atributo.
 */
export function iniciarTrayectoria () {
  const linea = document.querySelector<HTMLElement>('[data-tl]')
  if (!linea) return

  const dic = tDelDocumento()
  const bajas: Array<() => void> = []
  const relleno = linea.querySelector<HTMLElement>('[data-tl-relleno]')
  const items = Array.from(linea.querySelectorAll<HTMLElement>('[data-ti]'))
  let abierto: HTMLElement | null = null

  // Pestañas.
  const pestanas = Array.from(document.querySelectorAll<HTMLElement>('[data-pestana]'))
  const cambiarPestana = (e: Event) => {
    const boton = e.currentTarget
    if (!(boton instanceof HTMLElement) || !boton.dataset.pestana) return

    linea.dataset.filtro = boton.dataset.pestana
    for (const pestana of pestanas) {
      pestana.setAttribute('aria-selected', pestana === boton ? 'true' : 'false')
    }

    if (abierto) {
      abierto.hidden = true
      marcarBoton(abierto, false)
      abierto = null
    }

    if (!reducido) {
      const visibles = items.filter(item => item.dataset.tipo === boton.dataset.pestana)
      gsap.fromTo(
        visibles,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, x: 0, duration: 0.6, ease: 'expo.out', stagger: 0.06 }
      )
    }
    refrescarScroll()
  }

  for (const pestana of pestanas) {
    pestana.addEventListener('click', cambiarPestana)
    bajas.push(() => pestana.removeEventListener('click', cambiarPestana))
  }

  function marcarBoton (panel: HTMLElement, abiertoAhora: boolean) {
    const boton = panel.parentElement?.querySelector<HTMLElement>('[data-mas]')
    if (!boton) return
    boton.setAttribute('aria-expanded', String(abiertoAhora))
    boton.textContent = abiertoAhora ? dic.trayectoria.cerrar : dic.trayectoria.masDetalles
    boton.dataset.cursor = abiertoAhora ? dic.cursor.cerrar : dic.cursor.abrir
  }

  function alternar (panel: HTMLElement) {
    if (abierto === panel) {
      cerrarPanel(panel, () => marcarBoton(panel, false))
      abierto = null
      return
    }
    if (abierto) {
      const anterior = abierto
      cerrarPanel(anterior, () => marcarBoton(anterior, false))
    }
    abierto = panel
    abrirPanel(panel)
    marcarBoton(panel, true)
  }

  // Un clic en cualquier parte del item lo despliega, salvo sobre un enlace.
  const alClic = (e: Event) => {
    const objetivo = e.target
    if (objetivo instanceof Element && objetivo.closest('a')) return
    const item = e.currentTarget
    if (!(item instanceof HTMLElement)) return
    const panel = item.querySelector<HTMLElement>('[data-panel]')
    if (panel) alternar(panel)
  }

  for (const item of items) {
    item.addEventListener('click', alClic)
    bajas.push(() => item.removeEventListener('click', alClic))
  }

  // La línea se rellena y los nodos se encienden al pasar el 60% del viewport.
  bajas.push(alFrame(marco => {
    if (!marco.scrollSucio && !marco.rectSucio) return

    const caja = linea.getBoundingClientRect()
    const marca = window.innerHeight * 0.6

    if (relleno) {
      const progreso = limitar((marca - caja.top) / caja.height, 0, 1)
      relleno.style.height = `${progreso * 100}%`
    }

    for (const nodo of linea.querySelectorAll<HTMLElement>('[data-nodo]')) {
      const encendido = nodo.getBoundingClientRect().top < marca
      nodo.style.backgroundColor = encendido ? 'var(--acc)' : 'var(--bg)'
      nodo.style.borderColor = encendido ? 'var(--acc)' : 'var(--mut)'
      nodo.style.transform = encendido ? 'scale(1.2)' : 'none'
      nodo.style.boxShadow = encendido
        ? '0 0 0 6px color-mix(in srgb, var(--acc) 20%, transparent)'
        : 'none'
    }
  }))

  return () => {
    for (const baja of bajas) baja()
  }
}
