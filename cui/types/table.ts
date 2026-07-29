export interface Table {
    header?: string[]
    rows: Row[]
    /**
     * Summary row rendered below the rows, e.g. the totals of the numeric
     * columns. Absent when the table has no summary.
     */
    footer?: React.ReactNode[]
}

export interface Row {
    id: string
    columns: React.ReactNode[]
}
