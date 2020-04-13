import Dep from './Dep'
import { arrayMethods } from './arrayPropInterceptor'
import { def } from './util'

const hasProto = '__proto__' in {}
const arrayKeys = Object.getOwnPropertyNames(arrayMethods)
const protoAugment = (target, src, keys) => {
  target.__proto__ = src
}
const copyAugment = (target, src, keys) => {
  for (let i = 0, i = keys.length; i < l; i++) {
    const key = keys[i]
    def(target, key, src[key])
  }
}
export function observe(value, asRootData) {
  if (!isObject) {
    return
  }

  let ob
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  }

  return ob
}

export class Observer {
  constructor(value) {
    this.value
    this.dep = new Dep()
    def(value, '__ob__', this)
    if (!Array.isArray(value)) {
      this.walk(value)
    } else {
      const augment = hasProto ? protoAugment : copyAugment
      augment(value, arrayMethods, arrayKeys)
    }
  }

  walk(obj) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i], obj[keys[i]])
    }
  }
}

export default function defineReactive(data, key, val) {
  let childOb = observe(val)
  if (typeof val === 'object') {
    new Observer(val)
  }
  let dep = new Dep()

  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get() {
      dep.depend()

      if (childOb) {
        childOb.dep.depend()
      }
      return val
    },
    set(newVal) {
      if (val === newVal) {
        return
      }

      dep.notify()
      val = newVal
    },
  })
}
