import { navigate } from 'astro:transitions/client'
import { HABILIDADES_BLANDAS } from '../data/habilidades'
import { LOGROS } from '../data/logros'
import { NOMBRES_PALETA, buscarPaleta, slugPaleta } from '../data/paletas'
import { PERFIL } from '../data/perfil'
import { PROYECTOS } from '../data/proyectos'
import { NOMBRES_STACK } from '../data/stack'
import { TOTAL_SECRETOS } from '../data/secretos'
import { TRAYECTORIA } from '../data/trayectoria'
import { idiomaDelDocumento, otroIdioma, ruta, tDelDocumento } from '../i18n/utils'
import { emit } from './bus'
import { horaDeCali } from './clock'
import { destacada as a, salida as o, type Linea } from './lineas'
import { autodestruir } from './eggs'
import { avanzarForma, formaTemporal, morfarAhora } from './particles'
import { invertirGravedad } from './physics'
import {
  alternarDoradoSiSeGano,
  encontrado,
  lineasSecretos,
  totalEncontrados
} from './secrets'
import { CLAVES, escribirTexto } from './store'
import { alternarTema, elegirPaleta, paletaActual } from './theme'

/**
 * Intérprete de la terminal. Guarda el estado del mini-juego y decide qué
 * imprime cada comando.
 *
 * Los comandos secretos existen pero nunca se sugieren: las listas de
 * autocompletado de más abajo no los incluyen.
 */
export interface Consola {
  /** Imprime la salida; si se pasa `comando`, primero hace eco de la entrada. */
  imprimir: (lineas: Linea[], comando?: string) => void
  limpiar: () => void
}

/** Vocabulario de autocompletado, sin los comandos secretos. */
const VOCABULARIO = {
  es: [
    'ayuda', 'sobremi', 'whoami', 'habilidades', 'experiencia', 'logros',
    'hackatones', 'proyectos', 'abrir', 'samcore', 'oculus', 'stack',
    'certificaciones', 'contacto', 'neofetch', 'secretos', 'ls', 'cd', 'cat',
    'forma', 'web3', 'github', 'linkedin', 'cv', 'tema', 'paleta', 'idioma',
    'fecha', 'limpiar', 'jugar', 'cafe', 'hola', 'sudo', 'exit'
  ],
  en: [
    'help', 'about', 'whoami', 'skills', 'experience', 'achievements',
    'hackathons', 'projects', 'open', 'samcore', 'oculus', 'stack', 'certs',
    'contact', 'neofetch', 'secrets', 'ls', 'cd', 'cat', 'shape', 'web3',
    'github', 'linkedin', 'cv', 'theme', 'palette', 'lang', 'date', 'clear',
    'play', 'coffee', 'hello', 'sudo', 'exit'
  ]
}

/** Destinos de `cd`, en los dos idiomas. */
const DIRECTORIOS: Record<string, string> = {
  logros: 'logros',
  achievements: 'logros',
  proyectos: 'proyectos',
  projects: 'proyectos',
  experiencia: 'trayectoria',
  experience: 'trayectoria',
  trayectoria: 'trayectoria',
  stack: 'stack',
  contacto: 'contacto',
  contact: 'contacto',
  sobremi: 'sobre-mi',
  about: 'sobre-mi',
  '~': 'inicio',
  '..': 'inicio',
  '/': 'inicio'
}

export function argumentosDe (comando: string): string[] | undefined {
  const lang = idiomaDelDocumento()
  const indices = PROYECTOS.map((_, i) => String(i + 1))
  const paletas = NOMBRES_PALETA.map(slugPaleta)

  const tabla: Record<string, string[]> = {
    abrir: indices,
    open: indices,
    cd: lang === 'en'
      ? ['projects', 'achievements', 'experience', 'stack', 'contact', 'about', '~']
      : ['proyectos', 'logros', 'experiencia', 'stack', 'contacto', 'sobremi', '~'],
    cat: lang === 'en' ? ['secrets.txt', 'cv.pdf'] : ['secretos.txt', 'cv.pdf'],
    idioma: ['es', 'en'],
    lang: ['es', 'en'],
    paleta: paletas,
    palette: paletas
  }
  return tabla[comando]
}

/** Coincidencias para el autocompletado, del comando o de su argumento. */
export function candidatos (entrada: string, enJuego: boolean): string[] {
  if (enJuego) return []
  const valor = entrada.toLowerCase()
  if (!valor.trim()) return []

  const espacio = valor.indexOf(' ')
  if (espacio < 0) {
    return VOCABULARIO[idiomaDelDocumento()].filter(c => c.startsWith(valor))
  }

  const comando = valor.slice(0, espacio)
  const argumento = valor.slice(espacio + 1)
  const opciones = argumentosDe(comando)
  if (!opciones) return []
  return opciones.filter(op => op.startsWith(argumento)).map(op => `${comando} ${op}`)
}

function irA (id: string) {
  const seccion = document.getElementById(id)
  if (!seccion) return
  window.scrollTo({
    top: seccion.getBoundingClientRect().top + window.scrollY - 60,
    behavior: 'smooth'
  })
}

function descargarCv () {
  const enlace = document.createElement('a')
  enlace.href = PERFIL.cv
  enlace.download = ''
  enlace.click()
}

export function crearInterprete (consola: Consola) {
  let juego: { numero: number, intentos: number } | null = null

  function enJuego () {
    return juego !== null
  }

  function ejecutar (bruto: string) {
    const comando = bruto.trim()
    if (!comando) return

    const dic = tDelDocumento()
    const lang = idiomaDelDocumento()
    const bajo = comando.toLowerCase().replace(/\s+/g, ' ')
    const [c, ...args] = bajo.split(' ')
    const eco = (lineas: Linea[]) => consola.imprimir(lineas, comando)

    // Mini-juego: mientras está activo, los números son intentos.
    if (juego) {
      if (['salir', 'exit', 'q'].includes(c)) {
        juego = null
        return eco([o(dic.juego.terminado)])
      }
      const intento = Number.parseInt(c, 10)
      if (!Number.isNaN(intento)) {
        juego.intentos += 1
        if (intento === juego.numero) {
          const intentos = juego.intentos
          juego = null
          encontrado('game')
          return eco([
            a(dic.juego.acierto(intento, intentos)),
            o(dic.juego.aciertoExtra)
          ])
        }
        if (juego.intentos >= 7) {
          const numero = juego.numero
          juego = null
          return eco([o(dic.juego.sinIntentos(numero))])
        }
        const restantes = 7 - juego.intentos
        return eco([
          o(intento < juego.numero
            ? dic.juego.masAlto(restantes)
            : dic.juego.masBajo(restantes))
        ])
      }
    }

    // Autodestrucción: la secuencia completa va por su cuenta.
    if (/^(sudo )?rm -rf/.test(bajo)) {
      eco([a(dic.autodestruccion.ejecutando)])
      window.setTimeout(() => {
        consola.imprimir(dic.autodestruccion.borrando.map(o))
      }, 300)
      window.setTimeout(autodestruir, 700)
      window.setTimeout(() => {
        consola.imprimir([a(dic.autodestruccion.restaurado)])
        encontrado('rmrf')
      }, 4200)
      return
    }

    let salida: Linea[]

    switch (c) {
      case 'ayuda':
      case 'help':
        salida = [a(dic.cmd.ayuda.cabecera), ...dic.cmd.ayuda.lista.map(l => o(`  ${l}`))]
        break

      case 'sobremi':
      case 'about':
      case 'whoami':
        salida = dic.cmd.sobremi.map(o)
        break

      case 'neofetch':
        salida = [
          a('   ____      delio@portafolio'),
          o('  |  _ \\     ----------------'),
          o(`  | | | |    os: ${dic.cmd.neofetch.os} (USB Cali)`),
          o(`  | |_| |    uptime: ${dic.cmd.neofetch.uptime}`),
          o('  |____/     shell: full stack'),
          o('             stack: python · react · node · fastapi'),
          o(`             host: ${PERFIL.ciudad}`),
          o(`             ${dic.cmd.neofetch.estado}: ${dic.cmd.neofetch.abierto}`),
          o(`             ${dic.cmd.neofetch.secretos}: ${totalEncontrados()}/${TOTAL_SECRETOS}`)
        ]
        break

      case 'experiencia':
      case 'experience':
        salida = TRAYECTORIA
          .filter(item => item.tipo === 'work' || item.tipo === 'edu')
          .map(item => o(`  ${item.anio.padEnd(8)} ${item.titulo} — ${item.subtitulo[lang]}`))
        window.setTimeout(() => irA('trayectoria'), 300)
        break

      case 'proyectos':
      case 'projects':
        salida = [
          ...PROYECTOS.map((p, i) => o(`  ${i + 1}. ${p.nombre} — ${p.tipo[lang]}`)),
          a(dic.cmd.proyectos)
        ]
        break

      case 'abrir':
      case 'open':
      case 'samcore':
      case 'oculus': {
        const n = c === 'samcore' ? 1 : c === 'oculus' ? 2 : Number.parseInt(args[0], 10)
        const proyecto = n >= 1 && n <= PROYECTOS.length ? PROYECTOS[n - 1] : undefined
        if (proyecto) {
          emit('abrirProyecto', proyecto.slug)
          salida = [a(dic.cmd.abriendo(proyecto.nombre))]
        } else {
          salida = [o(dic.cmd.usoAbrir(PROYECTOS.length))]
        }
        break
      }

      case 'stack':
        salida = [o(`${NOMBRES_STACK.join(', ')}.`), a(dic.cmd.stack)]
        break

      case 'habilidades':
      case 'skills':
      case 'blandas':
      case 'soft':
        salida = [
          a(dic.cmd.habilidades),
          ...HABILIDADES_BLANDAS.map(h =>
            o(`  ▸ ${h.nombre[lang].padEnd(24)} ${h.evidencia[lang]}`))
        ]
        break

      case 'logros':
      case 'achievements':
      case 'hackatones':
      case 'hackathons':
        salida = LOGROS
          .filter(l => (c.startsWith('hack') ? l.tipo !== 'paper' : true))
          .map(l => {
            const marca = l.tipo === 'win' ? '★' : '·'
            const texto = `  ${marca} ${l.anio}  ${l.resultado[lang].padEnd(12)} ${l.titulo} — ${l.evento[lang]}`
            return l.tipo === 'win' ? a(texto) : o(texto)
          })
        window.setTimeout(() => irA('logros'), 300)
        break

      case 'certificaciones':
      case 'certs':
        salida = TRAYECTORIA
          .filter(item => item.tipo === 'cert')
          .map(item => o(`  ${item.anio}  ${item.titulo} — ${item.subtitulo[lang]}`))
        break

      case 'contacto':
      case 'contact':
        salida = [
          o(`email     ${PERFIL.email}`),
          o(`whatsapp  ${PERFIL.telefono}`),
          o(`linkedin  ${PERFIL.linkedinCorto}`),
          o(`github    ${PERFIL.githubUsuario}`)
        ]
        break

      case 'github':
        window.open(PERFIL.github, '_blank', 'noopener')
        salida = [a(dic.cmd.abriendoGithub)]
        break

      case 'linkedin':
        window.open(PERFIL.linkedin, '_blank', 'noopener')
        salida = [a(dic.cmd.abriendoLinkedin)]
        break

      case 'cv':
        descargarCv()
        salida = [a(dic.cmd.descargandoCv)]
        break

      case 'ls':
        salida = [o(dic.cmd.ls)]
        break

      case 'cat':
        if (args[0] === 'secretos.txt' || args[0] === 'secrets.txt') salida = [o(dic.cmd.catSecretos)]
        else if (args[0] === 'cv.pdf') salida = [o(dic.cmd.catCv)]
        else salida = [o(dic.cmd.usoCat)]
        break

      case 'cd': {
        const destino = DIRECTORIOS[(args[0] ?? '~').replace(/\/$/, '')]
        if (destino) {
          irA(destino)
          salida = [o(`→ ${destino}`)]
        } else {
          salida = [o(dic.cmd.cdNoExiste(args[0] ?? ''))]
        }
        break
      }

      case 'forma':
      case 'shape': {
        const siguiente = avanzarForma()
        emit('girar', 0.12)
        salida = [a(dic.cmd.forma(siguiente))]
        break
      }

      case 'web3':
        morfarAhora('blocks')
        emit('girar', 0.15)
        salida = [a(dic.cmd.web3[0]), o(dic.cmd.web3[1])]
        break

      case 'fiesta':
      case 'party':
        emit('fiesta', 5500)
        formaTemporal('scatter', 2400)
        emit('girar', 0.3)
        encontrado('party')
        salida = [a(dic.cmd.fiesta)]
        break

      case 'gravedad':
      case 'gravity': {
        const signo = invertirGravedad()
        window.setTimeout(() => irA('stack'), 300)
        encontrado('gravity')
        salida = [a(signo < 0 ? dic.cmd.gravedadInvertida : dic.cmd.gravedadNormal)]
        break
      }

      case 'matrix':
        salida = [o(dic.cmd.matrix)]
        break

      case 'secretos':
      case 'secrets':
        salida = lineasSecretos()
        break

      case 'paleta':
      case 'palette': {
        const consulta = args.join('')
        const acierto = consulta ? buscarPaleta(consulta) : undefined
        if (acierto) {
          elegirPaleta(acierto)
          salida = [a(dic.cmd.paletaActiva(acierto))]
        } else {
          salida = [
            o(dic.cmd.paletasDisponibles),
            ...NOMBRES_PALETA.map(n =>
              o(`  ${n === paletaActual() ? '●' : '○'} ${slugPaleta(n)}`)),
            a(dic.cmd.usoPaleta)
          ]
        }
        break
      }

      case 'dorado':
      case 'gold': {
        const activo = alternarDoradoSiSeGano()
        if (activo === null) salida = [o(dic.cmd.doradoBloqueado)]
        else salida = [a(activo ? dic.cmd.doradoOn : dic.cmd.doradoOff)]
        break
      }

      case 'tema':
      case 'theme':
        salida = [a(alternarTema() ? dic.cmd.temaOscuro : dic.cmd.temaClaro)]
        break

      case 'idioma':
      case 'lang': {
        const pedido = args[0] === 'es' || args[0] === 'en' ? args[0] : otroIdioma(lang)
        if (pedido === lang) {
          salida = [a(dic.cmd.idioma)]
          break
        }
        escribirTexto(CLAVES.idioma, pedido)
        salida = [a(pedido === 'en' ? 'language: english.' : 'idioma: español.')]
        // Cada idioma es una ruta: se navega con el ClientRouter para que el
        // cambio sea un fundido y no una recarga.
        window.setTimeout(() => {
          Promise.resolve(navigate(ruta(pedido))).catch(() => {})
        }, 400)
        break
      }

      case 'fecha':
      case 'date':
      case 'time':
        salida = [o(dic.cmd.fecha(horaDeCali()))]
        break

      case 'limpiar':
      case 'clear':
        consola.limpiar()
        return

      case 'jugar':
      case 'play':
        juego = { numero: 1 + Math.floor(Math.random() * 50), intentos: 0 }
        salida = [a(dic.juego.inicio), o(dic.juego.instruccion)]
        break

      case 'exit':
        salida = [o(dic.cmd.exit)]
        break

      case 'cafe':
      case 'café':
      case 'coffee':
        salida = [o(dic.cmd.cafe[0]), a(dic.cmd.cafe[1])]
        break

      case 'hola':
      case 'hello':
      case 'hi':
        salida = [a(dic.cmd.hola)]
        break

      case 'sudo':
        salida = [o(dic.cmd.sudo)]
        break

      default: {
        const pista = casiSecreto(c, bajo)
        salida = pista ? [a(pista)] : [o(dic.cmd.noEncontrado(c))]
      }
    }

    eco(salida)
  }

  return { ejecutar, enJuego }
}

/**
 * Respuestas «casi»: si el visitante escribe algo parecido a un secreto, la
 * terminal contesta con una pista sin revelarlo.
 */
function casiSecreto (comando: string, completo: string): string | null {
  const dic = tDelDocumento()

  const tabla: Array<[string[], string]> = [
    [['rm', 'sudo rm', 'rm -r', 'rm -f', 'rm -rf'], dic.casi.rm],
    [['celebrar', 'celebrate', 'confeti', 'confetti', 'fiest', 'part', 'baile', 'dance'], dic.casi.fiesta],
    [['fisica', 'física', 'physics', 'newton', 'caer', 'fall', 'grav', 'gravedad invertida'], dic.casi.gravedad],
    [['konami', 'codigo', 'código', 'cheat', 'trampa', 'arriba'], dic.casi.konami],
    [['delio', 'fernando', 'palacios', 'nombre'], dic.casi.nombre],
    [['dev', 'devmode', 'debug', 'inspect', 'logo'], dic.casi.dev],
    [['consola', 'console', 'f12', 'secreto()', 'secret()'], dic.casi.consola],
    [['secreto', 'secret'], dic.casi.plural],
    [['game', 'juego', 'jugar?', 'jugemos', 'juguemos'], dic.casi.jugar]
  ]

  for (const [claves, mensaje] of tabla) {
    if (claves.includes(completo) || claves.includes(comando)) return mensaje
  }

  const cercanos = ['fiesta', 'party', 'gravedad', 'gravity', 'matrix', 'dorado']
  if (comando.length > 3 && cercanos.some(h => levenshtein(comando, h) <= 2)) {
    return dic.casi.cerca
  }

  return null
}

function levenshtein (a: string, b: string) {
  const matriz = Array.from({ length: a.length + 1 }, (_, i) => [i])
  for (let j = 1; j <= b.length; j++) matriz[0][j] = j
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      matriz[i][j] = Math.min(
        matriz[i - 1][j] + 1,
        matriz[i][j - 1] + 1,
        matriz[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      )
    }
  }
  return matriz[a.length][b.length]
}
