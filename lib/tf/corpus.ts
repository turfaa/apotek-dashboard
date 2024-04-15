import Document from "./document"

const SIMILARITY_THRESHOLDS = [0.75, 0.5, 0.25, 0.125, 0.0625]

export default class Corpus {
    documentById: Map<string, Document>

    constructor(textIds: string[], texts: string[]) {
        this.documentById = new Map(
            texts.map((text, index) => [textIds[index], new Document(text)]),
        )
    }

    getResultsForQuery(query: string): [string, number][] {
        const queryDocument = new Document(query)

        const results: [string, number][] = []
        for (const [id, document] of this.documentById) {
            let score = 0

            for (const term of queryDocument.getUniqueTerms()) {
                score += document.getTermFrequency(term)
            }

            score /= queryDocument.getTokenLength()
            results.push([id, score])
        }

        const filteredResults = SIMILARITY_THRESHOLDS.reduce(
            (acc, threshold) => {
                if (acc.length === 0) {
                    return results.filter(([, score]) => score >= threshold)
                } else {
                    return acc
                }
            },
            [] as [string, number][],
        )

        return filteredResults.sort((a, b) => b[1] - a[1])
    }
}
