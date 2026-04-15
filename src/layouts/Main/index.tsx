import { useRef } from 'react'

import { FloatButton } from 'antd'

import { ToTop } from '@icon-park/react'

import AnimatedOutlet from './outlet'

export default function Main() {
    const scrollRef = useRef<HTMLDivElement>(null)

    return (
        <div ref={scrollRef} className="box-border h-[calc(100vh-80px)] overflow-auto">
            <AnimatedOutlet />
            <FloatButton.BackTop
                shape="square"
                target={() => scrollRef.current || window}
                visibilityHeight={100}
                icon={<ToTop className="animate-bounce!" />}
                style={{ bottom: 100 }}
            />
        </div>
    )
}
