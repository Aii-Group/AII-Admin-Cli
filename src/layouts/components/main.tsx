import { useRef } from 'react'

import { FloatButton } from 'antd'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { ToTop } from '@icon-park/react'
import { Outlet, useLocation } from '@tanstack/react-router'

const Main: React.FC = () => {
  const { pathname } = useLocation()
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
        <CSSTransition nodeRef={nodeRef} key={pathname} timeout={300} classNames="page" unmountOnExit>
          <div ref={nodeRef}>
            <Outlet />
          </div>
        </CSSTransition>
      </SwitchTransition>
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
