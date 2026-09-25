import { on } from './bus'
import { gsap } from './gsap'
import { alFrame, reducido, tactil } from './loop'
import {
  CICLO_FORMAS,
  FORMA_DE_SECCION,
  crearFormas,
  desplazamientoDe,
  formaDeTexto,
  type NombreForma
} from './shapes'
import { acentoActual, colorParticulas, esOscuro } from './theme'

/**
 * Nube de partículas fija detrás de todo el sitio. Cambia de forma según la
 * sección, sigue al puntero con parallax, gira más rápido con el scroll y
 * «respira».
 *
 * Three.js se carga con requestIdleCallback después del primer paint, y las
 * posiciones solo se suben a la GPU mientras hay transición de forma.
 *
 * La escena se crea una sola vez: el canvas lleva `transition:persist`, así que
 * sobrevive al cambio de idioma.
 */
interface Escena {
  N: number
  redimensionar: () => void
  aplicarColores: () => void
  morfarA: (forma: string) => void
  registrarForma: (nombre: string, puntos: Float32Array) => void
  paso: (datos: Datos) => void
}

interface Datos {
  tiempo: number
  vel: number
  raton: { x: number, y: number }
  hayRaton: boolean
  opacidadObjetivo: number
  fiestaHasta: number
}

let escena: Escena | null = null
let cargando = false

/** Forma de la sección actual, para volver a ella después de un secreto. */
let formaDeSeccion: NombreForma = 'sphere'
/** Mientras es true la sección no manda: lo usa la recompensa de los secretos. */
let formaFijada = false
let giroExtra = 0
let fiestaHasta = 0
let seccionActual = 'inicio'

export function iniciarParticulas () {
  if (reducido) return

  const bajas: Array<() => void> = []

  bajas.push(on('seccion', id => {
    seccionActual = id
    const forma = FORMA_DE_SECCION[id]
    if (!forma) return
    formaDeSeccion = forma
    if (!formaFijada) escena?.morfarA(forma)
  }))

  bajas.push(on('tema', () => escena?.aplicarColores()))
  bajas.push(on('medir', () => escena?.redimensionar()))
  bajas.push(on('girar', valor => { giroExtra += valor }))
  bajas.push(on('fiesta', ms => { fiestaHasta = performance.now() + ms }))
  bajas.push(on('introFin', () => escena?.morfarA(formaDeSeccion)))

  bajas.push(on('forma', nombre => {
    if (nombre === 'siguiente') {
      const actual = CICLO_FORMAS.indexOf(formaDeSeccion)
      formaDeSeccion = CICLO_FORMAS[(actual + 1) % CICLO_FORMAS.length]
      escena?.morfarA(formaDeSeccion)
      return
    }
    escena?.morfarA(nombre)
  }))

  bajas.push(on('palabra', ({ texto, ms }) => {
    if (!escena) return
    const puntos = formaDeTexto(texto, escena.N)
    if (!puntos) return
    escena.registrarForma('palabra', puntos)
    formaFijada = true
    escena.morfarA('palabra')
    window.setTimeout(() => {
      formaFijada = false
      escena?.morfarA(formaDeSeccion)
    }, ms)
  }))

  if (!escena && !cargando) {
    cargando = true
    cuandoOcioso(() => {
      crearEscena()
        .then(nueva => {
          escena = nueva
          nueva?.morfarA(formaDeSeccion)
        })
        .catch(() => {})
        .finally(() => { cargando = false })
    })
  }

  const bajaFrame = alFrame(marco => {
    escena?.paso({
      tiempo: marco.tiempo,
      vel: marco.vel,
      raton: marco.raton,
      hayRaton: marco.raton.x > -100,
      opacidadObjetivo: seccionActual === 'inicio' ? 0.95 : 0.5,
      fiestaHasta
    })
  })

  return () => {
    bajaFrame()
    for (const baja of bajas) baja()
  }
}

function cuandoOcioso (tarea: () => void) {
  const ocioso = (window as Window & {
    requestIdleCallback?: (cb: () => void, opciones?: { timeout: number }) => number
  }).requestIdleCallback
  if (ocioso) ocioso(tarea, { timeout: 2000 })
  else window.setTimeout(tarea, 200)
}

async function crearEscena (): Promise<Escena | null> {
  const lienzo = document.querySelector<HTMLCanvasElement>('[data-particulas]')
  if (!lienzo) return null

  const {
    AdditiveBlending,
    BufferAttribute,
    BufferGeometry,
    CanvasTexture,
    Color,
    Group,
    NormalBlending,
    PerspectiveCamera,
    Points,
    PointsMaterial,
    Scene,
    WebGLRenderer
  } = await import('three')

  let renderizador: InstanceType<typeof WebGLRenderer>
  try {
    renderizador = new WebGLRenderer({
      canvas: lienzo,
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance'
    })
  } catch {
    return null
  }

  renderizador.setPixelRatio(Math.min(1.5, window.devicePixelRatio || 1))

  const tablero = new Scene()
  const camara = new PerspectiveCamera(45, 1, 0.1, 100)
  camara.position.z = 6.5

  const N = tactil ? 900 : 2000
  const formas: Record<string, Float32Array> = crearFormas(N)

  const posiciones = new Float32Array(formas.scatter)
  const base = new Float32Array(formas.scatter)
  const desde = new Float32Array(formas.scatter)
  let hacia = formas.scatter

  const colores = new Float32Array(N * 3)
  const variacion = new Float32Array(N)
  const retardo = new Float32Array(N)
  for (let i = 0; i < N; i++) {
    variacion[i] = 0.55 + Math.random() * 0.45
    retardo[i] = Math.random() * 0.35
  }

  const geometria = new BufferGeometry()
  geometria.setAttribute('position', new BufferAttribute(posiciones, 3))
  geometria.setAttribute('color', new BufferAttribute(colores, 3))

  // Textura del punto: un degradado radial en un canvas de 64px.
  const puntoLienzo = document.createElement('canvas')
  puntoLienzo.width = 64
  puntoLienzo.height = 64
  const ctx = puntoLienzo.getContext('2d')
  if (ctx) {
    const degradado = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    degradado.addColorStop(0, 'rgba(255,255,255,1)')
    degradado.addColorStop(0.35, 'rgba(255,255,255,.85)')
    degradado.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = degradado
    ctx.fillRect(0, 0, 64, 64)
  }

  const material = new PointsMaterial({
    size: 0.05,
    map: new CanvasTexture(puntoLienzo),
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    opacity: 0
  })

  const grupo = new Group()
  const inclinacion = new Group()
  grupo.add(new Points(geometria, material))
  inclinacion.add(grupo)
  tablero.add(inclinacion)

  /* GSAP interpola este objeto, y `overwrite` corta la transición anterior. */
  const mezcla = { valor: 1 }
  let terminado = true
  let formaActual = 'scatter'
  const tono = new Color()

  function redimensionar () {
    renderizador.setSize(window.innerWidth, window.innerHeight, false)
    camara.aspect = window.innerWidth / window.innerHeight
    camara.updateProjectionMatrix()
  }

  function aplicarColores () {
    const oscuro = esOscuro()
    const fondo = new Color(colorParticulas())
    const acento = new Color(acentoActual())
    for (let i = 0; i < N; i++) {
      // Una de cada cinco partículas va en el color de acento.
      const color = i % 5 === 0 ? acento : fondo
      const v = variacion[i] * (oscuro ? 0.75 : 1)
      colores[i * 3] = color.r * v
      colores[i * 3 + 1] = color.g * v
      colores[i * 3 + 2] = color.b * v
    }
    geometria.attributes.color.needsUpdate = true
    material.blending = oscuro ? AdditiveBlending : NormalBlending
    material.needsUpdate = true
  }

  function registrarForma (nombre: string, puntos: Float32Array) {
    formas[nombre] = puntos
  }

  function morfarA (nombre: string) {
    const destino = formas[nombre]
    if (!destino) return
    if (formaActual === nombre && mezcla.valor >= 1) return
    desde.set(base)
    hacia = destino
    formaActual = nombre
    mezcla.valor = 0
    terminado = false
    gsap.to(mezcla, { valor: 1, duration: 1.9, ease: 'none', overwrite: true })
  }

  const suavizar = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

  function paso (datos: Datos) {
    // Las posiciones solo se suben a la GPU mientras hay transición.
    if (!terminado) {
      for (let i = 0; i < N; i++) {
        const k = suavizar(Math.max(0, Math.min(1, (mezcla.valor - retardo[i]) / 0.65)))
        const j = i * 3
        base[j] = desde[j] + (hacia[j] - desde[j]) * k
        base[j + 1] = desde[j + 1] + (hacia[j + 1] - desde[j + 1]) * k
        base[j + 2] = desde[j + 2] + (hacia[j + 2] - desde[j + 2]) * k
      }
      posiciones.set(base)
      geometria.attributes.position.needsUpdate = true
      if (mezcla.valor >= 1) terminado = true
    }

    // Respiración.
    grupo.position.y = Math.sin(datos.tiempo * 0.8) * 0.06

    if (datos.fiestaHasta > performance.now()) {
      for (let i = 0; i < N; i++) {
        tono.setHSL((datos.tiempo * 0.3 + i / N) % 1, 0.85, 0.6)
        colores[i * 3] = tono.r
        colores[i * 3 + 1] = tono.g
        colores[i * 3 + 2] = tono.b
      }
      geometria.attributes.color.needsUpdate = true
    }

    const [dx, dy, escala] = desplazamientoDe(formaActual)
    inclinacion.position.x += (dx - inclinacion.position.x) * 0.04
    inclinacion.position.y += (dy - inclinacion.position.y) * 0.04
    const s = inclinacion.scale.x + (escala - inclinacion.scale.x) * 0.04
    inclinacion.scale.set(s, s, s)

    grupo.rotation.y += 0.0022 + Math.min(0.03, Math.abs(datos.vel) * 0.0008) + giroExtra
    giroExtra *= 0.96

    const mx = datos.raton.x / window.innerWidth - 0.5
    const my = datos.raton.y / window.innerHeight - 0.5
    inclinacion.rotation.x +=
      ((datos.hayRaton ? my * 0.5 : 0) + 0.15 - inclinacion.rotation.x) * 0.04
    inclinacion.rotation.y += (mx * 0.6 - inclinacion.rotation.y) * 0.04

    material.opacity += (datos.opacidadObjetivo - material.opacity) * 0.05
    renderizador.render(tablero, camara)
  }

  redimensionar()
  aplicarColores()
  lienzo.style.opacity = '1'

  return { N, redimensionar, aplicarColores, morfarA, registrarForma, paso }
}
