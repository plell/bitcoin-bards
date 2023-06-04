type Note = {
    id: number
    step: number
}

type Pattern = {
    stepCount: number
    notes: Note[]
}

export const pattern: Pattern = {
    stepCount: 10,
    notes: [
        {
            id: 1,
            step: 1,
            
        },
        {
            id: 2,
            step: 2,
            
        },
        {
            id: 3,
            step: 7,
            
        },
        {
            id: 4,
            step: 9,
        }
    ]
}