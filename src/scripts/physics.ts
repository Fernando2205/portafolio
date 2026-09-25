import { on } from './bus'
import { alFrame, reducido } from './loop'

/**
 * Física de las pastillas del stack: caen con gravedad al entrar en pantalla,
 * chocan entre sí con AABB y se apilan, se pueden arrastrar y lanzar, y el
 * botón «sacudir» las lanza hacia arriba.
 *
 * Con prefers-reduced-motion no se activa: las pastillas se quedan en el flujo
 * normal, como una nube de etiquetas.
 */
interface Pastilla {
  el: HTMLElement
  x: number
  y: number
  w: number
  h: number
  vx: number
  vy: number
  rot: number
  arrastrando: boolean
  /** Mientras cae desde arriba puede estar por encima del recuadro. */
  entrando: boolean
}

let pastillas: Pastilla[] = []
/** 0 = quieta hasta que el recuadro entra en pantalla, ±1 = cayendo. */
let gravedad = 0

/** Invierte la gravedad del stack. Devuelve el signo nuevo. */
export function invertirGravedad () {
  gravedad = gravedad < 0 ? 1 : -1
  for (const pastilla of pastillas) pastilla.entrando = false
  return gravedad
}

export function sacudirStack () {
  if (gravedad === 0) gravedad = 1
  for (const pastilla of pastillas) {
    pastilla.entrando = false
    pastilla.vy = -(8 + Math.random() * 14) * Math.sign(gravedad)
    pastilla.vx = (Math.random() - 0.5) * 26
  }
}

export function iniciarFisica () {
  const caja = document.querySelector<HTMLElement>('[data-juego]')
  if (!caja || reducido) return

  const bajas: Array<() => void> = []
  const elementos = Array.from(caja.querySelectorAll<HTMLElement>('[data-chip]'))
  if (elementos.length === 0) return

  // Las posiciones iniciales salen del layout en flujo, antes de absolutizar.
  const iniciales = elementos.map(el => ({
    x: el.offsetLeft,
    y: el.offsetTop,
    w: el.offsetWidth,
    h: el.offsetHeight
  }))

  pastillas = elementos.map((el, i) => {
    el.style.position = 'absolute'
    el.style.left = '0'
    el.style.top = '0'
    el.dataset.chip = String(i)
    return {
      el,
      x: iniciales[i].x,
      y: -iniciales[i].h - 40 - Math.random() * 700,
      w: iniciales[i].w,
      h: iniciales[i].h,
      vx: (Math.random() - 0.5) * 3,
      vy: 0,
      rot: (Math.random() - 0.5) * 10,
      arrastrando: false,
      entrando: true
    }
  })

  for (const pastilla of pastillas) {
    pastilla.el.style.transform = `translate(${pastilla.x}px,${pastilla.y}px)`
  }

  let visible = true
  let zIndice = 1
  let arrastre: { pastilla: Pastilla, dx: number, dy: number } | null = null

  // La caída arranca cuando el recuadro entra en pantalla.
  const alEntrar = new IntersectionObserver(entradas => {
    if (entradas[0]?.isIntersecting) {
      if (gravedad === 0) gravedad = 1
      alEntrar.disconnect()
    }
  }, { threshold: 0.35 })
  alEntrar.observe(caja)

  const alVer = new IntersectionObserver(
    entradas => { visible = entradas[0]?.isIntersecting ?? true },
    { rootMargin: '100px' }
  )
  alVer.observe(caja)

  function alBajarPuntero (e: PointerEvent) {
    const el = (e.target as Element | null)?.closest<HTMLElement>('[data-chip]')
    if (!el?.dataset.chip) return
    const pastilla = pastillas[Number(el.dataset.chip)]
    if (!pastilla) return

    e.preventDefault()
    pastilla.arrastrando = true
    pastilla.entrando = false
    pastilla.vx = 0
    pastilla.vy = 0
    zIndice += 1
    el.style.zIndex = String(zIndice)
    el.style.scale = '1.08'
    arrastre = { pastilla, dx: e.clientX - pastilla.x, dy: e.clientY - pastilla.y }
  }

  function alMoverPuntero (e: PointerEvent) {
    if (!arrastre) return
    const { pastilla, dx, dy } = arrastre
    const nx = e.clientX - dx
    const ny = e.clientY - dy
    // La velocidad se hereda del gesto, para poder lanzarlas.
    pastilla.vx = pastilla.vx * 0.4 + (nx - pastilla.x) * 0.6
    pastilla.vy = pastilla.vy * 0.4 + (ny - pastilla.y) * 0.6
    pastilla.x = nx
    pastilla.y = ny
  }

  function alSubirPuntero () {
    if (!arrastre) return
    arrastre.pastilla.arrastrando = false
    arrastre.pastilla.el.style.scale = '1'
    arrastre = null
  }

  caja.addEventListener('pointerdown', alBajarPuntero)
  window.addEventListener('pointermove', alMoverPuntero)
  window.addEventListener('pointerup', alSubirPuntero)
  window.addEventListener('pointercancel', alSubirPuntero)
  bajas.push(() => {
    caja.removeEventListener('pointerdown', alBajarPuntero)
    window.removeEventListener('pointermove', alMoverPuntero)
    window.removeEventListener('pointerup', alSubirPuntero)
    window.removeEventListener('pointercancel', alSubirPuntero)
  })

  const boton = document.querySelector<HTMLElement>('[data-sacudir]')
  if (boton) {
    boton.addEventListener('click', sacudirStack)
    bajas.push(() => boton.removeEventListener('click', sacudirStack))
  }

  bajas.push(on('medir', () => {
    for (const pastilla of pastillas) {
      pastilla.x = Math.max(0, Math.min(pastilla.x, caja.clientWidth - pastilla.w))
    }
  }))

  bajas.push(alFrame(() => {
    if (gravedad === 0 || !visible) return

    const ancho = caja.clientWidth
    const alto = caja.clientHeight
    const g = gravedad * 0.5

    for (const p of pastillas) {
      if (p.arrastrando) continue
      p.vy += g
      p.vx *= 0.99
      p.vy *= 0.995
      p.x += p.vx
      p.y += p.vy

      if (p.x < 0) {
        p.x = 0
        p.vx = Math.abs(p.vx) * 0.5
      }
      if (p.x > ancho - p.w) {
        p.x = ancho - p.w
        p.vx = -Math.abs(p.vx) * 0.5
      }
      if (p.y > alto - p.h) {
        p.y = alto - p.h
        p.vy = -Math.abs(p.vy) * 0.3
        p.vx *= 0.9
        if (Math.abs(p.vy) < 0.8) p.vy = 0
      }
      if (p.y >= 0) p.entrando = false
      if (p.y < 0 && !p.entrando) {
        p.y = 0
        p.vy = Math.abs(p.vy) * 0.3
        p.vx *= 0.9
        if (Math.abs(p.vy) < 0.8) p.vy = 0
      }
    }

    // Dos pasadas de resolución de colisiones: suficiente para que se apilen.
    for (let pasada = 0; pasada < 2; pasada++) {
      for (let i = 0; i < pastillas.length; i++) {
        for (let j = i + 1; j < pastillas.length; j++) {
          resolver(pastillas[i], pastillas[j])
        }
      }
    }

    for (const p of pastillas) {
      const giro = p.arrastrando ? 0 : Math.max(-25, Math.min(25, p.rot + p.vx * 1.2))
      p.el.style.transform = `translate(${p.x}px,${p.y}px) rotate(${giro}deg)`
    }
  }))

  return () => {
    alEntrar.disconnect()
    alVer.disconnect()
    for (const baja of bajas) baja()
    pastillas = []
    gravedad = 0
  }
}

function resolver (a: Pastilla, b: Pastilla) {
  const solapeX = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)
  if (solapeX <= 0) return
  const solapeY = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y)
  if (solapeY <= 0) return

  // Una pastilla arrastrada no se mueve: empuja a las demás.
  const pesoA = a.arrastrando ? 0 : 1
  const pesoB = b.arrastrando ? 0 : 1
  const total = pesoA + pesoB
  if (total === 0) return

  if (solapeX < solapeY) {
    const direccion = a.x < b.x ? -1 : 1
    a.x += (direccion * solapeX * pesoA) / total
    b.x -= (direccion * solapeX * pesoB) / total
    const media = (a.vx + b.vx) / 2
    if (pesoA) a.vx = media
    if (pesoB) b.vx = media
  } else {
    const direccion = a.y < b.y ? -1 : 1
    a.y += (direccion * solapeY * pesoA) / total
    b.y -= (direccion * solapeY * pesoB) / total
    const media = ((a.vy + b.vy) / 2) * 0.4
    if (pesoA) a.vy = media
    if (pesoB) b.vy = media
    a.vx *= 0.94
    b.vx *= 0.94
  }
}
