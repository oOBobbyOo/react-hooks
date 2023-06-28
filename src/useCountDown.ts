import { useMemo, useState } from 'react'
import useLatest from './useLatest'
import useInterval from './useInterval'
import { isDate } from './shared'

export interface Options {
  time?: number | Date
  interval?: number
  format?: (time: number) => {
    days: string
    hours: string
    minutes: string
    seconds: string
    milliseconds: string
  }
  onEnd?: () => void
}

export interface FormattedRes {
  days: string
  hours: string
  minutes: string
  seconds: string
  milliseconds: string
}

const padZero = (time: number, len = 2): string => {
  return `${time}`.length < len ? `0${time}` : `${time}`
}

const parseMs = (milliseconds: number): FormattedRes => {
  return {
    days: padZero(Math.floor(milliseconds / 86400000), 0),
    hours: padZero(Math.floor(milliseconds / 3600000) % 24),
    minutes: padZero(Math.floor(milliseconds / 60000) % 60),
    seconds: padZero(Math.floor(milliseconds / 1000) % 60),
    milliseconds: padZero(Math.floor(milliseconds) % 1000)
  }
}

const calcLeft = (target?: number | Date): number => {
  if (!target) {
    return 0
  }
  if (isDate(target)) {
    const timeDiff = target.getTime() - Date.now()
    return timeDiff <= 0 ? 0 : timeDiff
  } else {
    return target
  }
}

const useCountDown = (options: Options = {}) => {
  const { time, interval = 1000, format = parseMs, onEnd } = options

  const [remainTime, setRemainTime] = useState(() => calcLeft(time))
  const [delay, setDelay] = useState<number | null>(interval)

  const onEndRef = useLatest(onEnd)

  useInterval(() => {
    if (remainTime <= 0) {
      setDelay(null)
      setRemainTime(0)
      onEndRef.current?.()
    } else {
      setRemainTime(remainTime - 1000)
    }
  }, delay)

  const { days, hours, minutes, seconds, milliseconds } = useMemo(
    () => format(remainTime),
    [remainTime]
  )

  return [days, hours, minutes, seconds, milliseconds]
}

export default useCountDown
