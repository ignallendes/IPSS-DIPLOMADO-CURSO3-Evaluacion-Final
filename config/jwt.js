// ---------------------------------------------------------------------------
// CONFIG — el secreto para firmar y verificar los JWT.
// ---------------------------------------------------------------------------
// En un proyecto real esto va en una variable de entorno. Para la evaluación,
// puedes dejarlo aquí — pero cámbialo por una cadena tuya, larga y aleatoria.

export const JWT_SECRET = 'a892340d5944a58884eb86061b6780b0a847ef4990f42bfc3675d8a2934d62dd023028de69ec244840996766618d8e720594c221f13cfe921acf01d688d27ad6'

// Cuánto dura la sesión.
export const JWT_EXPIRA = '7d'
