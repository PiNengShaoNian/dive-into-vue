import Dep from './Dep'
import { arrayMethods } from './arrayPropInterceptor'
import { def, isObject, isValidArrayIndex, hasOwn } from './util'

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
  if (!isObject(value)) {
    return
  }

  let ob
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else {
    ob = new Observer(value)
  }

  return ob
}

export class Observer {
  constructor(value) {
    this.value = value
    this.dep = new Dep()
    def(value, '__ob__', this)
    if (!Array.isArray(value)) {
      this.walk(value)
    } else {
      const augment = hasProto ? protoAugment : copyAugment
      augment(value, arrayMethods, arrayKeys)
      this.observerArray(value)
    }
  }

  observerArray(items) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
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

export function set(target, key, val) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key)
    target.splice(key, 1, val)
    return val
  }

  if (key in target && key in Object.prototype) {
    target[key] = val
    return val
  }

  const ob = target.__ob__

  if (target._isVue(ob && ob.vmCount)) {
    throw new Error(
      'Avoid adding reactive properties to a Vue instance or its root $data at runtime - declare it upfront in the data option'
    )
  }

  if (!ob) {
    target[key] = val
    return val
  }

  defineReactive(ob.value, key, value)
  ob.dep.notify()
  return val
}

export function del(target, key) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1)

    return
  }
  const ob = target.__ob__

  if (target._isVue || (ob && ob.vmCount)) {
    throw new Error(
      'Avoid deleting properties on a Vue instance or its root $data - just set it to null'
    )
  }

  if (!hasOwn(target, key)) {
    return
  }
  delete target[key]
  if (!ob) return
  ob.dep.notify()
}
