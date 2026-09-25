import astro from 'eslint-plugin-astro'
import neostandard from 'neostandard'

/*
  Las plantillas de Astro no son JSX: llevan comillas dobles en los atributos,
  como el HTML. Las reglas `jsx-*` de neostandard se apagan solo en .astro para
  que no peleen con el formato del framework.
*/
const reglasJsxApagadas = Object.fromEntries(
  [
    'jsx-quotes',
    'jsx-indent',
    'jsx-indent-props',
    'jsx-closing-bracket-location',
    'jsx-closing-tag-location',
    'jsx-curly-brace-presence',
    'jsx-curly-newline',
    'jsx-curly-spacing',
    'jsx-equals-spacing',
    'jsx-first-prop-new-line',
    'jsx-max-props-per-line',
    'jsx-one-expression-per-line',
    'jsx-props-no-multi-spaces',
    'jsx-self-closing-comp',
    'jsx-tag-spacing',
    'jsx-wrap-multilines'
  ].map(regla => [`@stylistic/${regla}`, 'off'])
)

export default [
  ...neostandard({
    ts: true,
    ignores: ['dist', '.astro', 'node_modules', 'design_handoff_portafolio']
  }),
  ...astro.configs['flat/recommended'],
  {
    files: ['**/*.astro'],
    rules: {
      ...reglasJsxApagadas,
      // En HTML no todos los elementos vacíos pueden autocerrarse.
      'react/self-closing-comp': 'off'
    }
  }
]
