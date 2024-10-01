import Document from "./document"

const SIMILARITY_THRESHOLDS = [0.75, 0.5, 0.25, 0.125, 0.0625]

export default class Corpus {
    documentById: Map<string, Document>

    constructor(textIds: string[], texts: string[]) {
        this.documentById = new Map(
            texts.map((text, index) => [textIds[index], new Document(text)]),
        )
    }

    getResultsForQuery(query: string): [string, [number, number]][] {
        const queryDocument = new Document(query)

        const results: [string, [number, number]][] = []
        for (const [id, document] of this.documentById) {
            let score = 0
            let firstTermPosition = 99999

            for (const term of queryDocument.getUniqueTerms()) {
                if (document.getTermFrequency(term) > 0) {
                    score += 1
                }

                const position = document.getTermFirstPosition(term)
                if (firstTermPosition === 99999) {
                    firstTermPosition = position
                }
            }

            score /= queryDocument.getTokenLength()
            results.push([id, [score, firstTermPosition]])
        }

        const filteredResults = SIMILARITY_THRESHOLDS.reduce(
            (acc, threshold) => {
                if (acc.length === 0) {
                    return results.filter(([, [score]]) => score >= threshold)
                } else {
                    return acc
                }
            },
            [] as [string, [number, number]][],
        )

        return filteredResults.sort(([, [score1, firstTermPosition1]], [, [score2, firstTermPosition2]]) => {
            if (firstTermPosition1 !== firstTermPosition2) {
                return firstTermPosition1 - firstTermPosition2
            }

            return score2 - score1
        })
    }
}
