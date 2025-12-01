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
export type RupiahFormat = "indonesian" | "us"

class RupiahFormatter {
    format = (value: number, format: RupiahFormat = "indonesian"): string => {
        const isNegative = value < 0
        const absoluteValue = Math.abs(value)
        
        if (format === "us") {
            return this.formatUS(absoluteValue, isNegative)
        } else {
            return this.formatIndonesian(absoluteValue, isNegative)
        }
    }

    private formatUS = (value: number, isNegative: boolean): string => {
        // US format: Rp1,000,000 (no decimals)
        const integerPart = Math.round(value).toString()
        const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        const formattedValue = `Rp${formattedInteger}`
        return isNegative ? `(${formattedValue})` : formattedValue
    }

    private formatIndonesian = (value: number, isNegative: boolean): string => {
        // Indonesian format: Rp1.000.000,00
        const [integerPart, decimalPart = "00"] = value.toFixed(2).split(".")
        const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        const formattedValue = `Rp${formattedInteger},${decimalPart}`
        return isNegative ? `(${formattedValue})` : formattedValue
    }
}

export const rupiah = new RupiahFormatter()
