type TupleToUnion<T extends any[]> = T[number]
// here be dragons!
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
    ? I
    : never
// multiple candidates for the same type variable in contra-variant positions,
// e.g., function arguments, causes an intersection type to be inferred
// but bare type parameters before extends in a conditional type are distributed
// across any union constituents, so we need to pack it into a function

type Prettier<T> = T extends infer U ? { [K in keyof U]: U[K] } : never

export type SomeLongNameType = Prettier<UnionToIntersection<{ a: 1 } | { b: 2 }>>

type Methods<T> = Record<string, (this: T, ...args: any[]) => any>[]

export function CakeFactory<T extends Record<string, any>, R extends Methods<T>>(
    data: T,
    ...fns: R
): Prettier<T & UnionToIntersection<TupleToUnion<R>>> {
    const res = Object.assign(data)
    fns.forEach(fn => Object.entries(fn).forEach(([key, func]) => (res[key] = func)))
    return res
}

const batman = CakeFactory(
    {
        name: 'Batman',
        secertId: 'Bruce Wayne'
    },
    {
        fly() {
            console.log('Bat Wings!')
        },
        isRich() {
            return true
        }
    },
    {
        why(_question: string) {
            console.log(`Beacuse I'm ${this.name}`)
        }
    }
)

batman.why('test')
console.log(`is Batman rich? ${batman.isRich() ? 'sure' : 'no'}`)
