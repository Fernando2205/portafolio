/**
 * Formas de la nube de partículas, una por sección. Las fórmulas son las del
 * `makeShapes()` del prototipo.
 *
 * Cada forma es un Float32Array de N·3 posiciones.
 */
export type NombreForma =
  | 'scatter'
  | 'sphere'
  | 'wave'
  | 'helix'
  | 'medal'
  | 'blocks'
  | 'knot'
  | 'galaxy'
  | 'orb'

/** Forma que le toca a cada sección. */
export const FORMA_DE_SECCION: Record<string, NombreForma> = {
  inicio: 'sphere',
  'sobre-mi': 'wave',
  trayectoria: 'helix',
  logros: 'medal',
  proyectos: 'blocks',
  terminal: 'knot',
  stack: 'galaxy',
  contacto: 'orb'
}

/** Orden por el que pasa el comando `forma` / `shape`. */
export const CICLO_FORMAS: NombreForma[] = [
  'sphere',
  'wave',
  'helix',
  'medal',
  'blocks',
  'knot',
  'galaxy',
  'orb'
]

const rnd = (a: number, b: number) => a + Math.random() * (b - a)

export function crearFormas (N: number): Record<NombreForma, Float32Array> {
  const mk = (f: (i: number) => [number, number, number]) => {
    const puntos = new Float32Array(N * 3)
    for (let i = 0; i < N; i++) {
      const [x, y, z] = f(i)
      puntos[i * 3] = x
      puntos[i * 3 + 1] = y
      puntos[i * 3 + 2] = z
    }
    return puntos
  }

  return {
    scatter: mk(() => [rnd(-8, 8), rnd(-5, 5), rnd(-5, 2)]),

    // Esfera de Fibonacci, con uno de cada nueve puntos algo más afuera.
    sphere: mk(i => {
      const y = 1 - (i / (N - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      const th = i * 2.39996
      const R = 1.75 * (i % 9 === 0 ? 1.18 : 1)
      return [Math.cos(th) * r * R, y * R, Math.sin(th) * r * R]
    }),

    wave: mk(i => {
      const n = Math.ceil(Math.sqrt(N))
      const x = ((i % n) / (n - 1) - 0.5) * 7
      const z = (Math.floor(i / n) / (n - 1) - 0.5) * 7
      const y = Math.sin(x * 1.1) * Math.cos(z * 1.3) * 0.5
      return [x, y - z * 0.32, z * 0.5]
    }),

    // Doble hélice: las hebras van desfasadas media vuelta y uno de cada seis
    // puntos hace de travesaño.
    helix: mk(i => {
      const t = i / N
      const a = t * Math.PI * 12
      const y = (t - 0.5) * 5.4
      if (i % 6 === 0) {
        const s = rnd(-1, 1)
        return [Math.cos(a) * 1.1 * s, y, Math.sin(a) * 1.1 * s]
      }
      const desfase = i % 2 ? Math.PI : 0
      return [Math.cos(a + desfase) * 1.1, y, Math.sin(a + desfase) * 1.1]
    }),

    // Medalla: aro, disco y dos cintas.
    medal: mk(i => {
      const k = i % 10
      if (k < 4) {
        const th = Math.random() * Math.PI * 2
        const R = 1.55 + Math.random() * 0.12
        return [Math.cos(th) * R, Math.sin(th) * R, (Math.random() - 0.5) * 0.12]
      }
      if (k < 8) {
        const th = Math.random() * Math.PI * 2
        const R = Math.sqrt(Math.random()) * 1.15
        return [Math.cos(th) * R, Math.sin(th) * R, (Math.random() - 0.5) * 0.08]
      }
      const t = Math.random()
      const lado = k === 8 ? -1 : 1
      return [lado * (0.35 + t * 0.5), 1.6 + t * 1.3, 0]
    }),

    // Cinco bloques encadenados: las aristas del cubo más algún eslabón.
    blocks: mk(i => {
      const nb = 5
      const b = i % nb
      const s = 0.8
      const h = s / 2
      const cx = (b - (nb - 1) / 2) * 1.4
      const cy = Math.sin(b * 1.3) * 0.45
      const ang = b * 0.5

      if (i % 11 === 0 && b < nb - 1) {
        const k = Math.random()
        const nx = (b + 1 - (nb - 1) / 2) * 1.4
        const ny = Math.sin((b + 1) * 1.3) * 0.45
        return [cx + (nx - cx) * k, cy + (ny - cy) * k, 0]
      }

      const t = rnd(-h, h)
      const aristas: Array<[number, number, number]> = [
        [t, h, h], [t, -h, h], [t, h, -h], [t, -h, -h],
        [h, t, h], [-h, t, h], [h, t, -h], [-h, t, -h],
        [h, h, t], [-h, h, t], [h, -h, t], [-h, -h, t]
      ]
      const p = aristas[Math.floor(Math.random() * 12)]
      return [
        cx + p[0] * Math.cos(ang) - p[2] * Math.sin(ang),
        cy + p[1],
        p[0] * Math.sin(ang) + p[2] * Math.cos(ang)
      ]
    }),

    // Nudo toroidal (2,3).
    knot: mk(i => {
      const t = (i / N) * Math.PI * 2
      const r = Math.cos(3 * t) + 2.2
      return [
        r * Math.cos(2 * t) * 0.6 + rnd(-0.07, 0.07),
        r * Math.sin(2 * t) * 0.6 + rnd(-0.07, 0.07),
        -Math.sin(3 * t) * 0.6 + rnd(-0.07, 0.07)
      ]
    }),

    galaxy: mk(i => {
      const r = Math.pow(Math.random(), 0.6) * 3.2
      const brazo = ((i % 3) * Math.PI * 2) / 3
      const a = brazo + r * 1.5 + rnd(-0.35, 0.35) / (r * 0.6 + 0.4)
      const y = rnd(-0.2, 0.2) * (1 - r / 3.4)
      const x = Math.cos(a) * r
      const z = Math.sin(a) * r
      return [x, y + z * 0.42, z * 0.8]
    }),

    // Orbe con anillo: siete de cada diez puntos en la esfera.
    orb: mk(i => {
      if (i % 10 < 7) {
        const y = rnd(-1, 1)
        const r = Math.sqrt(1 - y * y)
        const th = rnd(0, Math.PI * 2)
        return [Math.cos(th) * r * 1.15, y * 1.15, Math.sin(th) * r * 1.15]
      }
      const th = rnd(0, Math.PI * 2)
      const R = rnd(1.8, 2.5)
      return [Math.cos(th) * R, Math.sin(th) * R * 0.25, Math.sin(th) * R * 0.9]
    })
  }
}

/**
 * Desplazamiento, altura y escala de cada forma. En pantallas anchas la figura
 * se va a la derecha; en estrechas se centra y se hace más pequeña.
 */
export function desplazamientoDe (forma: string): [number, number, number] {
  const ancha = window.innerWidth / window.innerHeight > 1.15
  const tabla: Record<string, [number, number, number]> = {
    sphere: [2.4, 0.55, 1],
    wave: [1.6, -0.4, 1],
    helix: [2.9, 0, 1],
    blocks: [1.4, 0.1, 0.95],
    medal: [2.8, 0, 0.85],
    knot: [3, 0.2, 0.9],
    galaxy: [0, 0.2, 1.1],
    orb: [2.6, 0.3, 1.1],
    scatter: [0, 0, 1]
  }
  const valor = tabla[forma] ?? tabla.scatter
  return ancha ? valor : [0, forma === 'sphere' ? 1.1 : 0, 0.72]
}

/**
 * Muestrea los píxeles de una palabra en un canvas y devuelve las posiciones
 * para que las partículas la formen. Es la recompensa de los 8 secretos.
 */
export function formaDeTexto (palabra: string, N: number): Float32Array | null {
  const lienzo = document.createElement('canvas')
  lienzo.width = 900
  lienzo.height = 220
  const ctx = lienzo.getContext('2d')
  if (!ctx) return null

  ctx.fillStyle = '#fff'
  ctx.font = '800 170px Bricolage Grotesque Variable, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(palabra, 450, 115)

  const datos = ctx.getImageData(0, 0, 900, 220).data
  const pixeles: Array<[number, number]> = []
  for (let y = 0; y < 220; y += 3) {
    for (let x = 0; x < 900; x += 3) {
      if (datos[(y * 900 + x) * 4 + 3] > 128) pixeles.push([x, y])
    }
  }
  if (pixeles.length === 0) return null

  const puntos = new Float32Array(N * 3)
  for (let i = 0; i < N; i++) {
    const p = pixeles[Math.floor(Math.random() * pixeles.length)]
    puntos[i * 3] = (p[0] - 450) / 125
    puntos[i * 3 + 1] = -(p[1] - 110) / 125
    puntos[i * 3 + 2] = (Math.random() - 0.5) * 0.15
  }
  return puntos
}
