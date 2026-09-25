/**
 * Copy de la interfaz en español. Es la fuente de verdad de la forma del
 * diccionario: en.ts se declara como `typeof es`, así que TypeScript avisa si
 * falta una clave o cambia la firma de una función.
 *
 * El copy está copiado tal cual del prototipo; no se reescribe.
 */
export const es = {
  meta: {
    titulo: 'Delio Palacios · Desarrollador full stack',
    descripcion: 'Portafolio de Delio Fernando Palacios, desarrollador full stack en Cali: software web, automatizaciones con n8n y agentes de IA.',
    imagenAlt: 'Delio Palacios, desarrollador full stack en Cali: software web, automatizaciones y agentes de IA.',
    tituloOculto: '~ $ vuelve pronto_'
  },

  loader: {
    cargando: 'cargando',
    saltar: 'clic para saltar',
    lineas: [
      'iniciando delio.portafolio',
      'cargando proyectos',
      'compilando experiencia',
      'generando partículas',
      'listo.'
    ]
  },

  nav: {
    enlaces: {
      'sobre-mi': 'sobre mí',
      trayectoria: 'trayectoria',
      logros: 'logros',
      proyectos: 'proyectos',
      terminal: 'terminal',
      stack: 'stack',
      contacto: 'contacto'
    },
    /** Ruta que el logo muestra según la sección visible. */
    rutas: {
      inicio: '',
      'sobre-mi': '/sobre-mi',
      trayectoria: '/trayectoria',
      logros: '/logros',
      proyectos: '/proyectos',
      terminal: '/terminal',
      stack: '/stack',
      contacto: '/contacto'
    },
    paleta: 'paleta',
    idioma: 'idioma',
    tema: 'tema',
    claro: '○ claro',
    oscuro: '● oscuro',
    secretos: 'secretos encontrados',
    etiqueta: 'Navegación principal',
    irAlContenido: 'Saltar al contenido'
  },

  hero: {
    whoami: 'whoami',
    disponible: 'abierto a nuevas oportunidades',
    tagline: 'Desarrollador full stack. Construyo software web, automatizaciones y agentes de IA.',
    estudios: 'Ingeniería de Sistemas · USB Cali',
    ciudad: 'Cali, Colombia —',
    desliza: 'desliza'
  },

  cinta: {
    fila1: ['Full stack', 'Automatización', 'Agentes de IA', 'Web3'],
    fila2: ['Python', 'React', 'FastAPI', 'n8n', 'Cali, CO']
  },

  sobre: {
    etiqueta: '01 / sobre mí',
    parrafo: 'Estudio Ingeniería de Sistemas en la Universidad de San Buenaventura Cali y trabajo como desarrollador. Construyo aplicaciones full stack, automatizo flujos de trabajo con n8n y creo agentes de IA que leen, clasifican y extraen información de documentos. Me interesa especialmente la web3 y la tecnología que hace las cosas más transparentes.',
    fotoAlt: 'Retrato de Delio Fernando Palacios',
    fotoPendiente: 'Tu foto aquí',
    datos: {
      construyendo: { clave: 'construyendo', valor: 'Agentes de IA documentales' },
      explorando: { clave: 'explorando', valor: 'Web3' },
      idiomas: { clave: 'idiomas', valor: 'Español · Inglés B2' }
    },
    comoTrabajo: 'cómo trabajo',
    comandoHabilidades: 'habilidades'
  },

  trayectoria: {
    etiqueta: '02 / trayectoria',
    titulo: 'Por dónde he pasado.',
    masDetalles: '+ detalles',
    cerrar: '− cerrar',
    credencial: 'ver credencial'
  },

  logros: {
    etiqueta: '03 / logros',
    titulo: 'Hackatones e investigación.',
    codigo: 'código'
  },

  proyectos: {
    etiqueta: '04 / proyectos',
    titulo: 'Lo que he construido.',
    pista: 'pasa el cursor · clic para abrir',
    captura: 'captura',
    verProyecto: 'ver proyecto',
    codigo: 'código'
  },

  terminal: {
    etiqueta: '05 / pregúntame',
    titulo: 'Explora escribiendo.',
    barra: 'visitante@delio: ~',
    autocompletar: 'tab ⇥ autocompletar',
    placeholder: "escribe 'ayuda' y pulsa enter",
    historial: 'Historial de la terminal',
    entrada: 'Comando de la terminal',
    sugerencias: ['ayuda', 'neofetch', 'proyectos', 'forma', 'jugar', 'secretos'],
    bienvenida: [
      'Bienvenido. Este portafolio también se navega escribiendo.',
      "Escribe 'ayuda' o toca una sugerencia.",
      "Hay 8 secretos escondidos. Escribe 'secretos' para empezar la búsqueda."
    ]
  },

  stack: {
    etiqueta: '06 / stack',
    titulo: 'Mis herramientas.',
    pista: 'agarra, lanza, apila',
    sacudir: 'sacudir'
  },

  contacto: {
    etiqueta: '07 / contacto',
    titulo: '¿Tienes un proyecto o una vacante? Hablemos.',
    copiar: 'o copia la dirección',
    copiado: '✓ copiado al portapapeles',
    descargarCv: 'Descargar CV ↓'
  },

  pie: {
    copyright: '© 2026 Delio Fernando Palacios',
    psst: 'psst: hay 8 secretos escondidos en esta página',
    ciudad: 'Cali'
  },

  /** Etiquetas de la pastilla del cursor personalizado. */
  cursor: {
    escribir: 'escribir',
    abrir: 'abrir',
    cerrar: 'cerrar',
    arrastra: 'arrastra',
    copiar: 'copiar',
    escribe: 'escribe',
    ver: 'ver',
    baja: 'baja',
    tema: 'tema',
    idioma: 'idioma'
  },

  toast: {
    secreto: 'secreto desbloqueado',
    siguientePista: 'siguiente pista',
    recompensa: 'Recompensa desbloqueada'
  },

  /** Salidas de los comandos de la terminal. */
  cmd: {
    ayuda: {
      cabecera: 'comandos disponibles:',
      lista: [
        'sobremi         quién soy',
        'habilidades     cómo trabajo',
        'experiencia     mi trayectoria',
        'logros          hackatones e investigación',
        'proyectos       lo que he construido',
        'abrir <n>       ver un proyecto',
        'stack           mis herramientas',
        'certificaciones mis certificados',
        'contacto        cómo encontrarme',
        'neofetch        info del sistema',
        'ls · cd · cat',
        'forma           cambia la figura 3D',
        'jugar           un mini-juego',
        'secretos        lo que has descubierto',
        'tema · idioma · limpiar'
      ]
    },
    sobremi: [
      'Delio Fernando Palacios',
      'Estudiante de Ingeniería de Sistemas (USB Cali, 2027) y desarrollador full stack.',
      'Automatización con n8n, agentes de IA e interés en web3.'
    ],
    neofetch: {
      os: 'Ingeniería de Sistemas',
      uptime: 'estudiante hasta 2027',
      estado: 'estado',
      abierto: 'abierto a oportunidades',
      secretos: 'secretos'
    },
    habilidades: 'cómo trabajo:',
    proyectos: "usa 'abrir 1' para ver uno.",
    abriendo: (nombre: string) => `abriendo ${nombre}…`,
    usoAbrir: (total: number) => `uso: abrir <1-${total}>`,
    stack: 'más abajo puedes agarrarlas y lanzarlas.',
    abriendoGithub: 'abriendo github…',
    abriendoLinkedin: 'abriendo linkedin…',
    descargandoCv: 'descargando cv…',
    ls: 'proyectos/  experiencia/  stack/  contacto/  cv.pdf  secretos.txt',
    catSecretos: "buen intento. prueba 'secretos'.",
    catCv: "es un pdf. prueba 'cv'.",
    usoCat: 'uso: cat <archivo>',
    cdNoExiste: (dir: string) => `no existe: ${dir}`,
    forma: (nombre: string) => `figura: ${nombre}`,
    web3: ['gm.', 'bloques encadenados detrás de ti. aún no tengo token, pero sí muchas ideas.'],
    fiesta: '¡fiesta!',
    gravedadInvertida: 'gravedad invertida. mira el stack.',
    gravedadNormal: 'gravedad restaurada.',
    matrix: 'necesitas el código. empieza con ↑ ↑ …',
    paletasDisponibles: 'paletas disponibles:',
    paletaActiva: (nombre: string) => `paleta: ${nombre}`,
    usoPaleta: "usa 'paleta grafito', por ejemplo.",
    doradoBloqueado: 'ese comando todavía está bloqueado.',
    doradoOn: 'modo dorado activado.',
    doradoOff: 'modo dorado desactivado.',
    temaOscuro: 'tema oscuro activado.',
    temaClaro: 'tema claro activado.',
    idioma: 'idioma: español.',
    fecha: (hora: string) => `${hora} en Cali, Colombia.`,
    exit: 'no puedes irte tan fácil.',
    cafe: ['preparando café…', 'listo. ahora sí, hablemos.'],
    hola: '¡hola! qué bueno tenerte por aquí.',
    sudo: 'permiso denegado. aquí el único admin soy yo.',
    noEncontrado: (cmd: string) => `comando no encontrado: ${cmd}. prueba 'ayuda'.`
  },

  juego: {
    inicio: 'adivina el número (1–50). tienes 7 intentos.',
    instruccion: "escribe un número, o 'salir'.",
    terminado: 'juego terminado.',
    acierto: (n: number, intentos: number) => `¡exacto! era ${n}. lo lograste en ${intentos} intentos.`,
    aciertoExtra: 'si adivinas así de rápido, deberíamos trabajar juntos.',
    sinIntentos: (n: number) => `sin intentos. el número era ${n}. escribe 'jugar' para otra.`,
    masAlto: (restantes: number) => `más alto ↑  (${restantes} intentos)`,
    masBajo: (restantes: number) => `más bajo ↓  (${restantes} intentos)`
  },

  autodestruccion: {
    ejecutando: 'ejecutando con permisos de superusuario…',
    borrando: ['eliminando /proyectos…', 'eliminando /experiencia…', 'eliminando /delio…'],
    restaurado: 'es broma. sistema restaurado. nada se rompió.'
  },

  secretos: {
    encontrados: (n: number, total: number) => `secretos encontrados: ${n}/${total}`,
    siguiente: 'siguiente',
    pista: 'pista',
    bloqueado: 'bloqueado',
    masClara: "  vuelve a escribir 'secretos' para una pista más clara.",
    yaEsLaMasClara: '  esa ya es la pista más clara que hay.',
    completo: "  completaste todo. prueba 'dorado'.",
    consola: 'bien jugado. ahora escríbeme: ',
    invitacionConsola: ['~ $ hola, dev.', 'Si estás leyendo esto, hablamos el mismo idioma. Escribe secreto() y pulsa enter.'],
    recompensa: [
      '★ 8/8 · recompensa desbloqueada',
      'Encontraste todos los secretos. Eso dice mucho de ti: curiosidad y paciencia,',
      'lo mismo que busco en un buen equipo. Escríbeme y cuéntame cuál fue tu favorito.',
      "desbloqueaste el comando 'dorado'."
    ],
    /** Palabra que forman las partículas al completar los 8 secretos. */
    gracias: 'GRACIAS'
  },

  /** Respuestas «casi» cuando el visitante se acerca a un secreto. */
  casi: {
    rm: 'cuidado… a ese comando le faltan banderas y una barra.',
    fiesta: '¿celebrar? estás muy cerca de algo.',
    gravedad: 'newton estaría orgulloso. el comando es otro, pero cerca.',
    konami: 'los clásicos no se escriben: se teclean con flechas, fuera de aquí.',
    nombre: 'ese nombre funciona mejor fuera de la terminal.',
    dev: 'eso de arriba a la izquierda guarda algo.',
    consola: 'esa va en la consola del navegador, no aquí.',
    plural: 'casi: es en plural.',
    jugar: '¿quieres jugar? díselo a la terminal con un verbo.',
    cerca: 'casi… estás a un par de letras de algo.'
  }
}

export type Diccionario = typeof es
