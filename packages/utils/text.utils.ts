/**
 * Formats a stringified number with spaces as thousands separators.
 * Examples:
 * - "1234" -> "1 234"
 * - "1234567" -> "1 234 567"
 * - "1234.56" -> "1 234.56"
 */
export function formatNumberWithSpaces(value: string): string {
  if (!value) return value;

  // Remove existing spaces
  const cleanValue = value.replace(/\s/g, '');

  // Split into whole and decimal parts
  const [whole, decimal] = cleanValue.split('.');

  // Format whole part with spaces every 3 digits from the right
  const formattedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  // Combine with decimal if present
  return decimal !== undefined
    ? `${formattedWhole}.${decimal}`
    : formattedWhole;
}
