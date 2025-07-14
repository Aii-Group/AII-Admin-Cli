import { useRef } from 'react'

import { FloatButton } from 'antd'
import { AnimatePresence } from 'framer-motion'

import { ToTop } from '@icon-park/react'
import { useLocation } from '@tanstack/react-router'

import AnimatedOutlet from './outlet'

const Main: React.FC = () => {
  const { pathname } = useLocation()
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={scrollRef} className="main">
      <AnimatePresence mode="wait">
        <AnimatedOutlet key={pathname} />
      </AnimatePresence>
      <FloatButton.BackTop
        shape="square"
        target={() => scrollRef.current || window}
        visibilityHeight={100}
        icon={<ToTop className="!animate-bounce" />}
        style={{ bottom: 100 }}
      />
    </div>
  )
}
export default Main
