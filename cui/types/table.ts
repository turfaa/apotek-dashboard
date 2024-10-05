export interface Table {
    header: string[]
    rows: Row[]
}

export interface Row {
    id: string
    columns: string[]
}
