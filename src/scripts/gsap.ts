import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/** Registro único del plugin: el resto de los módulos importa desde aquí. */
gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }
