import React from 'react'

type UptimeProps = {
  time?: number
}

export function Uptime({ time = 0 }: UptimeProps) {
  // get total seconds between the times
  var delta = time || 0 / 1000

  // calculate (and subtract) whole days
  var days = Math.floor(delta / 86400)
  delta -= days * 86400

  // calculate (and subtract) whole hours
  var hours = Math.floor(delta / 3600) % 24
  delta -= hours * 3600

  // calculate (and subtract) whole minutes
  var minutes = Math.floor(delta / 60) % 60
  delta -= minutes * 60

  return <div>{`${days}d ${hours}h ${minutes}m`}</div>
}
