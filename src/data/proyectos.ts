import type { Localizado } from '../i18n/tipos'

export interface Proyecto {
  /** Identificador estable. También es el nombre del archivo de captura. */
  slug: string
  nombre: string
  anio: string
  /** Distintivo destacado sobre la descripción. Opcional. */
  distintivo?: Localizado
  tipo: Localizado
  /** Color del placeholder mientras no haya captura. */
  tinte: string
  /** Demo en vivo. Vacío = el dueño la añadirá más adelante. */
  url?: string
  repo?: string
  descripcion: Localizado
  etiquetas: string[]
}

/** SamCore, el trabajo de grado, va primero. */
export const PROYECTOS: Proyecto[] = [
  {
    slug: 'samcore',
    nombre: 'SamCore',
    anio: '2026',
    distintivo: { es: 'Trabajo de grado', en: 'Undergraduate thesis' },
    tipo: { es: 'Visión por computador + web', en: 'Computer vision + web' },
    tinte: 'oklch(0.42 0.07 100)',
    url: 'https://fercho2205-samcore.hf.space/',
    repo: 'https://github.com/Fernando2205/SAMCORE',
    descripcion: {
      es: 'Sistema de detección de anomalías en productos que combina SAM (segmentación automática) con PatchCore (banco de memoria) sobre las categorías de MVTec AD. Se expone en una aplicación web con cuentas, historial e inspección de imágenes propias, desplegada en un Space de Hugging Face con GPU.',
      en: 'Product anomaly detection system that combines SAM (automatic segmentation) with PatchCore (memory bank) on the MVTec AD object categories. It runs as a web app with accounts, history and inspection of your own images, deployed on a GPU Hugging Face Space.'
    },
    etiquetas: ['PyTorch', 'SAM', 'PatchCore', 'FastAPI', 'React', 'TypeScript', 'Docker']
  },
  {
    slug: 'oculus',
    nombre: 'OCULUS',
    anio: '2026',
    distintivo: {
      es: '2.º lugar · Hackathon Colombia 5.0 Nacional',
      en: '2nd place · Hackathon Colombia 5.0 National'
    },
    tipo: { es: 'Plataforma full stack + IA', en: 'Full stack platform + AI' },
    tinte: 'oklch(0.42 0.07 55)',
    url: '', // pendiente: demo de OCULUS
    descripcion: {
      es: 'Auditoría de contratos públicos de Colombia. Consume la API de SECOP y evalúa cada contrato con IA para asignar un puntaje de riesgo de corrupción. Incluye panel de alertas, mapa por regiones, infografías, reportes en PDF y consultas por voz y texto desde un bot de Telegram.',
      en: 'Audits Colombian public contracts. It consumes the SECOP API and scores each contract for corruption risk with AI. Includes an alerts dashboard, regional map, infographics, PDF reports, and voice and text queries through a Telegram bot.'
    },
    etiquetas: ['Python', 'FastAPI', 'React', 'OpenAI']
  },
  {
    slug: 'clara',
    nombre: 'CLARA',
    anio: '2025',
    tipo: { es: 'PWA de inventarios por voz', en: 'Voice inventory PWA' },
    tinte: 'oklch(0.42 0.07 150)',
    url: '', // pendiente: demo de CLARA
    descripcion: {
      es: 'Aplicación web progresiva para Colsubsidio que captura inventarios por voz: autenticación por reconocimiento facial, registro conversacional asistido por IA, validación en tiempo real contra el catálogo y actas firmadas digitalmente con exportación a PDF y Excel.',
      en: 'Progressive web app for Colsubsidio that captures inventory by voice: facial recognition login, AI-assisted conversational entry, real-time catalog validation and digitally signed records exported to PDF and Excel.'
    },
    etiquetas: ['React', 'FastAPI', 'OpenAI', 'face-api.js']
  },
  {
    slug: 'codemaster',
    nombre: 'CodeMaster',
    anio: '2024',
    tipo: { es: 'Juez de código online', en: 'Online code judge' },
    tinte: 'oklch(0.42 0.07 250)',
    url: '', // pendiente: demo de CodeMaster
    descripcion: {
      es: 'Plataforma tipo LeetCode: registro de usuarios, envío de soluciones y evaluación automática en Python, Java y Ruby contra casos de prueba, con historial de soluciones.',
      en: 'LeetCode-style platform: user accounts, solution submissions and automatic grading in Python, Java and Ruby against test cases, with a solution history.'
    },
    etiquetas: ['Python', 'Flask', 'PostgreSQL']
  },
  {
    slug: 'pokecards-3d',
    nombre: 'PokeCards 3D',
    anio: '2024',
    tipo: { es: 'Pokédex en 3D', en: '3D Pokédex' },
    tinte: 'oklch(0.42 0.07 330)',
    url: '', // pendiente: demo de PokeCards 3D
    descripcion: {
      es: 'Pokédex web que renderiza cartas de Pokémon en 3D real con React Three Fiber, con lista, panel de detalles y datos en tiempo real desde PokeAPI.',
      en: 'Web Pokédex that renders Pokémon cards in real 3D with React Three Fiber, with a list, detail panel and live data from PokeAPI.'
    },
    etiquetas: ['React', 'Three.js', 'R3F', 'PokeAPI']
  },
  {
    slug: 'peliculas-app',
    nombre: 'Películas App',
    anio: '2024',
    tipo: { es: 'App móvil', en: 'Mobile app' },
    tinte: 'oklch(0.42 0.07 200)',
    url: '', // pendiente: demo de Películas App
    descripcion: {
      es: 'App en Flutter para descubrir películas y series con datos de TMDB: autenticación segura, códigos QR geolocalizados en mapa, historial de escaneos y notificaciones push con Firebase.',
      en: 'Flutter app to discover movies and shows with TMDB data: secure auth, geolocated QR codes on a map, scan history and push notifications with Firebase.'
    },
    etiquetas: ['Flutter', 'Dart', 'Firebase', 'TMDB']
  }
]

export function proyectoPorSlug (slug: string) {
  return PROYECTOS.find(p => p.slug === slug)
}
