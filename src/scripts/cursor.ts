import { alFrame, lerp, tactil } from './loop'

/**
 * Punto de 8px que va pegado al puntero y anillo de 36px que lo sigue con
 * lerp .2. Sobre un enlace o un botón el anillo crece a 48px; sobre un elemento
 * con `data-cursor` se convierte en una pastilla con la etiqueta de ese
 * atributo, desplazada abajo a la derecha para no tapar el texto.
 *
 * El atributo `data-cursor` ya viene traducido desde el servidor: cada página
 * es de un solo idioma.
 */
const SELECTOR = 'a,button,input,[data-cursor]'

export function iniciarCursor () {
  if (tactil) return

  const punto = document.querySelector<HTMLElement>('[data-cursor-punto]')
  const anillo = document.querySelector<HTMLElement>('[data-cursor-anillo]')
  const etiqueta = document.querySelector<HTMLElement>('[data-cursor-etiqueta]')
  if (!punto || !anillo || !etiqueta) return

  return montar(punto, anillo, etiqueta)
}

function montar (punto: HTMLElement, anillo: HTMLElement, etiqueta: HTMLElement) {
  punto.classList.remove('hidden')
  punto.style.display = 'block'
  anillo.classList.remove('hidden')
  anillo.style.display = 'flex'

  // Oculta el cursor nativo solo cuando el personalizado está activo.
  const oculta = document.createElement('style')
  oculta.textContent = '*{cursor:none !important}'
  document.head.appendChild(oculta)

  const pos = { x: -200, y: -200 }
  let estadoAnterior = ''

  function pintarEstado (objetivo: Element | null, texto: string) {
    if (objetivo && texto) {
      anillo.style.width = `${Math.max(56, texto.length * 7.2 + 24)}px`
      anillo.style.height = '26px'
      anillo.style.margin = '18px 0 0 16px'
      anillo.style.backgroundColor = 'var(--acc)'
      anillo.style.borderColor = 'transparent'
    } else {
      const lado = objetivo ? 48 : 36
      anillo.style.width = `${lado}px`
      anillo.style.height = `${lado}px`
      anillo.style.margin = `-${lado / 2}px 0 0 -${lado / 2}px`
      anillo.style.backgroundColor = 'transparent'
      anillo.style.borderColor = 'var(--mut)'
    }
    etiqueta.textContent = texto
  }

  function alMover (e: PointerEvent) {
    punto.style.transform = `translate(${e.clientX}px,${e.clientY}px)`

    const objetivo = e.target instanceof Element ? e.target.closest(SELECTOR) : null
    const texto = objetivo?.getAttribute('data-cursor') ?? ''
    const estado = objetivo ? `si:${texto}` : 'no'
    if (estado === estadoAnterior) return
    estadoAnterior = estado
    pintarEstado(objetivo, texto)
  }

  window.addEventListener('pointermove', alMover, { passive: true })

  const bajaFrame = alFrame(marco => {
    pos.x = lerp(pos.x, marco.raton.x, 0.2)
    pos.y = lerp(pos.y, marco.raton.y, 0.2)
    anillo.style.transform = `translate(${pos.x}px,${pos.y}px)`
  })

  return () => {
    bajaFrame()
    window.removeEventListener('pointermove', alMover)
    oculta.remove()
  }
}
