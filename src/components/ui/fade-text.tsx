import type React from 'react'
import clsx from 'clsx'
import { motion } from 'motion/react'

type FadeDirection = 'in' | 'up' | 'down'

interface FadeTextProps {
  text?: string
  className?: string
  direction?: FadeDirection
  staggerDelay?: number
  wordDelay?: number
  delay?: number
  duration?: number
}

export const FadeText: React.FC<FadeTextProps> = ({
  text = '',
  className = '',
  direction = 'in',
  staggerDelay = 0.15,
  wordDelay = 0.1,
  delay = 0,
  duration = 0.45,
}) => {
  // For "in" direction, we animate word by word
  if (direction === 'in') {
    const words = text.split(' ')

    return (
      <motion.span
        className={clsx(className)}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              delayChildren: delay,
              staggerChildren: wordDelay,
            },
          },
        }}
      >
        {words.map((word, i) => (
          <motion.span
            key={`${word}-${i}`}
            variants={{
              hidden: { opacity: 0, filter: 'blur(10px)' },
              visible: {
                opacity: 1,
                filter: 'blur(0px)',
                transition: { duration, ease: 'easeOut' },
              },
            }}
          >
            {word}{' '}
          </motion.span>
        ))}
      </motion.span>
    )
  }

  // For "up" and "down" directions, we animate the entire text
  const animationVariants =
    direction === 'up'
      ? {
          hidden: { opacity: 0, y: 20 },
          show: {
            opacity: 1,
            y: 0,
            transition: {
              type: 'spring' as const,
              stiffness: 100,
              damping: 12,
              duration: 0.8,
            },
          },
        }
      : {
          hidden: { opacity: 0, y: -20 },
          show: {
            opacity: 1,
            y: 0,
            transition: {
              type: 'spring' as const,
              stiffness: 100,
              damping: 12,
              duration: 0.8,
            },
          },
        }

  return (
    <motion.span
      initial="hidden"
      animate="show"
      transition={{ delay: delay || staggerDelay }}
      variants={animationVariants}
    >
      {text}
    </motion.span>
  )
}
