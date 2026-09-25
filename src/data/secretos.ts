import type { Localizado } from '../i18n/tipos'

export type ClaveSecreto =
  | 'party'
  | 'gravity'
  | 'game'
  | 'rmrf'
  | 'name'
  | 'dev'
  | 'konami'
  | 'console'

export interface Secreto {
  clave: ClaveSecreto
  nombre: Localizado
  /** Tres pistas por idioma, de vaga a explícita. */
  pistas: Localizado<[string, string, string]>
}

/**
 * Los 8 secretos, en orden de búsqueda del tesoro: el siguiente pendiente es
 * el primero de esta lista que no se ha encontrado. Encontrar uno fuera de
 * orden también cuenta.
 */
export const SECRETOS: Secreto[] = [
  {
    clave: 'party',
    nombre: { es: 'Fiesta', en: 'Party' },
    pistas: {
      es: [
        'algo para celebrar en la terminal',
        "en inglés se diría 'party'",
        'escribe: fiesta'
      ],
      en: [
        'something to celebrate in the terminal',
        "in spanish it would be 'fiesta'",
        'type: party'
      ]
    }
  },
  {
    clave: 'gravity',
    nombre: { es: 'Gravedad invertida', en: 'Inverted gravity' },
    pistas: {
      es: [
        'la física también vive en la terminal',
        'newton tiene algo que ver',
        'escribe: gravedad'
      ],
      en: [
        'physics lives in the terminal too',
        'newton has something to do with it',
        'type: gravity'
      ]
    }
  },
  {
    clave: 'game',
    nombre: { es: 'Adivino', en: 'Mind reader' },
    pistas: {
      es: [
        'la terminal esconde un juego',
        'pregúntale a la terminal si quiere jugar',
        'escribe: jugar, y gana'
      ],
      en: [
        'the terminal hides a game',
        'ask the terminal if it wants to play',
        'type: play, and win'
      ]
    }
  },
  {
    clave: 'rmrf',
    nombre: { es: 'Autodestrucción', en: 'Self-destruct' },
    pistas: {
      es: [
        'el comando más peligroso de linux',
        'borra todo, recursivo y forzado',
        'escribe: sudo rm -rf /'
      ],
      en: [
        'the most dangerous linux command',
        'deletes everything, recursive and forced',
        'type: sudo rm -rf /'
      ]
    }
  },
  {
    clave: 'name',
    nombre: { es: 'Me conoces', en: 'You know me' },
    pistas: {
      es: [
        'no todo se escribe en la terminal',
        'sal de la terminal y teclea mi nombre de pila, sin usar ningún campo',
        'haz clic en una zona vacía de la página y teclea: delio'
      ],
      en: [
        'not everything is typed in the terminal',
        'leave the terminal and type my first name, with no field focused',
        'click an empty area of the page and type: delio'
      ]
    }
  },
  {
    clave: 'dev',
    nombre: { es: 'Modo desarrollador', en: 'Developer mode' },
    pistas: {
      es: [
        'hay algo arriba que premia la insistencia',
        '~/delio, arriba a la izquierda, no es solo texto',
        'haz clic 5 veces seguidas y rápido en ~/delio'
      ],
      en: [
        'something up top rewards insisting',
        '~/delio, in the top left, is not just text',
        'click ~/delio 5 times in a row, fast'
      ]
    }
  },
  {
    clave: 'konami',
    nombre: { es: 'Modo Matrix', en: 'Matrix mode' },
    pistas: {
      es: [
        'un código de videojuego clásico',
        'arriba, arriba, abajo, abajo…',
        'teclea ↑ ↑ ↓ ↓ ← → ← → B A'
      ],
      en: [
        'a classic video game code',
        'up, up, down, down…',
        'press ↑ ↑ ↓ ↓ ← → ← → B A'
      ]
    }
  },
  {
    clave: 'console',
    nombre: { es: 'Hacker de consola', en: 'Console hacker' },
    pistas: {
      es: [
        'los devs siempre abren la consola',
        'F12, o clic derecho → inspeccionar',
        'en la consola escribe: secreto()'
      ],
      en: [
        'devs always open the console',
        'F12, or right click → inspect',
        'in the console type: secret()'
      ]
    }
  }
]

export const ORDEN_SECRETOS = SECRETOS.map(s => s.clave)

export const TOTAL_SECRETOS = SECRETOS.length

export function secretoPorClave (clave: ClaveSecreto) {
  return SECRETOS.find(s => s.clave === clave)
}

/** La secuencia del código Konami, tal como llega en KeyboardEvent.key. */
export const KONAMI = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a'
]
