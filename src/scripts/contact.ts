import { PERFIL } from '../data/perfil'
import { gsap } from './gsap'
import { alFrame, reducido, tactil } from './loop'

/**
 * Sección de contacto: el correo gigante es magnético (sigue al cursor ×0.12
 * en horizontal y ×0.35 en vertical, dentro de un radio de +90px) y el botón
 * de debajo copia la dirección al portapapeles.
 */
const RADIO_EXTRA = 90

export function iniciarContacto () {
  const bajas: Array<() => void> = []

  const email = document.querySelector<HTMLElement>('[data-email]')
  if (email && !reducido && !tactil) {
    const moverX = gsap.quickTo(email, 'x', { duration: 0.7, ease: 'power3' })
    const moverY = gsap.quickTo(email, 'y', { duration: 0.7, ease: 'power3' })
    let centro: { x: number, y: number, mitadAncho: number, mitadAlto: number } | null = null

    bajas.push(alFrame(marco => {
      if (!centro || marco.rectSucio) {
        const caja = email.getBoundingClientRect()
        // La caja ya incluye el desplazamiento magnético: hay que descontarlo
        // para quedarse con el centro en reposo.
        const x = Number(gsap.getProperty(email, 'x')) || 0
        const y = Number(gsap.getProperty(email, 'y')) || 0
        centro = {
          x: caja.left + caja.width / 2 - x,
          y: caja.top + caja.height / 2 - y,
          mitadAncho: caja.width / 2,
          mitadAlto: caja.height / 2
        }
      }

      if (!marco.ratonMovido) return

      const dx = marco.raton.x - centro.x
      const dy = marco.raton.y - centro.y
      const dentro =
        Math.abs(dx) < centro.mitadAncho + RADIO_EXTRA &&
        Math.abs(dy) < centro.mitadAlto + RADIO_EXTRA

      moverX(dentro ? dx * 0.12 : 0)
      moverY(dentro ? dy * 0.35 : 0)
    }))
  }

  const copiar = document.querySelector<HTMLElement>('[data-copiar-email]')
  if (copiar) {
    const original = copiar.textContent ?? ''
    const confirmado = copiar.dataset.copiado ?? original
    let volver = 0

    const alCopiar = async () => {
      try {
        await navigator.clipboard.writeText(PERFIL.email)
      } catch {
        // sin permiso de portapapeles: el enlace mailto sigue estando
      }
      copiar.textContent = confirmado
      window.clearTimeout(volver)
      volver = window.setTimeout(() => { copiar.textContent = original }, 2200)
    }

    copiar.addEventListener('click', alCopiar)
    bajas.push(() => {
      copiar.removeEventListener('click', alCopiar)
      window.clearTimeout(volver)
    })
  }

  return () => {
    for (const baja of bajas) baja()
  }
}
