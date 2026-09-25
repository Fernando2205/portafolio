import { ACENTO_MATRIX } from '../data/paletas'
import { PERFIL } from '../data/perfil'
import { KONAMI } from '../data/secretos'
import { tDelDocumento } from '../i18n/utils'
import { on } from './bus'
import { gsap } from './gsap'
import { alFrame, reducido } from './loop'
import { formaTemporal } from './particles'
import { encontrado } from './secrets'
import { acentoTemporal } from './theme'

/**
 * Los efectos de los secretos que no son la terminal: modo fiesta, lluvia
 * Matrix, autodestrucción, giro del nombre, modo desarrollador y el secreto de
 * la consola del navegador.
 */
const CARACTERES_MATRIX = 'アイウエオカキクケコサシスセソ01DELIOPALACIOS<>/{}'
const MS_MATRIX = 6500

let estiloDev: HTMLStyleElement | null = null
let consolaAnunciada = false

export function iniciarHuevos () {
  const bajas: Array<() => void> = []

  bajas.push(cicloDeFiesta())
  bajas.push(codigoKonami())
  bajas.push(nombreTecleado())
  bajas.push(modoDesarrollador())
  bajas.push(secretoDeConsola())
  bajas.push(tituloAlIrse())

  return () => {
    for (const baja of bajas) baja()
  }
}

/** El acento del sitio cicla por el arcoíris mientras dura la fiesta. */
function cicloDeFiesta () {
  let hasta = 0
  const bajaEvento = on('fiesta', ms => { hasta = performance.now() + ms })

  const bajaFrame = alFrame(marco => {
    if (hasta === 0) return
    if (performance.now() < hasta) {
      document.documentElement.style.setProperty(
        '--acc',
        `hsl(${(marco.tiempo * 140) % 360} 85% 60%)`
      )
      return
    }
    hasta = 0
    // Devuelve el acento de la paleta.
    acentoTemporal(null)
  })

  return () => {
    bajaEvento()
    bajaFrame()
  }
}

function codigoKonami () {
  let teclas: string[] = []

  const alTeclear = (e: KeyboardEvent) => {
    const tecla = e.key.length === 1 ? e.key.toLowerCase() : e.key
    teclas = [...teclas, tecla].slice(-KONAMI.length)
    if (teclas.join(',') !== KONAMI.join(',')) return
    teclas = []
    lluviaMatrix()
    encontrado('konami')
  }

  window.addEventListener('keydown', alTeclear)
  return () => window.removeEventListener('keydown', alTeclear)
}

function lluviaMatrix () {
  const lienzo = document.querySelector<HTMLCanvasElement>('[data-matrix]')
  const ctx = lienzo?.getContext('2d')
  if (!lienzo || !ctx) return

  const ancho = (lienzo.width = window.innerWidth)
  const alto = (lienzo.height = window.innerHeight)
  const tamano = 16
  const columnas = Math.ceil(ancho / tamano)
  const gotas = Array.from({ length: columnas }, () => Math.random() * -60)

  acentoTemporal(ACENTO_MATRIX)
  gsap.to(lienzo, { opacity: 0.92, duration: 0.4 })

  const inicio = performance.now()
  const baja = alFrame(() => {
    ctx.fillStyle = 'rgba(0,0,0,.09)'
    ctx.fillRect(0, 0, ancho, alto)
    ctx.font = `${tamano}px JetBrains Mono, monospace`

    gotas.forEach((gota, i) => {
      ctx.fillStyle = Math.random() > 0.96 ? '#eafff0' : ACENTO_MATRIX
      const letra = CARACTERES_MATRIX[Math.floor(Math.random() * CARACTERES_MATRIX.length)]
      ctx.fillText(letra, i * tamano, gota * tamano)
      if (gota * tamano > alto && Math.random() > 0.975) gotas[i] = 0
      gotas[i] += 1
    })

    if (performance.now() - inicio < MS_MATRIX) return

    baja()
    gsap.to(lienzo, {
      opacity: 0,
      duration: 1,
      onComplete: () => ctx.clearRect(0, 0, ancho, alto)
    })
    acentoTemporal(null)
  })
}

/** Teclear «delio» fuera de un campo de texto gira las letras del titular. */
function nombreTecleado () {
  let buffer = ''

  const alTeclear = (e: KeyboardEvent) => {
    const etiqueta = (e.target as HTMLElement | null)?.tagName ?? ''
    if (etiqueta === 'INPUT' || etiqueta === 'TEXTAREA') return
    if (e.key.length !== 1) return

    buffer = (buffer + e.key.toLowerCase()).slice(-5)
    if (buffer !== 'delio') return
    buffer = ''

    const letras = Array.from(document.querySelectorAll<HTMLElement>('[data-hero] [data-letra]'))
    if (letras.length > 0 && !reducido) {
      gsap.fromTo(
        letras,
        { rotationX: 0 },
        { rotationX: 360, duration: 1.2, stagger: 0.05, ease: 'power3.inOut' }
      )
    }
    encontrado('name')
  }

  window.addEventListener('keydown', alTeclear)
  return () => window.removeEventListener('keydown', alTeclear)
}

/** Cinco clics en el logo en menos de 1.8s. */
function modoDesarrollador () {
  let clics: number[] = []

  return on('logo', () => {
    const ahora = Date.now()
    clics = [...clics.filter(t => ahora - t < 1800), ahora]
    if (clics.length < 5) return
    clics = []

    if (estiloDev) {
      estiloDev.remove()
      estiloDev = null
    } else {
      estiloDev = document.createElement('style')
      estiloDev.textContent =
        '*{outline:1px dashed color-mix(in srgb, var(--acc) 60%, transparent) !important;outline-offset:-1px}'
      document.head.appendChild(estiloDev)
    }
    encontrado('dev')
  })
}

/** `secreto()` / `secret()` en la consola del navegador. */
function secretoDeConsola () {
  const ventana = window as Window & { secreto?: () => string, secret?: () => string }

  const responder = () => {
    encontrado('console')
    return tDelDocumento().secretos.consola + PERFIL.email
  }

  ventana.secreto = responder
  ventana.secret = responder

  if (!consolaAnunciada) {
    consolaAnunciada = true
    const [saludo, invitacion] = tDelDocumento().secretos.invitacionConsola
    console.log(`%c${saludo}`, 'font:600 16px monospace;color:#f08a3c')
    console.log(`%c${invitacion}`, 'font:12px monospace;color:#a3978a')
  }

  return () => {
    delete ventana.secreto
    delete ventana.secret
  }
}

function tituloAlIrse () {
  const original = document.title

  const alCambiar = () => {
    document.title = document.hidden ? tDelDocumento().meta.tituloOculto : original
  }

  document.addEventListener('visibilitychange', alCambiar)
  return () => {
    document.removeEventListener('visibilitychange', alCambiar)
    document.title = original
  }
}

/**
 * `sudo rm -rf /`: lo que está a la vista se cae y a los 3s vuelve con un
 * rebote elástico. Las partículas se dispersan y regresan a su forma.
 */
export function autodestruir () {
  if (reducido) return

  const alto = window.innerHeight
  const elementos = Array
    .from(document.querySelectorAll<HTMLElement>(
      '[data-reveal], [data-row], [data-ti], [data-h], [data-scramble], nav, footer'
    ))
    .filter(el => {
      const caja = el.getBoundingClientRect()
      return caja.bottom > 0 && caja.top < alto
    })

  if (elementos.length === 0) return

  gsap.to(elementos, {
    y: () => alto * (0.8 + Math.random()),
    rotation: () => gsap.utils.random(-40, 40),
    duration: 1.1,
    ease: 'power2.in',
    stagger: 0.04
  })

  gsap.to(elementos, {
    y: 0,
    rotation: 0,
    duration: 1.6,
    ease: 'elastic.out(1,.55)',
    delay: 3,
    stagger: 0.03,
    onComplete: () => gsap.set(elementos, { clearProps: 'rotation' })
  })

  formaTemporal('scatter', 3200)
}
