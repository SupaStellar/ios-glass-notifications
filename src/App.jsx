import { MotionConfig, motion, useReducedMotion } from "motion/react"
import { useState } from "react"
import slackMark from "./slack.svg"

const N_NOTIFICATIONS = 3
const NOTIFICATION_HEIGHT = 60
const NOTIFICATION_WIDTH = 360
const NOTIFICATION_GAP = 8

const NOTIFICATIONS = [
  "284 conversations handled today. Only 8 escalations.",
  "Refunds processed. Customer for order #6612 left a 5 star review on Trustpilot.",
  "Everything's handled. Enjoy the movie.",
]

const stackVariants = {
  open: {
    y: 20,
    scale: 0.9,
  },
  closed: {
    y: 0,
    scale: 1,
  },
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Playground />
    </MotionConfig>
  )
}

function Playground() {
  const [isOpen, setIsOpen] = useState(false)
  const reduceMotion = useReducedMotion()
  const skip = Boolean(reduceMotion)

  return (
    <main className="stage" onClick={() => setIsOpen((open) => !open)}>
      <motion.div
        className="stack"
        variants={stackVariants}
        initial={false}
        animate={isOpen ? "open" : "closed"}
        transition={skip ? { duration: 0 } : { type: "spring", mass: 0.7 }}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-label={
          isOpen ? "Collapse notification stack" : "Expand notification stack"
        }
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            event.stopPropagation()
            setIsOpen((open) => !open)
          }
        }}
        onClick={(event) => {
          event.stopPropagation()
          setIsOpen((open) => !open)
        }}
      >
        {NOTIFICATIONS.map((body, index) => (
          <Notification key={body} index={index} body={body} skip={skip} />
        ))}
      </motion.div>
    </main>
  )
}

function Notification({ index, body, skip }) {
  const variants = {
    open: {
      y: 0,
      scale: 1,
      opacity: 1,
    },
    closed: {
      y:
        -index * (NOTIFICATION_HEIGHT + NOTIFICATION_GAP) -
        NOTIFICATION_GAP * index,
      scale: 1 - index * 0.1,
      opacity: 1 - index * 0.4,
    },
  }

  return (
    <motion.article
      className="banner"
      variants={variants}
      transition={
        skip
          ? { duration: 0 }
          : {
              type: "spring",
              stiffness: 600,
              damping: 50,
              delay: index * 0.04,
            }
      }
      style={{
        zIndex: N_NOTIFICATIONS - index,
        height: NOTIFICATION_HEIGHT,
        width: NOTIFICATION_WIDTH,
      }}
    >
      <img className="icon" src={slackMark} width={32} height={32} alt="" />
      <div className="copy">
        <div className="row">
          <h2 className="title">Summary</h2>
          <time className="time">now</time>
        </div>
        <p className="body">{body}</p>
      </div>
    </motion.article>
  )
}
