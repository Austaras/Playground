import { Reducer } from './utils'

// primary
export const map = <T, R>(f: (val: T, ind: number) => R) => <S>(reducer: Reducer<R, S>) => (
    acc: S,
    val: T,
    ind: number
) => reducer(acc, f(val, ind), ind)

interface Filter {
    <T>(p: (v: T, i: number) => boolean): <R>(r: Reducer<T, R>) => Reducer<T, R>
    <T, S extends T>(p: (v: T, i: number) => v is S): <R>(reducer: Reducer<T, R>) => Reducer<S, R>
}
export const filter: Filter = <T>(predicate: (val: T, ind: number) => boolean) => <S>(
    reducer: Reducer<T, S>
) => (acc: S, val: T, ind: number) => (predicate(val, ind) ? reducer(acc, val, ind) : acc)

// secondary
export const mapTo = <T, R>(value: R) => map((_: T) => value)
export const take = <T>(num: number) => <S>(reducer: Reducer<T, S>) => {
    let count = 0
    return (acc: S, val: T, ind: number) => (count++ >= num ? acc : reducer(acc, val, ind))
}
export const tap = <T>(action: (val: T, ind: number) => void) => <S>(reducer: Reducer<T, S>) => (
    acc: S,
    val: T,
    ind: number
) => {
    action(val, ind)
    return reducer(acc, val, ind)
}
