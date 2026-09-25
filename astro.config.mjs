// @ts-check
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'

// Sitio estático bilingüe: español en / e inglés en /en/.
// `site` alimenta el canonical, los hreflang y la URL absoluta de la imagen de
// Open Graph. Tiene que ser una URL completa, con protocolo.
export default defineConfig({
  site: 'https://www.fercho.dev',
  output: 'static',
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: { prefixDefaultLocale: false }
  },
  vite: {
    plugins: [tailwindcss()]
  }
})
