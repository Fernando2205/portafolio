import { on } from './bus'
import { argumentosDe, candidatos, crearInterprete } from './commands'
import { gsap } from './gsap'
import { CLASE_LINEA, type Linea } from './lineas'
import { alFrame, reducido, tactil } from './loop'

/**
 * Ventana de la terminal: historial, entrada con autocompletado fantasma,
 * historial de comandos con las flechas y la inclinación 3D con el ratón.
 */
export function iniciarTerminal () {
  const ventana = document.querySelector<HTMLElement>('[data-terminal-ventana]')
  const cuerpo = document.querySelector<HTMLElement>('[data-terminal-cuerpo]')
  const historial = document.querySelector<HTMLElement>('[data-terminal-historial]')
  const entrada = document.querySelector<HTMLInputElement>('[data-terminal-input]')
  const eco = document.querySelector<HTMLElement>('[data-terminal-eco]')
  const fantasma = document.querySelector<HTMLElement>('[data-terminal-fantasma]')
  const indicador = document.querySelector<HTMLElement>('[data-terminal-prompt]')

  if (!ventana || !cuerpo || !historial || !entrada) return

  return montar({ ventana, cuerpo, historial, entrada, eco, fantasma, indicador })
}

interface Nodos {
  ventana: HTMLElement
  cuerpo: HTMLElement
  historial: HTMLElement
  entrada: HTMLInputElement
  eco: HTMLElement | null
  fantasma: HTMLElement | null
  indicador: HTMLElement | null
}

function montar (nodos: Nodos) {
  const { ventana, cuerpo, historial, entrada, eco, fantasma, indicador } = nodos
  const bajas: Array<() => void> = []

  /** Comandos ya escritos, para las flechas ↑ y ↓. */
  const previos: string[] = []
  let indicePrevio = 0
  /** Estado del recorrido de opciones con Tab. */
  let ciclo: { base: string, opciones: string[] } | null = null

  const interprete = crearInterprete({ imprimir, limpiar })

  function textoDelPrompt () {
    return interprete.enJuego() ? '?' : '~ $'
  }

  function refrescarPrompt () {
    if (indicador) indicador.textContent = textoDelPrompt()
  }

  function imprimir (lineas: Linea[], comando?: string) {
    const nuevas: Linea[] = comando != null
      ? [{ tipo: 'in', texto: `${textoDelPrompt()} ${comando}` }, ...lineas]
      : lineas

    const elementos = nuevas.map(linea => {
      const div = document.createElement('div')
      div.className = `whitespace-pre-wrap ${CLASE_LINEA[linea.tipo]}`
      div.textContent = linea.texto
      historial.appendChild(div)
      return div
    })

    cuerpo.scrollTop = cuerpo.scrollHeight
    if (!reducido && elementos.length > 0) {
      gsap.from(elementos, {
        opacity: 0,
        x: -8,
        duration: 0.3,
        ease: 'power2.out',
        stagger: 0.035
      })
    }
  }

  function limpiar () {
    historial.replaceChildren()
    entrada.value = ''
    pintarFantasma()
  }

  function ejecutar (bruto: string) {
    const comando = bruto.trim()
    if (comando) {
      previos.push(comando)
      indicePrevio = previos.length
    }
    ciclo = null
    interprete.ejecutar(bruto)
    entrada.value = ''
    refrescarPrompt()
    pintarFantasma()
  }

  function sugerenciaPara (valor: string) {
    const mejor = candidatos(valor, interprete.enJuego())[0]
    if (!mejor) return ''
    return mejor.length > valor.length && mejor.startsWith(valor.toLowerCase())
      ? mejor.slice(valor.length)
      : ''
  }

  function pintarFantasma () {
    if (eco) eco.textContent = entrada.value
    if (fantasma) fantasma.textContent = sugerenciaPara(entrada.value)
  }

  /**
   * Tab completa el prefijo común; si no hay más prefijo, lista las opciones
   * como bash y con más Tab va pasando por cada una.
   */
  function completar () {
    const valor = entrada.value
    if (!valor.trim()) return

    if (ciclo && (ciclo.base === valor || ciclo.opciones.includes(valor))) {
      const siguiente = (ciclo.opciones.indexOf(valor) + 1) % ciclo.opciones.length
      entrada.value = ciclo.opciones[siguiente]
      pintarFantasma()
      return
    }

    const opciones = candidatos(valor, interprete.enJuego())
    if (opciones.length === 0) return

    if (opciones.length === 1) {
      ciclo = null
      const unica = opciones[0]
      // Si el comando espera argumento, deja el espacio puesto.
      const espera = !unica.includes(' ') && argumentosDe(unica) !== undefined
      entrada.value = espera ? `${unica} ` : unica
      pintarFantasma()
      return
    }

    let prefijo = opciones[0]
    for (const opcion of opciones) {
      while (!opcion.startsWith(prefijo)) prefijo = prefijo.slice(0, -1)
    }

    if (prefijo.length > valor.length) {
      entrada.value = prefijo
      pintarFantasma()
      return
    }

    ciclo = { base: valor, opciones }
    imprimir([
      { tipo: 'in', texto: `${textoDelPrompt()} ${valor}` },
      { tipo: 'out', texto: opciones.map(op => op.split(' ').pop() ?? op).join('   ') }
    ])
  }

  const alTeclear = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      ejecutar(entrada.value)
      return
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (indicePrevio > 0) {
        indicePrevio -= 1
        entrada.value = previos[indicePrevio]
        pintarFantasma()
      }
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (indicePrevio < previos.length) {
        indicePrevio += 1
        entrada.value = previos[indicePrevio] ?? ''
        pintarFantasma()
      }
      return
    }

    if (e.key === 'Tab') {
      e.preventDefault()
      completar()
      return
    }

    // La flecha derecha al final de la línea acepta la sugerencia.
    if (e.key === 'ArrowRight' && entrada.selectionStart === entrada.value.length) {
      const resto = sugerenciaPara(entrada.value)
      if (resto) {
        e.preventDefault()
        entrada.value += resto
        pintarFantasma()
      }
    }
  }

  const alEscribir = () => {
    ciclo = null
    pintarFantasma()
  }

  const alClicVentana = () => entrada.focus({ preventScroll: true })

  entrada.addEventListener('keydown', alTeclear)
  entrada.addEventListener('input', alEscribir)
  ventana.addEventListener('click', alClicVentana)
  bajas.push(() => {
    entrada.removeEventListener('keydown', alTeclear)
    entrada.removeEventListener('input', alEscribir)
    ventana.removeEventListener('click', alClicVentana)
  })

  for (const boton of document.querySelectorAll<HTMLElement>('[data-sugerencia]')) {
    const lanzar = (e: Event) => {
      e.stopPropagation()
      ejecutar(boton.dataset.sugerencia ?? '')
    }
    boton.addEventListener('click', lanzar)
    bajas.push(() => boton.removeEventListener('click', lanzar))
  }

  bajas.push(on('ejecutar', comando => ejecutar(comando)))
  bajas.push(on('imprimir', lineas => imprimir(lineas)))

  // Inclinación 3D de la ventana con el ratón: ±7° y ±9°.
  if (!reducido && !tactil) {
    gsap.set(ventana, { transformPerspective: 1400 })
    const girarX = gsap.quickTo(ventana, 'rotationX', { duration: 0.8, ease: 'power3' })
    const girarY = gsap.quickTo(ventana, 'rotationY', { duration: 0.8, ease: 'power3' })
    let caja: DOMRect | null = null

    bajas.push(alFrame(marco => {
      if (!caja || marco.rectSucio) caja = ventana.getBoundingClientRect()
      if (!marco.ratonMovido) return

      const { x, y } = marco.raton
      const dentro = x > caja.left && x < caja.right && y > caja.top && y < caja.bottom
      girarX(dentro ? -((y - caja.top) / caja.height - 0.5) * 7 : 0)
      girarY(dentro ? ((x - caja.left) / caja.width - 0.5) * 9 : 0)
    }))
  }

  refrescarPrompt()
  pintarFantasma()

  return () => {
    for (const baja of bajas) baja()
  }
}
