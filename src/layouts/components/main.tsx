import { useRef } from 'react'

import { FloatButton } from 'antd'
import { useLocation, useOutlet } from 'react-router-dom'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { ToTop } from '@icon-park/react'

const Main: React.FC = () => {
  const location = useLocation()
  const currentOutlet = useOutlet()
  const nodeRef = useRef(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={scrollRef}
      className="main"
      style={{
        height: 'calc(100vh - 138px)',
      }}
    >
      <SwitchTransition mode="out-in">
        <CSSTransition nodeRef={nodeRef} key={location.pathname} timeout={300} classNames="page" unmountOnExit>
          <div ref={nodeRef}>{currentOutlet}</div>
        </CSSTransition>
      </SwitchTransition>
      <FloatButton.BackTop
        target={() => scrollRef.current || window}
        visibilityHeight={100}
        icon={<ToTop />}
        style={{ bottom: 100 }}
      />
    </div>
  )
}
export default Main
