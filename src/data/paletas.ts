/** Las 7 paletas elegibles por el visitante, en modo claro y oscuro. */

export type NombrePaleta =
  | 'Cálida'
  | 'Grafito'
  | 'Medianoche'
  | 'Tinta roja'
  | 'Bosque'
  | 'Violeta'
  | 'Fósforo'

export type Modo = 'dark' | 'light'

export interface Tono {
  bg: string
  fg: string
  /** Texto secundario. */
  mut: string
  /** Bordes y separadores. */
  line: string
  /** Superficies elevadas. */
  card: string
  /** Color de las partículas del canvas 3D. Solo se lee desde JS. */
  pt: string
}

export interface Paleta {
  acc: string
  dark: Tono
  light: Tono
}

export const PALETA_POR_DEFECTO: NombrePaleta = 'Grafito'

/** Acento de la recompensa por encontrar los 8 secretos. */
export const ACENTO_DORADO = '#e6b54a'

/** Acento temporal del modo Matrix. */
export const ACENTO_MATRIX = '#3dff7a'

export const PALETAS: Record<NombrePaleta, Paleta> = {
  Cálida: {
    acc: '#f08a3c',
    dark: { bg: '#16110d', fg: '#efe7dc', mut: '#a3978a', line: 'rgba(239,231,220,.12)', card: '#1e1712', pt: '#efe7dc' },
    light: { bg: '#f2ede5', fg: '#1b1510', mut: '#665b50', line: 'rgba(27,21,16,.14)', card: '#e8e1d6', pt: '#3a2c20' }
  },
  Grafito: {
    acc: '#c6e05a',
    dark: { bg: '#0f1112', fg: '#e7eae4', mut: '#8e958f', line: 'rgba(231,234,228,.11)', card: '#171a1b', pt: '#e7eae4' },
    light: { bg: '#eceee8', fg: '#141716', mut: '#5b625d', line: 'rgba(20,23,22,.13)', card: '#e0e3dc', pt: '#2a2f2c' }
  },
  Medianoche: {
    acc: '#7ea6ff',
    dark: { bg: '#0a0f1e', fg: '#e5e9f6', mut: '#8d96b4', line: 'rgba(229,233,246,.11)', card: '#111933', pt: '#c9d4ff' },
    light: { bg: '#eef1f8', fg: '#101628', mut: '#56607e', line: 'rgba(16,22,40,.13)', card: '#e1e6f2', pt: '#26314f' }
  },
  'Tinta roja': {
    acc: '#ff5a36',
    dark: { bg: '#101010', fg: '#f1efe9', mut: '#9a978f', line: 'rgba(241,239,233,.11)', card: '#1a1a1a', pt: '#f1efe9' },
    light: { bg: '#f1efe9', fg: '#111111', mut: '#5f5c56', line: 'rgba(17,17,17,.13)', card: '#e6e3dc', pt: '#222222' }
  },
  Bosque: {
    acc: '#e8c16a',
    dark: { bg: '#0c1411', fg: '#e3ece5', mut: '#8ea397', line: 'rgba(227,236,229,.11)', card: '#132019', pt: '#cfe3d5' },
    light: { bg: '#edf1ec', fg: '#0f1a15', mut: '#56695e', line: 'rgba(15,26,21,.13)', card: '#e0e7e1', pt: '#233a2e' }
  },
  Violeta: {
    acc: '#b892ff',
    dark: { bg: '#110d19', fg: '#ece7f5', mut: '#9c94ae', line: 'rgba(236,231,245,.11)', card: '#1a1426', pt: '#ddd0ff' },
    light: { bg: '#f1eef6', fg: '#161022', mut: '#625a74', line: 'rgba(22,16,34,.13)', card: '#e6e1ee', pt: '#2e2444' }
  },
  Fósforo: {
    acc: '#3dff8b',
    dark: { bg: '#060a07', fg: '#d5f3db', mut: '#7c9e84', line: 'rgba(213,243,219,.11)', card: '#0c140e', pt: '#9ff5b8' },
    light: { bg: '#ecf3ed', fg: '#07130b', mut: '#4f6a56', line: 'rgba(7,19,11,.13)', card: '#dfe9e1', pt: '#1b3a24' }
  }
}

export const NOMBRES_PALETA = Object.keys(PALETAS) as NombrePaleta[]

/** `Tinta roja` → `tintaroja`. Sirve para el comando `paleta <nombre>`. */
export function slugPaleta (nombre: string) {
  return nombre
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '')
}

export function buscarPaleta (consulta: string): NombrePaleta | undefined {
  const slug = slugPaleta(consulta)
  return NOMBRES_PALETA.find(n => slugPaleta(n) === slug)
}
