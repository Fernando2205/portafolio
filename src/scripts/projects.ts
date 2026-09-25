import { tDelDocumento } from '../i18n/utils'
import { on } from './bus'
import { alFrame, limitar, tactil } from './loop'
import { abrirPanel, cerrarPanel } from './panels'

/**
 * Sección de proyectos:
 *
 * - En hover el nombre se desplaza 20px, toma el acento y sube de peso.
 * - Una preview de 320×210 sigue al cursor con inercia y se inclina según la
 *   velocidad horizontal.
 * - Al abrir una fila se despliega el panel con la captura y los enlaces.
 * - Toda la lista se inclina levemente con la velocidad del scroll.
 */
export function iniciarProyectos () {
  const lista = document.querySelector<HTMLElement>('[data-lista-proyectos]')
  if (!lista) return

  const dic = tDelDocumento()
  const bajas: Array<() => void> = []
  const filas = Array.from(lista.querySelectorAll<HTMLElement>('[data-row]'))
  const preview = document.querySelector<HTMLElement>('[data-preview]')

  let filaEnHover: HTMLElement | null = null
  let filaAbierta: HTMLElement | null = null

  function nombreDe (fila: HTMLElement) {
    return fila.querySelector<HTMLElement>('[data-nombre]')
  }

  function botonDe (fila: HTMLElement) {
    return fila.querySelector<HTMLElement>('[data-mas-proyecto]')
  }

  function pintarNombre (fila: HTMLElement) {
    const nombre = nombreDe(fila)
    if (!nombre) return
    const enHover = fila === filaEnHover
    const abierta = fila === filaAbierta
    nombre.style.transform = enHover ? 'translateX(20px)' : 'none'
    nombre.style.color = enHover || abierta ? 'var(--acct)' : 'var(--fg)'
    nombre.style.fontVariationSettings = enHover ? "'wght' 600" : "'wght' 400"
  }

  function pintarPreview () {
    if (!preview) return
    for (const item of preview.querySelectorAll<HTMLElement>('[data-preview-item]')) {
      item.hidden = item.dataset.previewItem !== filaEnHover?.dataset.slug
    }
    const visible = filaEnHover !== null && filaEnHover !== filaAbierta && !tactil
    preview.style.opacity = visible ? '1' : '0'
  }

  const alEntrar = (e: Event) => {
    const fila = e.currentTarget
    if (!(fila instanceof HTMLElement)) return
    const anterior = filaEnHover
    filaEnHover = fila
    if (anterior) pintarNombre(anterior)
    pintarNombre(fila)
    pintarPreview()
  }

  const alSalirLista = () => {
    const anterior = filaEnHover
    filaEnHover = null
    if (anterior) pintarNombre(anterior)
    pintarPreview()
  }

  function marcarBoton (fila: HTMLElement, abierta: boolean) {
    const boton = botonDe(fila)
    if (!boton) return
    boton.setAttribute('aria-expanded', String(abierta))
    boton.style.transform = abierta ? 'rotate(45deg)' : 'none'
    boton.dataset.cursor = abierta ? dic.cursor.cerrar : dic.cursor.abrir
  }

  function alternar (fila: HTMLElement) {
    const panel = fila.querySelector<HTMLElement>('[data-panel]')
    if (!panel) return

    if (filaAbierta === fila) {
      cerrarPanel(panel, () => marcarBoton(fila, false))
      filaAbierta = null
      pintarNombre(fila)
      pintarPreview()
      return
    }

    if (filaAbierta) {
      const anterior = filaAbierta
      const panelAnterior = anterior.querySelector<HTMLElement>('[data-panel]')
      if (panelAnterior) cerrarPanel(panelAnterior, () => marcarBoton(anterior, false))
      pintarNombre(anterior)
    }

    filaAbierta = fila
    abrirPanel(panel)
    marcarBoton(fila, true)
    pintarNombre(fila)
    pintarPreview()
  }

  const alClicFila = (e: Event) => {
    const objetivo = e.target
    if (objetivo instanceof Element && objetivo.closest('a,[data-mas-proyecto]')) return
    const fila = e.currentTarget
    if (fila instanceof HTMLElement) alternar(fila)
  }

  const alClicBoton = (e: Event) => {
    e.stopPropagation()
    const fila = (e.currentTarget as HTMLElement).closest<HTMLElement>('[data-row]')
    if (fila) alternar(fila)
  }

  for (const fila of filas) {
    fila.addEventListener('mouseenter', alEntrar)
    fila.addEventListener('click', alClicFila)
    bajas.push(() => {
      fila.removeEventListener('mouseenter', alEntrar)
      fila.removeEventListener('click', alClicFila)
    })

    const boton = botonDe(fila)
    if (boton) {
      boton.addEventListener('click', alClicBoton)
      bajas.push(() => boton.removeEventListener('click', alClicBoton))
    }
  }

  lista.addEventListener('mouseleave', alSalirLista)
  bajas.push(() => lista.removeEventListener('mouseleave', alSalirLista))

  // Abrir un proyecto desde una tarjeta de logros o desde la terminal.
  bajas.push(on('abrirProyecto', slug => {
    const fila = filas.find(f => f.dataset.slug === slug)
    if (!fila) return
    if (filaAbierta !== fila) alternar(fila)
    window.setTimeout(() => {
      document.getElementById('proyectos')?.scrollIntoView({ behavior: 'smooth' })
    }, 150)
  }))

  // Inercia de la preview y inclinación de la lista con la velocidad de scroll.
  const posicion = { x: 0, y: 0 }
  bajas.push(alFrame(marco => {
    if (preview) {
      const dx = marco.raton.x - posicion.x
      posicion.x += dx * 0.12
      posicion.y += (marco.raton.y - posicion.y) * 0.12
      preview.style.transform =
        `translate(${posicion.x + 28}px,${posicion.y - 105}px) rotate(${limitar(dx * 0.06, -10, 10)}deg)`
    }
    lista.style.transform = `skewY(${limitar(marco.vel * 0.06, -3, 3)}deg)`
  }))

  return () => {
    for (const baja of bajas) baja()
  }
}
