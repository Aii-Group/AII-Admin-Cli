import React, { useEffect } from 'react'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'
import FullMode from './FullMode'
import { useFullscreenStore } from '@/stores/system'

const Layouts: React.FC = () => {
  const handle = useFullScreenHandle()
  const { fullscreen, setFullscreen } = useFullscreenStore()

  useEffect(() => {
    if (fullscreen) {
      handle.enter()
    } else {
      handle.exit()
    }
  }, [fullscreen])
  return (
    <FullScreen handle={handle} onChange={setFullscreen}>
      <FullMode />
    </FullScreen>
  )
}
export default Layouts
