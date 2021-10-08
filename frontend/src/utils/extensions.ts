/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-extend-native */
// @ts-ignore

interface Number {
  fixed(fixed: number): number
}

Number.prototype.fixed = function (fixed: number) {
  return Number(Number(this).toFixed(fixed))
}
