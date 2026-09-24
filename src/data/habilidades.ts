import type { Localizado } from '../i18n/tipos'

export interface HabilidadBlanda {
  nombre: Localizado
  /** Una frase concreta que la respalda. */
  evidencia: Localizado
}

/** El bloque «cómo trabajo»: 6 habilidades blandas numeradas 01–06. */
export const HABILIDADES_BLANDAS: HabilidadBlanda[] = [
  {
    nombre: { es: 'Trabajo en equipo', en: 'Teamwork' },
    evidencia: {
      es: 'equipos multidisciplinarios en Life Investment y tres hackatones en equipo.',
      en: 'multidisciplinary teams at Life Investment and three team hackathons.'
    }
  },
  {
    nombre: { es: 'Resolución de problemas', en: 'Problem solving' },
    evidencia: {
      es: 'convertir datos abiertos de SECOP en alertas de riesgo con OCULUS.',
      en: 'turning open SECOP data into risk alerts with OCULUS.'
    }
  },
  {
    nombre: { es: 'Aprendizaje rápido', en: 'Fast learning' },
    evidencia: {
      es: 'de Flutter a PyTorch y SAM: un stack distinto en cada proyecto.',
      en: 'from Flutter to PyTorch and SAM: a different stack in every project.'
    }
  },
  {
    nombre: { es: 'Adaptabilidad', en: 'Adaptability' },
    evidencia: {
      es: 'web, móvil, automatización e IA, en remoto y en sitio.',
      en: 'web, mobile, automation and AI, remote and on site.'
    }
  },
  {
    nombre: { es: 'Autonomía', en: 'Autonomy' },
    evidencia: {
      es: 'SamCore, mi trabajo de grado, de la investigación al despliegue.',
      en: 'SamCore, my thesis, from research to deployment.'
    }
  },
  {
    nombre: { es: 'Trabajo bajo presión', en: 'Working under pressure' },
    evidencia: {
      es: 'entregas contrarreloj en hackatones, con un primer lugar regional.',
      en: 'against-the-clock hackathon deliveries, with a regional first place.'
    }
  }
]
