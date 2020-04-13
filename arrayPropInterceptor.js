import { def } from './util'

const arrayProp = Array.prototype

export const arrayMethods = Object.create(arrayProp)
;[('push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse')].forEach(
  (method) => {
    const original = arrayProp[method]

    def(arrayMethods, method, (...args) => {
      const ob = this.__ob__
      const result = original.apply(this, args)
      ob.dep.notify()
      return result
    })
  }
)
