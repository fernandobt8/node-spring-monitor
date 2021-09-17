import { useCallback, useEffect, useRef, useState } from 'react'

type HeightOpts = {
  initialRef?: React.MutableRefObject<HTMLElement>
  initialHeight?: number | string
  deps?: React.DependencyList
}

type HeightReturn = [number | string, (node: HTMLElement) => void, () => void]

export default function useHeight(opts?: HeightOpts): HeightReturn {
  const { initialRef, initialHeight, deps } = opts || {}

  const ref = useRef<HTMLElement>(null)
  const [height, setHeight] = useState<number | string>(initialHeight)

  const getElement = useCallback(() => (ref?.current ? ref.current : initialRef?.current), [initialRef])

  const updateHeight = useCallback(() => setHeight(getElement()?.getBoundingClientRect()?.height), [getElement])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(updateHeight, deps)

  return [height, (node: HTMLElement) => (ref.current = node), updateHeight]
}
