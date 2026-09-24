/**
 * Las 24 herramientas del stack. Son las pastillas con física de la sección 06.
 *
 * `icono` es el slug de simple-icons; `null` cuando la marca no tiene ícono
 * disponible (Oracle DB, TestNG y OpenAI se quedan solo con el texto).
 *
 * `marca` es el color al que pasa el logo en hover. `null` en las marcas
 * negras (Express, Flask, Three.js), que no cambian de color.
 */
export interface Herramienta {
  nombre: string
  icono: string | null
  marca: string | null
}

export const STACK: Herramienta[] = [
  { nombre: 'Python', icono: 'python', marca: '#3776AB' },
  { nombre: 'JavaScript', icono: 'javascript', marca: '#F7DF1E' },
  { nombre: 'TypeScript', icono: 'typescript', marca: '#3178C6' },
  { nombre: 'Java', icono: 'openjdk', marca: '#ED8B00' },
  { nombre: 'Dart', icono: 'dart', marca: '#0175C2' },
  { nombre: 'React', icono: 'react', marca: '#61DAFB' },
  { nombre: 'Node.js', icono: 'nodedotjs', marca: '#5FA04E' },
  { nombre: 'Express', icono: 'express', marca: null },
  { nombre: 'Spring Boot', icono: 'springboot', marca: '#6DB33F' },
  { nombre: 'Django', icono: 'django', marca: '#44B78B' },
  { nombre: 'Flask', icono: 'flask', marca: null },
  { nombre: 'FastAPI', icono: 'fastapi', marca: '#009688' },
  { nombre: 'Tailwind', icono: 'tailwindcss', marca: '#06B6D4' },
  { nombre: 'Flutter', icono: 'flutter', marca: '#54C5F8' },
  { nombre: 'PostgreSQL', icono: 'postgresql', marca: '#4169E1' },
  { nombre: 'Oracle DB', icono: null, marca: null },
  { nombre: 'Docker', icono: 'docker', marca: '#2496ED' },
  { nombre: 'Git', icono: 'git', marca: '#F05032' },
  { nombre: 'n8n', icono: 'n8n', marca: '#EA4B71' },
  { nombre: 'Selenium', icono: 'selenium', marca: '#43B02A' },
  { nombre: 'Jest', icono: 'jest', marca: '#C21325' },
  { nombre: 'TestNG', icono: null, marca: null },
  { nombre: 'Three.js', icono: 'threedotjs', marca: null },
  { nombre: 'OpenAI', icono: null, marca: '#10A37F' }
]

/** La lista plana que imprime el comando `stack` de la terminal. */
export const NOMBRES_STACK = STACK.map(h => h.nombre)
