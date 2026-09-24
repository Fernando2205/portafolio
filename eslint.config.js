import neostandard from 'neostandard'
import astro from 'eslint-plugin-astro'

export default [
  ...neostandard({
    ts: true,
    ignores: ['dist', '.astro', 'node_modules', 'design_handoff_portafolio']
  }),
  ...astro.configs['flat/recommended']
]
