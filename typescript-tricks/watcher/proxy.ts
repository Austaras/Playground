import { watcherFunc, hasKey, isObj } from './shared'

type Action = 'add' | 'set' | 'get' | 'delete'

export function trap<T extends Record<string, any>>(
    object: T, watcher: typeof watcherFunc, key = 'base'
) {
    for (const i in object) {
        if (typeof object[i] === 'object') {
            object[i] = trap(object[i], watcher, i)
        }
    }
    const handler: ProxyHandler<T> = {
        set(obj: T, prop: string, value: any) {
            const action: Action = hasKey(obj, prop) ? 'set' : 'add'
            watcher(action, key, prop, value)
            if (isObj(value)) {
                obj[prop] = trap(value, watcher, prop)
            } else {
                obj[prop] = value
            }
            return value
        },
        deleteProperty(obj: any, prop: string) {
            if (prop in obj) {
                watcher('delete', key, prop, undefined)
                delete obj[prop]
            }
            return true
        }
    }
    return new Proxy(object, handler)
}
