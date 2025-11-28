import { useEffect } from 'react'

import { Button } from 'antd'

import { useFullscreenStore } from '@/stores/system'
import { FullScreenOne, OffScreenOne } from '@icon-park/react'

const FullscreenButton: React.FC = () => {
    const { fullscreen, setFullscreen } = useFullscreenStore()

    useEffect(() => {
        const handleFullscreenChange = () => {
            const isFullscreen = !!document.fullscreenElement
            setFullscreen(isFullscreen)
        }

        document.addEventListener('fullscreenchange', handleFullscreenChange)
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
        document.addEventListener('mozfullscreenchange', handleFullscreenChange)
        document.addEventListener('MSFullscreenChange', handleFullscreenChange)

        handleFullscreenChange()

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange)
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
            document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
            document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
        }
    }, [setFullscreen])

    const handleFullscreenToggle = async () => {
        try {
            if (!document.fullscreenElement) {
                await document.documentElement.requestFullscreen()
            } else {
                await document.exitFullscreen()
            }
        } catch (error) {
            console.error('Fullscreen operation failed:', error)
        }
    }

    return (
        <Button type="text" icon={fullscreen ? <OffScreenOne /> : <FullScreenOne />} onClick={handleFullscreenToggle} />
    )
}

export default FullscreenButton
