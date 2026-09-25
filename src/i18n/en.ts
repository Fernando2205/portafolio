import type { Diccionario } from './es'

/**
 * UI copy in English. Typed as the Spanish dictionary so any missing key or
 * changed function signature breaks the build instead of the page.
 */
export const en: Diccionario = {
  meta: {
    titulo: 'Delio Palacios · Full stack developer',
    descripcion: 'Portfolio of Delio Fernando Palacios, full stack developer in Cali: web software, n8n automations and AI agents.',
    imagenAlt: 'Delio Palacios, full stack developer in Cali: web software, automations and AI agents.',
    tituloOculto: '~ $ come back soon_'
  },

  loader: {
    cargando: 'loading',
    saltar: 'click to skip',
    lineas: [
      'booting delio.portfolio',
      'loading projects',
      'compiling experience',
      'spawning particles',
      'ready.'
    ]
  },

  nav: {
    enlaces: {
      'sobre-mi': 'about',
      trayectoria: 'journey',
      logros: 'achievements',
      proyectos: 'projects',
      terminal: 'terminal',
      stack: 'stack',
      contacto: 'contact'
    },
    rutas: {
      inicio: '',
      'sobre-mi': '/about',
      trayectoria: '/journey',
      logros: '/achievements',
      proyectos: '/projects',
      terminal: '/terminal',
      stack: '/stack',
      contacto: '/contact'
    },
    paleta: 'palette',
    idioma: 'lang',
    tema: 'theme',
    claro: '○ light',
    oscuro: '● dark',
    secretos: 'secrets found',
    etiqueta: 'Main navigation',
    irAlContenido: 'Skip to content'
  },

  hero: {
    whoami: 'whoami',
    disponible: 'open to new opportunities',
    tagline: 'Full stack developer. I build web software, workflow automations and AI agents.',
    estudios: 'Systems Engineering · USB Cali',
    ciudad: 'Cali, Colombia —',
    desliza: 'scroll'
  },

  cinta: {
    fila1: ['Full stack', 'Automation', 'AI agents', 'Web3'],
    fila2: ['Python', 'React', 'FastAPI', 'n8n', 'Cali, CO']
  },

  sobre: {
    etiqueta: '01 / about',
    parrafo: 'I study Systems Engineering at Universidad de San Buenaventura Cali and work as a developer. I build full stack applications, automate workflows with n8n and create AI agents that read, classify and extract information from documents. I am especially drawn to web3 and to technology that makes things more transparent.',
    fotoAlt: 'Portrait of Delio Fernando Palacios',
    fotoPendiente: 'Your photo here',
    datos: {
      construyendo: { clave: 'building', valor: 'AI agents for documents' },
      explorando: { clave: 'exploring', valor: 'Web3' },
      idiomas: { clave: 'languages', valor: 'Spanish · English B2' }
    },
    comoTrabajo: 'how I work',
    comandoHabilidades: 'skills'
  },

  trayectoria: {
    etiqueta: '02 / journey',
    titulo: 'Where I have been.',
    masDetalles: '+ details',
    cerrar: '− close',
    credencial: 'view credential'
  },

  logros: {
    etiqueta: '03 / achievements',
    titulo: 'Hackathons and research.',
    codigo: 'code'
  },

  proyectos: {
    etiqueta: '04 / projects',
    titulo: 'What I have built.',
    pista: 'hover · click to open',
    captura: 'screenshot',
    verProyecto: 'view project',
    codigo: 'code'
  },

  terminal: {
    etiqueta: '05 / ask me',
    titulo: 'Explore by typing.',
    barra: 'visitante@delio: ~',
    autocompletar: 'tab ⇥ autocomplete',
    placeholder: "type 'help' and press enter",
    historial: 'Terminal history',
    entrada: 'Terminal command',
    sugerencias: ['help', 'neofetch', 'projects', 'shape', 'play', 'secrets'],
    bienvenida: [
      'Welcome. This portfolio can also be explored by typing.',
      "Type 'help' or tap a suggestion.",
      "There are 8 secrets hidden here. Type 'secrets' to start the hunt."
    ]
  },

  stack: {
    etiqueta: '06 / stack',
    titulo: 'My tools.',
    pista: 'grab, throw, stack',
    sacudir: 'shake'
  },

  contacto: {
    etiqueta: '07 / contact',
    titulo: 'Have a project or a role? Let’s talk.',
    copiar: 'or copy the address',
    copiado: '✓ copied to clipboard',
    descargarCv: 'Download CV ↓'
  },

  pie: {
    copyright: '© 2026 Delio Fernando Palacios',
    psst: 'psst: there are 8 secrets hidden on this page',
    ciudad: 'Cali'
  },

  cursor: {
    escribir: 'write',
    abrir: 'open',
    cerrar: 'close',
    arrastra: 'drag',
    copiar: 'copy',
    escribe: 'type',
    ver: 'view',
    baja: 'scroll',
    tema: 'theme',
    idioma: 'lang'
  },

  toast: {
    secreto: 'secret unlocked',
    siguientePista: 'next hint',
    recompensa: 'Reward unlocked'
  },

  cmd: {
    ayuda: {
      cabecera: 'available commands:',
      lista: [
        'about        who I am',
        'skills       how I work',
        'experience   my journey',
        'achievements hackathons and research',
        'projects     what I have built',
        'open <n>     open a project',
        'stack        my tools',
        'certs        certifications',
        'contact      how to reach me',
        'neofetch     system info',
        'ls · cd · cat',
        'shape        change the 3D shape',
        'play         a small game',
        'secrets      what you have found',
        'theme · lang · clear'
      ]
    },
    sobremi: [
      'Delio Fernando Palacios',
      'Systems Engineering student (USB Cali, 2027) and full stack developer.',
      'n8n automation, AI agents and an interest in web3.'
    ],
    neofetch: {
      os: 'Systems Engineering',
      uptime: 'student until 2027',
      estado: 'status',
      abierto: 'open to opportunities',
      secretos: 'secrets'
    },
    habilidades: 'how I work:',
    proyectos: "use 'open 1' to see one.",
    abriendo: (nombre: string) => `opening ${nombre}…`,
    usoAbrir: (total: number) => `usage: open <1-${total}>`,
    stack: 'further down you can grab and throw them.',
    abriendoGithub: 'opening github…',
    abriendoLinkedin: 'opening linkedin…',
    descargandoCv: 'downloading cv…',
    ls: 'proyectos/  experiencia/  stack/  contacto/  cv.pdf  secretos.txt',
    catSecretos: "nice try. try 'secrets'.",
    catCv: "it is a pdf. try 'cv'.",
    usoCat: 'usage: cat <file>',
    cdNoExiste: (dir: string) => `no such directory: ${dir}`,
    forma: (nombre: string) => `shape: ${nombre}`,
    web3: ['gm.', 'chained blocks behind you. no token yet, but plenty of ideas.'],
    fiesta: 'party!',
    gravedadInvertida: 'gravity inverted. look at the stack.',
    gravedadNormal: 'gravity restored.',
    matrix: 'you need the code. it starts with ↑ ↑ …',
    paletasDisponibles: 'available palettes:',
    paletaActiva: (nombre: string) => `palette: ${nombre}`,
    usoPaleta: "use 'palette grafito', for example.",
    doradoBloqueado: 'that command is still locked.',
    doradoOn: 'gold mode on.',
    doradoOff: 'gold mode off.',
    temaOscuro: 'dark theme on.',
    temaClaro: 'light theme on.',
    idioma: 'language: english.',
    fecha: (hora: string) => `${hora} in Cali, Colombia.`,
    exit: 'you can not leave that easily.',
    cafe: ['brewing coffee…', 'done. now we can talk.'],
    hola: 'hi! glad you stopped by.',
    sudo: 'permission denied. I am the only admin here.',
    noEncontrado: (cmd: string) => `command not found: ${cmd}. try 'help'.`
  },

  juego: {
    inicio: 'guess the number (1–50). you have 7 tries.',
    instruccion: "type a number, or 'exit'.",
    terminado: 'game over.',
    acierto: (n: number, intentos: number) => `exactly! it was ${n}. you got it in ${intentos} tries.`,
    aciertoExtra: 'if you guess that fast, we should work together.',
    sinIntentos: (n: number) => `out of tries. it was ${n}. type 'play' again.`,
    masAlto: (restantes: number) => `higher ↑  (${restantes} tries left)`,
    masBajo: (restantes: number) => `lower ↓  (${restantes} tries left)`
  },

  autodestruccion: {
    ejecutando: 'running as superuser…',
    borrando: ['deleting /projects…', 'deleting /experience…', 'deleting /delio…'],
    restaurado: 'just kidding. system restored. nothing broke.'
  },

  secretos: {
    encontrados: (n: number, total: number) => `secrets found: ${n}/${total}`,
    siguiente: 'next',
    pista: 'hint',
    bloqueado: 'locked',
    masClara: "  type 'secrets' again for a clearer hint.",
    yaEsLaMasClara: '  that is already the clearest hint there is.',
    completo: "  all done. try 'gold'.",
    consola: 'well played. now write me: ',
    invitacionConsola: ['~ $ hola, dev.', 'Si estás leyendo esto, hablamos el mismo idioma. Escribe secreto() y pulsa enter.'],
    recompensa: [
      '★ 8/8 · reward unlocked',
      'You found every secret. That says a lot about you: curiosity and patience,',
      'the same things I look for in a good team. Write me and tell me which one you liked most.',
      "you unlocked the 'gold' command."
    ],
    gracias: 'THANKS'
  },

  casi: {
    rm: 'careful… that command is missing some flags and a slash.',
    fiesta: 'celebrate? you are very close to something.',
    gravedad: 'newton would be proud. the command is different, but close.',
    konami: 'classics are not typed: they are pressed with arrows, outside of here.',
    nombre: 'that name works better outside the terminal.',
    dev: 'that thing in the top left is hiding something.',
    consola: 'that one goes in the browser console, not here.',
    plural: 'almost: it is plural.',
    jugar: 'want to play? tell the terminal with a verb.',
    cerca: 'almost… you are a couple of letters away from something.'
  }
}
