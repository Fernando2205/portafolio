import { igual, type Localizado } from '../i18n/tipos'

export type TipoLogro = 'win' | 'hack' | 'paper'

/** Una etapa del recorrido de la tarjeta destacada (regional → nacional). */
export interface EtapaRecorrido {
  puesto: number
  etapa: Localizado
  titulo: string
}

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
  /** Etapas que se dibujan en la tarjeta destacada, en orden. */
  recorrido?: EtapaRecorrido[]
  /** Logro que ocupa la tarjeta grande de la sección. Solo uno. */
  destacado?: boolean
}

export const LOGROS: Logro[] = [
  {
    anio: '2026',
    tipo: 'hack',
    titulo: 'OCULUS',
    evento: {
      es: 'Hackathon Colombia 5.0 · MinTIC · Nacional',
      en: 'Hackathon Colombia 5.0 · MinTIC · National'
    },
    resultado: { es: '2.º lugar', en: '2nd place' },
    destacado: true,
    recorrido: [
      {
        puesto: 1,
        etapa: { es: 'Regional Valle del Cauca', en: 'Valle del Cauca regional' },
        titulo: 'UrbaNet'
      },
      {
        puesto: 2,
        etapa: { es: 'Final nacional', en: 'National final' },
        titulo: 'OCULUS'
      }
    ],
    proyecto: 'oculus',
    repo: 'https://github.com/Johan-Santacruz/BogotaHackColombia5.0',
    descripcion: {
      es: 'Auditoría de contratos públicos de Colombia con IA: puntajes de riesgo de corrupción sobre SECOP. Segundo lugar en la final nacional de la hackathon organizada por el MinTIC.',
      en: 'AI auditing of Colombian public contracts: corruption risk scores on SECOP data. Second place in the national final of the hackathon organized by MinTIC.'
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

/** El logro de la tarjeta grande: el marcado como `destacado`. */
export const LOGRO_DESTACADO = LOGROS.find(l => l.destacado)

export const LOGROS_SECUNDARIOS = LOGROS.filter(l => !l.destacado)
