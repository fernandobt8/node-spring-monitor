import { useEffect } from 'react'

export default function useOutsideClickEvent(node: any, onOutsideClick: (e: MouseEvent) => void) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!node?.contains(event.target)) {
        onOutsideClick(event)
      }
    }
    document.getElementById('root').addEventListener('click', handleClickOutside, { capture: true })

    return () => document.getElementById('root').removeEventListener('click', handleClickOutside, { capture: true })
  }, [node, onOutsideClick])
}
