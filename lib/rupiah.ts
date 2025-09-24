/**
 * Previously, we use Intl.NumberFormat to format the value.
 * However, somehow, sometimes it fails React hydration
 * because the server and client produces different strings.
 * 
 * So now we implement our own formatter.
 * 
 * Because we implement our own formatter,
 * we can use the (Rp123.456,00) format for negative values.
 */
class RupiahFormatter {
    format(value: number): string {
        const isNegative = value < 0
        const absoluteValue = Math.abs(value)
        
        // Convert to string and split by decimal point
        const [integerPart, decimalPart = "00"] = absoluteValue.toFixed(2).split(".")
        
        // Add thousand separators to integer part
        const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        
        // Format based on whether value is negative
        const formattedValue = `Rp${formattedInteger},${decimalPart}`
        
        return isNegative ? `(${formattedValue})` : formattedValue
    }
}

export const rupiah = new RupiahFormatter()
