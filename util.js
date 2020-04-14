export const def = (obj, key, val, enumerable) => {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true,
  })
}

export const isObject = (obj) => {
  return obj !== null && typeof obj === 'object'
}

export const isValidArrayIndex = (val) => {
  var n = parseFloat(String(val))
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

const hasOwnProperty = Object.prototype.hasOwnProperty
export const hasOwn = (obj, key) => {
  return hasOwnProperty.call(obj, key)
}
