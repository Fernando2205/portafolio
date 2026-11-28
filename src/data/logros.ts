import { igual, type Localizado } from '../i18n/tipos'

export type TipoLogro = 'win' | 'hack' | 'paper' | 'talk'

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
  /** Enlace externo de la tarjeta (p. ej. la publicación). */
  url?: string
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
    anio: '2026',
    tipo: 'talk',
    titulo: 'EISI 2026',
    evento: {
      es: 'V Encuentro Interinstitucional de Semilleros de Investigación',
      en: '5th Inter-institutional Meeting of Research Seedbeds'
    },
    resultado: { es: 'Ponencia', en: 'Talk' },
    proyecto: 'samcore',
    descripcion: igual('“Sistema inteligente para la detección de anomalías en productos basada en segmentación automática con modelos fundacionales de visión artificial”.')
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
    url: 'https://ieeexplore.ieee.org/document/11214607',
    descripcion: igual('“Evaluating Memoized Dynamic Programming and Greedy Best-First Search for Simulation-to-Real Mobile Robot Path Planning”.')
  },
  {
    anio: '2025',
    tipo: 'talk',
    titulo: 'STEAM FEST 2025',
    evento: igual('Fundación Mayagüez · Candelaria, Valle del Cauca'),
    resultado: { es: 'Expositor', en: 'Exhibitor' },
    url: 'https://cubecomunicaciones.com/steam-fest-2025-impulsando-la-educacion-en-ciencia-y-tecnologia-en-el-valle-del-cauca/',
    descripcion: {
      es: 'Exposición, con el semillero DIDI 4.0, del proyecto de planificación de rutas para robots móviles publicado en IEEE.',
      en: 'Exhibited, with the DIDI 4.0 research group, the mobile robot path planning project published at IEEE.'
    }
  }
]

/** El logro de la tarjeta grande: el marcado como `destacado`. */
export const LOGRO_DESTACADO = LOGROS.find(l => l.destacado)

export const LOGROS_SECUNDARIOS = LOGROS.filter(l => !l.destacado)
