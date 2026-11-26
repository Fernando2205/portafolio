import { pausarCursor } from './cursor'

interface Captura {
  src: string
  ancho: number
  alto: number
}

/**
 * Visor de capturas: clic en una captura de proyecto (`[data-ampliar]`) y se
 * abre en grande. Si el proyecto tiene varias, se pasa de una a otra con las
 * flechas en pantalla, las del teclado o deslizando en táctil.
 *
 * Las capturas grandes vienen en `data-galeria` de la fila del proyecto, ya
 * optimizadas por astro:assets.
 */
export function iniciarGaleria () {
  const visor = document.querySelector<HTMLDialogElement>('[data-visor-captura]')
  if (!visor) return

  const imagen = visor.querySelector<HTMLImageElement>('[data-visor-imagen]')
  const titulo = visor.querySelector<HTMLElement>('[data-visor-titulo]')
  const contador = visor.querySelector<HTMLElement>('[data-visor-contador]')
  const escenario = visor.querySelector<HTMLElement>('[data-visor-escenario]')
  const cerrar = visor.querySelector<HTMLElement>('[data-visor-cerrar]')
  const anterior = visor.querySelector<HTMLElement>('[data-visor-anterior]')
  const siguiente = visor.querySelector<HTMLElement>('[data-visor-siguiente]')
  if (!imagen || !escenario) return

  let galeria: Captura[] = []
  let indice = 0
  let nombre = ''
  let devolverFoco: HTMLElement | null = null

  function mostrar (i: number) {
    if (!imagen || galeria.length === 0) return
    indice = (i + galeria.length) % galeria.length
    const captura = galeria[indice]

    imagen.setAttribute('data-cargando', '')
    imagen.onload = () => imagen.removeAttribute('data-cargando')
    imagen.width = captura.ancho
    imagen.height = captura.alto
    imagen.src = captura.src
    imagen.alt = `${nombre} · ${indice + 1}/${galeria.length}`
    if (imagen.complete) imagen.removeAttribute('data-cargando')

    const varias = galeria.length > 1
    if (contador) contador.textContent = varias ? `${indice + 1} / ${galeria.length}` : ''
    if (anterior) anterior.hidden = !varias
    if (siguiente) siguiente.hidden = !varias
  }

  const alAmpliar = (e: Event) => {
    const objetivo = e.target
    if (!(objetivo instanceof Element)) return
    const disparador = objetivo.closest<HTMLElement>('[data-ampliar]')
    if (!disparador) return
    const fila = disparador.closest<HTMLElement>('[data-galeria]')
    if (!fila?.dataset.galeria) return

    e.preventDefault()
    e.stopPropagation()

    galeria = JSON.parse(fila.dataset.galeria) as Captura[]
    nombre = fila.dataset.nombre ?? ''
    if (titulo) titulo.textContent = nombre
    devolverFoco = disparador
    mostrar(Number(disparador.dataset.ampliar) || 0)

    visor.showModal()
    // showModal() enfoca el primer botón (cerrar), y al usar las flechas del
    // teclado el navegador le pinta el anillo de foco. El foco va al visor:
    // las flechas siguen funcionando y Tab llega a los botones igual.
    visor.focus()
    // El cursor personalizado queda por debajo de la capa superior del <dialog>.
    pausarCursor(true)
    document.body.style.overflow = 'hidden'
  }

  const alCerrar = () => visor.close()
  const alAnterior = () => mostrar(indice - 1)
  const alSiguiente = () => mostrar(indice + 1)

  // Clic fuera de la imagen y de los botones: cierra.
  const alClicFondo = (e: MouseEvent) => {
    if (e.target === visor || e.target === escenario) visor.close()
  }

  const alTeclado = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') alAnterior()
    else if (e.key === 'ArrowRight') alSiguiente()
  }

  // Deslizar en táctil: más de 50px en horizontal cambia de captura.
  let inicioX: number | null = null
  const alTocar = (e: TouchEvent) => { inicioX = e.touches[0]?.clientX ?? null }
  const alSoltar = (e: TouchEvent) => {
    if (inicioX === null || galeria.length < 2) return
    const dx = (e.changedTouches[0]?.clientX ?? inicioX) - inicioX
    inicioX = null
    if (Math.abs(dx) > 50) mostrar(indice + (dx < 0 ? 1 : -1))
  }

  // Cubre también el cierre con Escape, que lo hace el navegador.
  const alCerrarse = () => {
    pausarCursor(false)
    document.body.style.overflow = ''
    devolverFoco?.focus({ preventScroll: true })
    devolverFoco = null
  }

  document.addEventListener('click', alAmpliar, true)
  cerrar?.addEventListener('click', alCerrar)
  anterior?.addEventListener('click', alAnterior)
  siguiente?.addEventListener('click', alSiguiente)
  visor.addEventListener('click', alClicFondo)
  visor.addEventListener('keydown', alTeclado)
  visor.addEventListener('touchstart', alTocar, { passive: true })
  visor.addEventListener('touchend', alSoltar)
  visor.addEventListener('close', alCerrarse)

  return () => {
    document.removeEventListener('click', alAmpliar, true)
    cerrar?.removeEventListener('click', alCerrar)
    anterior?.removeEventListener('click', alAnterior)
    siguiente?.removeEventListener('click', alSiguiente)
    visor.removeEventListener('click', alClicFondo)
    visor.removeEventListener('keydown', alTeclado)
    visor.removeEventListener('touchstart', alTocar)
    visor.removeEventListener('touchend', alSoltar)
    visor.removeEventListener('close', alCerrarse)
    if (visor.open) visor.close()
  }
}
