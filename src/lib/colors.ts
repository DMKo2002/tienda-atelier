/**
 * Resolución de color para la tienda.
 * ────────────────────────────────────
 * Los productos migrados desde WooCommerce (ex sitio WordPress) guardan el color
 * como texto libre (a veces con acentos, guiones de slug, mayúsculas, o un número
 * pegado al final como "camel1"). Los productos cargados desde el panel admin
 * guardan directamente un hex (#RRGGBB) elegido con el selector de color.
 *
 * Esta función soporta ambos casos: si ya es un hex lo devuelve tal cual: si es
 * texto, lo normaliza (sin acentos, sin guiones, minúsculas) y lo busca en el
 * diccionario de colores en español, con varias estrategias de fallback antes
 * de rendirse con un gris genérico.
 */

// Mapa de nombres de color en español → hex (claves ya normalizadas: sin acentos, con espacios)
export const COLOR_MAP: Record<string, string> = {
  negro: '#1C1C1C', 'negro azabache': '#0D0D0D', 'blanco roto': '#F5F1E8',
  blanco: '#F5F5F0', crudo: '#EFE8DA', crema: '#F0EBE1', hueso: '#F0E9DC', natural: '#EAE2D2',
  beige: '#D4C5A9', 'beige claro': '#E8DCC8', 'beige oscuro': '#B8A57F', 'beige moka': '#C8B89A',
  'french beige': '#D4C5A9', arena: '#C8B89A', marfil: '#FFFFF0',
  gris: '#9E9E9E', 'gris claro': '#D0D0D0', 'gris oscuro': '#555555', 'gris topo': '#8B8378',
  'gris perla': '#C7C7C7', 'gris plomo': '#6E6E6E', 'gris piedra': '#A8A398',
  plateado: '#C0C0C0', plata: '#C0C0C0',
  rojo: '#C0392B', bordo: '#7B2D42', bordeaux: '#7B2D42', borgona: '#7B2D42',
  granate: '#6B1F2A', vino: '#6B2737', cereza: '#9B2242', ladrillo: '#B24C3C',
  rosa: '#E8A0B0', 'rosa palido': '#F2C4CE', 'rosa pastel': '#F2C4CE', 'rosa viejo': '#C99AA0',
  fucsia: '#D6249F', salmon: '#E8957A',
  coral: '#E8714A', naranja: '#E8813A', terracota: '#C1440E', cobre: '#B87333', cobrizo: '#B26A45',
  mostaza: '#C8A84B', 'amarillo mostaza': '#C8A84B', amarillo: '#F0CC4A', 'amarillo pastel': '#F5E6A8',
  ocre: '#CC9A3A', dorado: '#D4AF37', oro: '#D4AF37', bronce: '#8C6B3F', champagne: '#F0E4D0',
  azul: '#3A7BC8', 'azul marino': '#1B3A6B', 'azul noche': '#0F2A4A', 'azul rey': '#1E4CA1',
  'azul frances': '#3163C4', 'azul claro': '#7EB8E0', 'azul palido': '#B0C4DE', 'azul acero': '#7A9BB5',
  'azul petroleo': '#1B4F5C', celeste: '#87CEEB', 'celeste pastel': '#B8DCE0', 'celeste palido': '#A8C8CA',
  denim: '#4A6A8A', jean: '#4A6A8A',
  verde: '#4A9B6F', 'verde oscuro': '#2D6A4F', 'verde ingles': '#2F5233', 'verde militar': '#4B5320',
  'verde oliva': '#6B6E3A', oliva: '#6B6E3A', 'verde agua': '#7BBFB5', 'verde botella': '#1D4A34',
  esmeralda: '#2E8B6E', turquesa: '#3AADA8',
  lila: '#B09BC8', violeta: '#8E44AD', morado: '#6C3483', lavanda: '#C8B8DC', uva: '#5B2A5C', berenjena: '#4C2A3C',
  camel: '#C19A6B', tostado: '#A97C50', canela: '#A9673A', cognac: '#9A5B2E', tabaco: '#8B6355',
  chocolate: '#5C3A1E', marron: '#6B4226', cafe: '#5C3A1E', caqui: '#A89870', khaki: '#A89870',
  tiza: '#E8E4DC', off: '#F5F2EC', moka: '#6F4E37', marino: '#1B3A6B', vison: '#8A7967',
  reptil: '#7A6A4F', zebra: '#3D3D3D',
  'rose gold': '#B76E79', 'lima neon': '#C4D82E',
}

// Sinónimos que deberían resolver a la misma clave (además de las ya presentes arriba)
const ALIASES: Record<string, string> = {
  borgona: 'bordo', bordeaux: 'bordo', burdeos: 'bordo',
  cafe: 'chocolate', marron: 'chocolate',
  khaki: 'caqui',
  plata: 'plateado',
  oro: 'dorado',
}

function stripAccents(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '')
}

function normalize(input: string): string {
  return stripAccents(input)
    .toLowerCase()
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// Claves del diccionario ordenadas por longitud descendente, para matching por substring
const SORTED_KEYS = Object.keys(COLOR_MAP).sort((a, b) => b.length - a.length)

export function getColorHex(name: string): string {
  const trimmed = (name ?? '').trim()
  if (!trimmed) return '#CCCCCC'

  // Hex directo (colores cargados desde el panel admin)
  if (/^#[0-9A-Fa-f]{3,8}$/.test(trimmed)) return trimmed

  const norm = normalize(trimmed)

  // 1. Match exacto (o alias)
  if (COLOR_MAP[norm]) return COLOR_MAP[norm]
  if (ALIASES[norm] && COLOR_MAP[ALIASES[norm]]) return COLOR_MAP[ALIASES[norm]]

  // 2. Sin número pegado al final: "camel1" -> "camel", "turquesa-2" -> "turquesa"
  const stripped = norm.replace(/\s*\d+$/, '').trim()
  if (COLOR_MAP[stripped]) return COLOR_MAP[stripped]
  if (ALIASES[stripped] && COLOR_MAP[ALIASES[stripped]]) return COLOR_MAP[ALIASES[stripped]]

  // 3. Substring: alguna clave conocida (la más específica/larga primero) aparece dentro
  //    del texto — ej. "azul marino oscuro" debe resolver a "azul marino", no solo "azul"
  for (const key of SORTED_KEYS) {
    if (stripped.includes(key)) return COLOR_MAP[key]
  }

  // 4. Última red: probar primera y última palabra sueltas
  const words = stripped.split(' ').filter(Boolean)
  if (words.length > 1) {
    if (COLOR_MAP[words[0]]) return COLOR_MAP[words[0]]
    if (COLOR_MAP[words[words.length - 1]]) return COLOR_MAP[words[words.length - 1]]
    if (ALIASES[words[0]] && COLOR_MAP[ALIASES[words[0]]]) return COLOR_MAP[ALIASES[words[0]]]
    if (ALIASES[words[words.length - 1]] && COLOR_MAP[ALIASES[words[words.length - 1]]]) return COLOR_MAP[ALIASES[words[words.length - 1]]]
  }

  return '#CCCCCC'
}

export function isLightColor(hex: string): boolean {
  const clean = hex.replace('#', '')
  const r = parseInt(clean.slice(0, 2), 16)
  const g = parseInt(clean.slice(2, 4), 16)
  const b = parseInt(clean.slice(4, 6), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 180
}
