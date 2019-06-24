export interface TeamValueI {
    getName(): string
    getValue(): number
    getRank(): number
    setName(name: string): void
    setValue(value: number): void
    setRank(rank: number): void
}

export interface TeamValueObject {
    name: string
    value: number
    rank?: number
}