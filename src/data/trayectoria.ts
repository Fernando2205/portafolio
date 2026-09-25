import type { Localizado } from '../i18n/tipos'

export type TipoTrayectoria = 'work' | 'edu' | 'cert'

export interface ItemTrayectoria {
  anio: string
  tipo: TipoTrayectoria
  titulo: string
  subtitulo: Localizado
  detalle: Localizado<string[]>
  /** Credencial verificable. Vacío = no se muestra el enlace. */
  url?: string
}

export const ETIQUETAS_TIPO: Record<TipoTrayectoria | 'all' | 'research', Localizado> = {
  all: { es: 'todo', en: 'all' },
  work: { es: 'experiencia', en: 'experience' },
  edu: { es: 'educación', en: 'education' },
  cert: { es: 'certificación', en: 'certification' },
  research: { es: 'investigación', en: 'research' }
}

/** Orden de las pestañas de la sección. */
export const TIPOS_TRAYECTORIA: TipoTrayectoria[] = ['work', 'edu', 'cert']

export const TRAYECTORIA: ItemTrayectoria[] = [
  {
    anio: '2027',
    tipo: 'edu',
    titulo: 'Universidad de San Buenaventura Cali',
    subtitulo: {
      es: 'Ingeniería de Sistemas · graduación prevista',
      en: 'Systems Engineering · expected graduation'
    },
    detalle: {
      es: ['Formación en ingeniería de software, bases de datos, redes y algoritmos.'],
      en: ['Training in software engineering, databases, networks and algorithms.']
    }
  },
  {
    anio: '2026',
    tipo: 'work',
    titulo: 'Life Investment Consulting',
    subtitulo: {
      es: 'Desarrollador Junior · Remoto · jun – sep 2026',
      en: 'Junior Developer · Remote · Jun – Sep 2026'
    },
    detalle: {
      es: [
        'Automatizaciones de flujos de trabajo con n8n que optimizan procesos internos y reducen tiempos operativos.',
        'Agentes de IA para gestión documental que integran modelos de lenguaje y OCR para clasificar y extraer información.',
        'Proyectos corporativos con equipos multidisciplinarios y entregas alineadas con objetivos estratégicos.'
      ],
      en: [
        'Workflow automations with n8n that streamline internal processes and cut operating time.',
        'AI agents for document management that combine language models and OCR to classify and extract information.',
        'Corporate projects with multidisciplinary teams and deliveries aligned with strategic goals.'
      ]
    }
  },
  {
    anio: '2026',
    tipo: 'cert',
    titulo: 'NSE 1 · Ciberseguridad',
    url: 'https://www.credly.com/badges/b0ac16d1-2434-4a5d-b5b4-0a92a8b0d08b/',
    subtitulo: { es: 'Fortinet', en: 'Fortinet' },
    detalle: {
      es: ['Certificación en fundamentos de ciberseguridad.'],
      en: ['Certification in cybersecurity fundamentals.']
    }
  },
  {
    anio: '2025',
    tipo: 'cert',
    titulo: 'Desarrollo de aplicaciones en la nube con Python',
    url: 'https://www.coursera.org/account/accomplishments/verify/6RCSHKNPRC9S',
    subtitulo: { es: 'Amazon Web Services', en: 'Amazon Web Services' },
    detalle: {
      es: ['Desarrollo de aplicaciones en la nube con Python en AWS.'],
      en: ['Cloud application development with Python on AWS.']
    }
  },
  {
    anio: '2025',
    tipo: 'cert',
    titulo: 'Consultor en la nube de AWS',
    url: 'https://www.coursera.org/account/accomplishments/verify/LAAOQE9ZU7K0',
    subtitulo: { es: 'Amazon Web Services', en: 'Amazon Web Services' },
    detalle: {
      es: ['Habilidades para trabajar como consultor en la nube de AWS.'],
      en: ['Skills to work as an AWS cloud consultant.']
    }
  },
  {
    anio: '2025',
    tipo: 'cert',
    titulo: 'Resolver problemas y tomar decisiones con eficacia',
    url: 'https://www.coursera.org/account/accomplishments/verify/BKK0Q1NFKFNF',
    subtitulo: { es: 'Universidad de California, Irvine', en: 'University of California, Irvine' },
    detalle: {
      es: ['Habilidades para resolver problemas y tomar decisiones con eficacia.'],
      en: ['Skills to solve problems and make decisions effectively.']
    }
  },
  {
    anio: '2024',
    tipo: 'cert',
    titulo: 'Programa ONE F2 T6 · Backend',
    url: 'https://app.aluracursos.com/program/certificate/33192f01-32b7-4aee-b46a-dd47c4feb6f2?lang',
    subtitulo: { es: 'Oracle · Oracle Next Education', en: 'Oracle · Oracle Next Education' },
    detalle: {
      es: ['Especialización Backend del programa Oracle Next Education.'],
      en: ['Backend specialization of the Oracle Next Education program.']
    }
  },
  {
    anio: '2024',
    tipo: 'cert',
    titulo: 'Formación principiante en programación G6',
    url: 'https://app.aluracursos.com/degree/certificate/7e6abf9e-e47f-4115-a0f5-1b741780ad05',
    subtitulo: { es: 'Oracle · Oracle Next Education', en: 'Oracle · Oracle Next Education' },
    detalle: {
      es: ['Fundamentos de programación del programa ONE.'],
      en: ['Programming fundamentals of the ONE program.']
    }
  },
  {
    anio: '2024',
    tipo: 'cert',
    titulo: 'Desarrollo personal G6',
    url: 'https://app.aluracursos.com/degree/certificate/e7bd4cbb-a93e-4709-be48-cfc9cceb529c',
    subtitulo: { es: 'Oracle · Oracle Next Education', en: 'Oracle · Oracle Next Education' },
    detalle: {
      es: ['Formación en desarrollo personal del programa ONE.'],
      en: ['Personal development training of the ONE program.']
    }
  }
]

export function porTipo (tipo: TipoTrayectoria) {
  return TRAYECTORIA.filter(item => item.tipo === tipo)
}
