import { TOTAL_SECRETOS } from '../data/secretos'
import { type NombrePaleta } from '../data/paletas'
import { idiomaDelDocumento, tDelDocumento } from '../i18n/utils'
import { emit, on } from './bus'
import { gsap } from './gsap'
import { alFrame, reducido } from './loop'
import { conectarScrambleHover } from './scramble'
import { CLAVES, escribirTexto, leerJson } from './store'
import { alternarTema, elegirPaleta, paletaActual } from './theme'

/**
 * Nav fija: ruta de la sección en el logo, barra de progreso de scroll,
 * selector de paletas, idioma, claro/oscuro y contador de secretos.
 */
export function iniciarNav () {
  const dic = tDelDocumento()
  const lang = idiomaDelDocumento()
  const bajas: Array<() => void> = []

  const rutaSeccion = document.querySelector<HTMLElement>('[data-ruta-seccion]')
  const progreso = document.querySelector<HTMLElement>('[data-progreso]')
  const contador = document.querySelector<HTMLElement>('[data-contador-secretos]')
  const logo = document.querySelector<HTMLElement>('[data-logo]')
  const abrePaletas = document.querySelector<HTMLElement>('[data-paletas-toggle]')
  const menu = document.querySelector<HTMLElement>('[data-paletas]')
  const fondo = document.querySelector<HTMLElement>('[data-paletas-fondo]')
  const botonTema = document.querySelector<HTMLElement>('[data-tema-toggle]')
  const enlaceIdioma = document.querySelector<HTMLElement>('[data-cambiar-idioma]')

  bajas.push(conectarScrambleHover())

  // Barra de progreso de scroll de 1px.
  if (progreso) {
    bajas.push(alFrame(marco => {
      const alto = document.documentElement.scrollHeight - window.innerHeight
      progreso.style.transform = `scaleX(${alto > 0 ? marco.scrollY / alto : 0})`
    }))
  }

  // La ruta que sigue a ~/delio cambia con la sección visible.
  if (rutaSeccion) {
    bajas.push(on('seccion', id => {
      const rutas = dic.nav.rutas as Record<string, string>
      rutaSeccion.textContent = rutas[id] ?? ''
    }))
  }

  // Contador de secretos.
  function pintarContador (n: number) {
    if (!contador) return
    contador.textContent = n >= TOTAL_SECRETOS
      ? `★ ${TOTAL_SECRETOS}/${TOTAL_SECRETOS}`
      : `◆ ${n}/${TOTAL_SECRETOS}`
  }

  pintarContador(leerJson<string[]>(CLAVES.secretos, []).length)
  bajas.push(on('secreto', () => {
    pintarContador(leerJson<string[]>(CLAVES.secretos, []).length)
  }))

  if (contador) {
    const verSecretos = () => {
      document.getElementById('terminal')?.scrollIntoView({ behavior: 'smooth' })
      window.setTimeout(() => emit('ejecutar', lang === 'en' ? 'secrets' : 'secretos'), 500)
    }
    contador.addEventListener('click', verSecretos)
    bajas.push(() => contador.removeEventListener('click', verSecretos))
  }

  // Cinco clics rápidos en el logo encienden el modo desarrollador.
  if (logo) {
    const alClic = () => emit('logo')
    logo.addEventListener('click', alClic)
    bajas.push(() => logo.removeEventListener('click', alClic))
  }

  // Menú de paletas.
  let abierto = false

  function marcarActiva () {
    if (!menu) return
    const activa = paletaActual()
    for (const boton of menu.querySelectorAll<HTMLElement>('[data-paleta]')) {
      const esActiva = boton.dataset.paleta === activa
      const marca = boton.querySelector<HTMLElement>('[data-marca]')
      const muestra = boton.querySelector<HTMLElement>('[data-muestra]')
      if (marca) marca.textContent = esActiva ? '●' : ''
      if (muestra) {
        muestra.style.boxShadow = `0 0 0 1px ${esActiva ? 'var(--acc)' : 'var(--line)'}`
      }
    }
  }

  function abrirMenu () {
    if (!menu || !fondo || abierto) return
    abierto = true
    menu.hidden = false
    fondo.hidden = false
    abrePaletas?.setAttribute('aria-expanded', 'true')
    marcarActiva()
    if (!reducido) {
      gsap.fromTo(
        menu,
        { opacity: 0, y: -8, scale: 0.97, transformOrigin: '90% 0%' },
        { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'expo.out' }
      )
    }
  }

  function cerrarMenu () {
    if (!menu || !fondo || !abierto) return
    abierto = false
    abrePaletas?.setAttribute('aria-expanded', 'false')
    const ocultar = () => {
      menu.hidden = true
      fondo.hidden = true
    }
    if (reducido) ocultar()
    else {
      gsap.to(menu, {
        opacity: 0,
        y: -6,
        scale: 0.97,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: ocultar
      })
    }
  }

  if (abrePaletas) {
    const alternar = () => { abierto ? cerrarMenu() : abrirMenu() }
    abrePaletas.addEventListener('click', alternar)
    bajas.push(() => abrePaletas.removeEventListener('click', alternar))
  }

  if (fondo) {
    fondo.addEventListener('click', cerrarMenu)
    bajas.push(() => fondo.removeEventListener('click', cerrarMenu))
  }

  if (menu) {
    const elegir = (e: MouseEvent) => {
      const boton = (e.target as Element | null)?.closest<HTMLElement>('[data-paleta]')
      if (!boton?.dataset.paleta) return
      cerrarMenu()
      elegirPaleta(boton.dataset.paleta as NombrePaleta, e)
    }
    menu.addEventListener('click', elegir)
    bajas.push(() => menu.removeEventListener('click', elegir))
  }

  const alEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') cerrarMenu()
  }
  window.addEventListener('keydown', alEscape)
  bajas.push(() => window.removeEventListener('keydown', alEscape))

  bajas.push(on('tema', marcarActiva))

  // Claro / oscuro.
  if (botonTema) {
    const alternar = (e: MouseEvent) => alternarTema(e)
    botonTema.addEventListener('click', alternar)
    bajas.push(() => botonTema.removeEventListener('click', alternar))
  }

  // El botón ES/EN navega, pero además deja la preferencia guardada.
  if (enlaceIdioma) {
    const recordar = () => {
      escribirTexto(CLAVES.idioma, enlaceIdioma.dataset.cambiarIdioma ?? 'es')
    }
    enlaceIdioma.addEventListener('click', recordar)
    bajas.push(() => enlaceIdioma.removeEventListener('click', recordar))
  }

  return () => {
    for (const baja of bajas) baja()
  }
}
