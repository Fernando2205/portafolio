// @ts-check
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'

// Sitio estático bilingüe: español en / e inglés en /en/.
// `site` se usa para el canonical, los hreflang y los metadatos OG:
// cámbialo por el dominio definitivo al desplegar.
export default defineConfig({
  site: 'https://delio-palacios.pages.dev',
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
