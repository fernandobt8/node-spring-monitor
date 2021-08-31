import { useEffect } from 'react'

export default function useOutsideClickEvent(node: any, onOutsideClick: (e: MouseEvent) => void) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!node?.contains(event.target)) {
        onOutsideClick(event)
      }
    }
    document.addEventListener('click', handleClickOutside)

    return () => document.removeEventListener('click', handleClickOutside)
  }, [node, onOutsideClick])
}
