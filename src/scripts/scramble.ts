import { alFrame, reducido } from './loop'

/**
 * Efecto de descifrado: el texto se rellena con caracteres aleatorios y se
 * revela de izquierda a derecha. Va por el bucle de frames global y se da de
 * baja al terminar, para no dejar tareas colgando.
 */
const CARACTERES = '!<>-_\\/[]{}=+*^?#01$%&'

export function descifrar (el: HTMLElement) {
  if (reducido || el.dataset.descifrando) return

  const final = el.textContent ?? ''
  if (!final) return

  el.dataset.descifrando = '1'
  let cuadros = 0
  // El callback solo corre en el siguiente frame, cuando `baja` ya existe.
  const baja = alFrame(() => {
    cuadros++
    const revelado = Math.floor(cuadros / 1.6)
    el.textContent = Array.from(final, (letra, i) =>
      i < revelado || letra === ' '
        ? letra
        : CARACTERES[Math.floor(Math.random() * CARACTERES.length)]
    ).join('')

    if (revelado >= final.length) {
      el.textContent = final
      delete el.dataset.descifrando
      baja()
    }
  })
}

/** Conecta el descifrado al hover de todo `[data-scramble-hover]`. */
export function conectarScrambleHover () {
  const nodos = Array.from(document.querySelectorAll<HTMLElement>('[data-scramble-hover]'))
  const alEntrar = (e: Event) => {
    if (e.currentTarget instanceof HTMLElement) descifrar(e.currentTarget)
  }

  for (const nodo of nodos) nodo.addEventListener('mouseenter', alEntrar)

  return () => {
    for (const nodo of nodos) nodo.removeEventListener('mouseenter', alEntrar)
  }
}
