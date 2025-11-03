/**
 * Formats a number as currency for El Salvador (USD)
 * @param {number|string} amount - The amount to format
 * @param {object} options - Formatting options
 * @param {boolean} options.includeSymbol - Whether to include the $ symbol (default: false, as components usually add it separately)
 * @param {number} options.minimumFractionDigits - Minimum decimal places (default: 2)
 * @param {number} options.maximumFractionDigits - Maximum decimal places (default: 2)
 * @returns {string} Formatted currency string
 */
export function formatCurrencySV(amount, options = {}) {
  const {
    includeSymbol = false,
    minimumFractionDigits = 2,
    maximumFractionDigits = 2
  } = options

  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  
  if (isNaN(numAmount) || numAmount === null || numAmount === undefined) {
    return 'N/A'
  }

  const formatted = numAmount.toLocaleString('es-SV', {
    minimumFractionDigits,
    maximumFractionDigits
  })

  return includeSymbol ? `$${formatted}` : formatted
}

/**
 * Formats a number as currency for El Salvador with $ symbol
 * @param {number|string} amount - The amount to format
 * @returns {string} Formatted currency string with $ symbol
 */
export function formatCurrencySVWithSymbol(amount) {
  return formatCurrencySV(amount, { includeSymbol: true })
}

