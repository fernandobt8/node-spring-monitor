/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-extend-native */
// @ts-ignore

interface Number {
  fixed(fixed: number): number
}

Number.prototype.fixed = function (fixed: number) {
  return Number(Number(this).toFixed(fixed))
}

interface Array<T> {
  delete(value: T): boolean
  delete(search: (value: T) => boolean): boolean
}

Array.prototype.delete = function <T>(value: T) {
  let item = value
  if (value instanceof Function) {
    item = this.find(value)
  }
  const index = this.indexOf(item)
  if (index !== -1) {
    this.splice(index, 1)
    return true
  }
  return false
}
