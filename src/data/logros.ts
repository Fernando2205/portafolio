import { igual, type Localizado } from '../i18n/tipos'

export type TipoLogro = 'win' | 'hack' | 'paper'

export interface Logro {
  anio: string
  tipo: TipoLogro
  titulo: string
  /** Evento o publicación. */
  evento: Localizado
  /** Resultado: ganador, 2.º lugar, participante, publicación. */
  resultado: Localizado
  descripcion: Localizado
  repo?: string
  /** Slug del proyecto que abre la tarjeta al hacer clic. */
  proyecto?: string
}

export const LOGROS: Logro[] = [
  {
    anio: '2026',
    tipo: 'win',
    titulo: 'UrbaNet',
    evento: igual('Hackathon Colombia 5.0 · Regional Valle del Cauca'),
    resultado: { es: 'Ganador', en: 'Winner' },
    repo: 'https://github.com/Johan-Santacruz/Colombia5.0',
    // pendiente: descripción real de UrbaNet
    descripcion: {
      es: 'Proyecto ganador de la etapa regional del Valle del Cauca, que dio el paso a la final nacional.',
      en: 'Winning project of the Valle del Cauca regional stage, which led to the national final.'
    }
  },
  {
    anio: '2026',
    tipo: 'hack',
    titulo: 'OCULUS',
    evento: igual('Hackathon Colombia 5.0 · Nacional'),
    resultado: { es: '2.º lugar', en: '2nd place' },
    proyecto: 'oculus',
    descripcion: {
      es: 'Auditoría de contratos públicos con IA. Segundo lugar en la final nacional.',
      en: 'AI auditing of public contracts. Second place in the national final.'
    }
  },
  {
    anio: '2026',
    tipo: 'hack',
    titulo: 'CLARA',
    evento: igual('Hackatón Colsubsidio × 30X'),
    resultado: { es: 'Participante', en: 'Participant' },
    proyecto: 'clara',
    descripcion: {
      es: 'PWA de inventarios por voz con reconocimiento facial, construida para el reto de Colsubsidio.',
      en: 'Voice inventory PWA with facial recognition, built for the Colsubsidio challenge.'
    }
  },
  {
    anio: '2025',
    tipo: 'paper',
    titulo: 'IEEE · AmITIC 2025',
    evento: {
      es: 'VIII Congreso Internacional AmITIC',
      en: 'VIII International Congress AmITIC'
    },
    resultado: { es: 'Publicación', en: 'Publication' },
    descripcion: igual('“Evaluating Memoized Dynamic Programming and Greedy Best-First Search for Simulation-to-Real Mobile Robot Path Planning”.')
  }
]

/** El logro destacado de la sección: la victoria regional. */
export const LOGRO_DESTACADO = LOGROS.find(l => l.tipo === 'win')

export const LOGROS_SECUNDARIOS = LOGROS.filter(l => l.tipo !== 'win')
