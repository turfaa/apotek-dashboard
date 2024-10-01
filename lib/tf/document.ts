const N_GRAM = 3

export interface Token {
    text: string
    index: number
}

export default class Document {
    private text: string
    private tokens: Token[]
    private termFrequencies: Map<string, number>
    private termFirstPositions: Map<string, number>

    constructor(text: string) {
        this.text = text
        this.tokens = generateTokens(text)
        this.termFrequencies = calculateTermFrequencies(this.tokens)
        this.termFirstPositions = calculateTermFirstPositions(this.tokens)
    }

    getTermFrequency(term: string): number {
        return this.termFrequencies.get(term) ?? 0
    }

    getTermFirstPosition(term: string): number {
        return this.termFirstPositions.get(term) ?? 99999
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

function generateTokens(text: string): Token[] {
    const tokens = []

    const alphanumeric = filterOutNonAlphanumericCharacters(text)
    for (let i = 0; i < alphanumeric.length - N_GRAM + 1; i++) {
        tokens.push({
            text: alphanumeric.substring(i, i + N_GRAM),
            index: i,
        })
    }

    return tokens
}

function filterOutNonAlphanumericCharacters(text: string): string {
    return text.replace(/[^a-zA-Z0-9]/g, "")
}

function calculateTermFrequencies(tokens: Token[]): Map<string, number> {
    const termFrequencies = new Map()
    tokens.forEach((token) => {
        const freq = termFrequencies.get(token.text) ?? 0
        termFrequencies.set(token.text, freq + 1)
    })

    return termFrequencies
}

function calculateTermFirstPositions(tokens: Token[]): Map<string, number> {
    const termFirstPositions = new Map()
    tokens.forEach((token) => {
        if (!termFirstPositions.has(token.text) || token.index < termFirstPositions.get(token.text)) {
            termFirstPositions.set(token.text, token.index)
        }
    })
    return termFirstPositions
}
