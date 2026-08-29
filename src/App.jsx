import { MotionConfig, motion, useReducedMotion } from "motion/react"
import { useState } from "react"
import { SlackMark } from "./SlackMark.jsx"

const N_NOTIFICATIONS = 3
const NOTIFICATION_HEIGHT = 68
const NOTIFICATION_WIDTH = 336
const NOTIFICATION_GAP = 8
const Y_TUCK = 10

const SPRING = {
  type: "spring",
  visualDuration: 0.4,
  bounce: 0.15,
}

const NOTIFICATIONS = [
  {
    title: "Summary",
    time: "now",
    body: "Everything's handled. Enjoy the movie.",
  },
  {
    title: "#design",
    time: "2m",
    body: "Latest glass banners are in the thread.",
  },
  {
    title: "Jarvis",
    time: "12m",
    body: "Calendar is clear after 9. You're good.",
  },
]

const stackVariants = {
  open: {},
  closed: {},
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
    <main
      className="stage"
      onClick={() => setIsOpen((open) => !open)}
    >
      <div className="cinema" aria-hidden="true" />
      <motion.div
        className="stack"
        variants={stackVariants}
        initial={false}
        animate={isOpen ? "open" : "closed"}
        transition={skip ? { duration: 0 } : SPRING}
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
        {NOTIFICATIONS.map((notification, index) => (
          <Notification
            key={notification.title}
            index={index}
            notification={notification}
            skip={skip}
          />
        ))}
      </motion.div>
    </main>
  )
}

function Notification({ index, notification, skip }) {
  const variants = {
    open: {
      y: 0,
      scale: 1,
    },
    closed: {
      y: -index * (NOTIFICATION_HEIGHT + NOTIFICATION_GAP) + Y_TUCK * index,
      scale: 1 - index * 0.04,
    },
  }

  return (
    <motion.article
      className="banner"
      variants={variants}
      transition={skip ? { duration: 0 } : SPRING}
      style={{
        zIndex: N_NOTIFICATIONS - index,
        height: NOTIFICATION_HEIGHT,
        width: NOTIFICATION_WIDTH,
      }}
    >
      <span className="icon">
        <SlackMark />
      </span>
      <div className="copy">
        <div className="row">
          <h2 className="title">{notification.title}</h2>
          <time className="time">{notification.time}</time>
        </div>
        <p className="body">{notification.body}</p>
      </div>
    </motion.article>
  )
}
