import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'
import { useEffect, useMemo } from 'react'
import { numberFormatter } from '../lib/format'

interface Props {
  value: number
  decimals?: number
  suffix?: string
  className?: string
}

/** Counts smoothly from the previous value to the new one. */
export function AnimatedNumber({ value, decimals = 0, suffix = '', className }: Props) {
  const reduceMotion = useReducedMotion()
  const motionValue = useMotionValue(reduceMotion ? value : 0)
  const formatter = useMemo(() => numberFormatter(decimals), [decimals])
  const text = useTransform(motionValue, (current) => `${formatter.format(current)}${suffix}`)

  useEffect(() => {
    if (reduceMotion) {
      motionValue.set(value)
      return
    }
    const controls = animate(motionValue, value, { duration: 0.9, ease: [0.16, 1, 0.3, 1] })
    return () => controls.stop()
  }, [value, reduceMotion, motionValue])

  return <motion.span className={className}>{text}</motion.span>
}
