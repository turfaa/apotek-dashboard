const N_GRAM = 3

export default class Document {
    private text: string
    private tokens: string[]
    private termFrequencies: Map<string, number>

    constructor(text: string) {
        this.text = text
        this.tokens = generateTokens(text)
        this.termFrequencies = calculateTermFrequencies(this.tokens)
    }

    getTermFrequency(term: string): number {
        return this.termFrequencies.get(term) ?? 0
    }

    getText(): string {
        return this.text
    }

    getTokenLength(): number {
        return this.tokens.length
    }

    getUniqueTerms(): string[] {
        return Array.from(this.termFrequencies.keys())
    }
}

function generateTokens(text: string): string[] {
    const tokens = []

    const alphanumeric = filterOutNonAlphanumericCharacters(text)
    for (let i = 0; i < alphanumeric.length - N_GRAM + 1; i++) {
        tokens.push(alphanumeric.substring(i, i + N_GRAM))
    }

    return tokens
}

function filterOutNonAlphanumericCharacters(text: string): string {
    return text.replace(/[^a-zA-Z0-9]/g, "")
}

function calculateTermFrequencies(tokens: string[]): Map<string, number> {
    const termFrequencies = new Map()
    tokens.forEach((word) => {
        const freq = termFrequencies.get(word) ?? 0
        termFrequencies.set(word, freq + 1)
    })

    return termFrequencies
}
