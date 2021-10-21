import { AxiosPromise, AxiosResponse } from 'axios'
import moment from 'moment'
import { useEffect, useRef, useState } from 'react'

export function useActivesInterval(promises: () => AxiosPromise[], response: (responses: AxiosResponse[]) => any) {
  const [actives, setActives] = useState<any[]>([])
  const requesting = useRef(false)

  useEffect(() => {
    const timer = setInterval(() => {
      if (requesting.current) {
        return
      }
      requesting.current = true
      Promise.all(promises())
        .then(responses => {
          setActives(oldActives => {
            if (oldActives.length >= 100) {
              oldActives.shift()
            }
            return [
              ...oldActives,
              {
                time: moment(moment.now()).format('HH:mm:ss'),
                ...response(responses),
              },
            ]
          })
        })
        .catch(({ data }) => {
          console.log('erro')
        })
        .finally(() => (requesting.current = false))
    }, 3 * 1000)
    return () => clearTimeout(timer)
  }, [promises, response])

  return actives
}
