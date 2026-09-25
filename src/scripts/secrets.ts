import { PERFIL } from '../data/perfil'
import {
  ORDEN_SECRETOS,
  SECRETOS,
  TOTAL_SECRETOS,
  type ClaveSecreto
} from '../data/secretos'
import { idiomaDelDocumento, tDelDocumento } from '../i18n/utils'
import { emit } from './bus'
import { CLAVES, escribirJson, leerJson } from './store'
import { activarDorado, alternarDorado } from './theme'
import type { Linea } from './lineas'

/**
 * Registro de la búsqueda del tesoro: qué secretos se han encontrado, en qué
 * nivel va la pista del siguiente y la recompensa al completar los 8.
 *
 * El siguiente pendiente es el primero del orden de SECRETOS que no se ha
 * encontrado; encontrar uno fuera de orden también cuenta.
 */
let encontrados: ClaveSecreto[] = []
let niveles: Partial<Record<ClaveSecreto, number>> = {}
let cerrarToast = 0

export function cargarSecretos () {
  encontrados = leerJson<ClaveSecreto[]>(CLAVES.secretos, []).filter(clave =>
    ORDEN_SECRETOS.includes(clave)
  )
  niveles = leerJson<Partial<Record<ClaveSecreto, number>>>(CLAVES.pistas, {})
}

export function totalEncontrados () {
  return encontrados.length
}

export function estaCompleto () {
  return encontrados.length >= TOTAL_SECRETOS
}

export function yaEncontrado (clave: ClaveSecreto) {
  return encontrados.includes(clave)
}

function siguientePendiente (): ClaveSecreto | undefined {
  return ORDEN_SECRETOS.find(clave => !encontrados.includes(clave))
}

function pistaDe (clave: ClaveSecreto) {
  const lang = idiomaDelDocumento()
  const secreto = SECRETOS.find(s => s.clave === clave)
  const nivel = Math.min(2, niveles[clave] ?? 0)
  return { nivel, texto: secreto ? secreto.pistas[lang][nivel] : '' }
}

export function encontrado (clave: ClaveSecreto) {
  if (encontrados.includes(clave)) return
  if (!ORDEN_SECRETOS.includes(clave)) return

  encontrados = [...encontrados, clave]
  escribirJson(CLAVES.secretos, encontrados)
  emit('secreto', clave)

  const dic = tDelDocumento()
  const lang = idiomaDelDocumento()
  const secreto = SECRETOS.find(s => s.clave === clave)
  const siguiente = siguientePendiente()

  mostrarToast(
    `${dic.toast.secreto} · ${encontrados.length}/${TOTAL_SECRETOS}`,
    secreto ? secreto.nombre[lang] : '',
    siguiente ? `${dic.toast.siguientePista}: ${pistaDe(siguiente).texto}` : '',
    5500
  )

  if (encontrados.length === TOTAL_SECRETOS) {
    window.setTimeout(recompensa, 1400)
  }
}

function mostrarToast (cabecera: string, nombre: string, pista: string, ms: number) {
  const toast = document.querySelector<HTMLElement>('[data-toast]')
  if (!toast) return

  const nodoCabecera = toast.querySelector<HTMLElement>('[data-toast-cabecera]')
  const nodoNombre = toast.querySelector<HTMLElement>('[data-toast-nombre]')
  const nodoPista = toast.querySelector<HTMLElement>('[data-toast-pista]')

  if (nodoCabecera) nodoCabecera.textContent = cabecera
  if (nodoNombre) nodoNombre.textContent = nombre
  if (nodoPista) {
    nodoPista.textContent = pista
    nodoPista.hidden = pista === ''
  }

  toast.style.transform = 'none'
  toast.style.opacity = '1'

  window.clearTimeout(cerrarToast)
  cerrarToast = window.setTimeout(() => {
    toast.style.transform = 'translateY(140%)'
    toast.style.opacity = '0'
  }, ms)
}

/**
 * Salida del comando `secretos`: lo encontrado con [x], el siguiente con su
 * pista actual y el resto bloqueado. Cada consulta sube un nivel la pista.
 */
export function lineasSecretos (): Linea[] {
  const dic = tDelDocumento()
  const lang = idiomaDelDocumento()
  const siguiente = siguientePendiente()

  const lineas: Linea[] = [
    { tipo: 'acc', texto: dic.secretos.encontrados(encontrados.length, TOTAL_SECRETOS) }
  ]

  for (const clave of ORDEN_SECRETOS) {
    const secreto = SECRETOS.find(s => s.clave === clave)
    if (encontrados.includes(clave)) {
      lineas.push({ tipo: 'out', texto: `  [x] ${secreto ? secreto.nombre[lang] : clave}` })
    } else if (clave === siguiente) {
      const pista = pistaDe(clave)
      lineas.push({
        tipo: 'acc',
        texto: `  [ ] ${dic.secretos.siguiente} → ${pista.texto}  (${dic.secretos.pista} ${pista.nivel + 1}/3)`
      })
    } else {
      lineas.push({ tipo: 'out', texto: `  [ ] ???  ${dic.secretos.bloqueado}` })
    }
  }

  if (siguiente) {
    const nivel = niveles[siguiente] ?? 0
    lineas.push({
      tipo: 'out',
      texto: nivel < 2 ? dic.secretos.masClara : dic.secretos.yaEsLaMasClara
    })
    niveles[siguiente] = Math.min(2, nivel + 1)
    escribirJson(CLAVES.pistas, niveles)
  } else {
    lineas.push({ tipo: 'acc', texto: dic.secretos.completo })
  }

  return lineas
}

function recompensa () {
  const dic = tDelDocumento()

  activarDorado()
  emit('palabra', { texto: dic.secretos.gracias, ms: 6500 })

  const [cabecera, linea1, linea2, desbloqueo] = dic.secretos.recompensa
  emit('imprimir', [
    { tipo: 'acc', texto: cabecera },
    { tipo: 'out', texto: linea1 },
    { tipo: 'out', texto: linea2 },
    { tipo: 'out', texto: `  ${PERFIL.email}` },
    { tipo: 'acc', texto: desbloqueo }
  ])

  mostrarToast(
    `${dic.toast.secreto} · ${TOTAL_SECRETOS}/${TOTAL_SECRETOS}`,
    dic.toast.recompensa,
    '',
    6000
  )
}

/** El comando `dorado` solo existe una vez completada la búsqueda. */
export function alternarDoradoSiSeGano () {
  if (!estaCompleto()) return null
  return alternarDorado()
}
