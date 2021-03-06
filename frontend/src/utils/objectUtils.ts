export function flatten(data, prefix) {
  var result = {}
  function recurse(cur, prop) {
    if (Object(cur) !== cur) {
      result[prop] = String(cur)
    } else if (Array.isArray(cur)) {
      for (var i = 0, l = cur.length; i < l; i++) recurse(cur[i], prop + '[' + i + ']')
      if (l === 0) result[prop] = ''
    } else {
      var isEmpty = true
      for (var p in cur) {
        isEmpty = false
        recurse(cur[p], prop ? prop + '.' + p : p)
      }
      if (isEmpty && prop) result[prop] = ''
    }
  }
  recurse(data, prefix)
  return result
}

export const anyEnd = (value: string, ...endsWith: string[]) =>
  endsWith.reduce((prev, current) => value.endsWith(current) || prev, false)

export const isPrimitive = (value: string) => anyEnd(value.toLowerCase(), 'int', 'long', 'boolean', 'string', 'double', 'float')
