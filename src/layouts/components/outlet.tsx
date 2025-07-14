import { forwardRef, useContext, useRef } from 'react'

import { cloneDeep } from 'lodash-es'
import { motion, useIsPresent } from 'framer-motion'

import { getRouterContext, Outlet } from '@tanstack/react-router'

const AnimatedOutlet = forwardRef<HTMLDivElement>((_, ref) => {
  const RouterContext = getRouterContext()

  const routerContext = useContext(RouterContext)

  const renderedContext = useRef(routerContext)

  const isPresent = useIsPresent()

  if (isPresent) {
    renderedContext.current = cloneDeep(routerContext)
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 1.2, filter: 'blur(1px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 0.8, filter: 'blur(1px)' }}
      transition={{
        duration: 0.3,
        ease: 'easeInOut',
      }}
    >
      <RouterContext.Provider value={renderedContext.current}>
        <Outlet />
      </RouterContext.Provider>
    </motion.div>
  )
})

export default AnimatedOutlet
