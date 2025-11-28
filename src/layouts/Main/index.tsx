import { useRef } from 'react'

import { FloatButton } from 'antd'

import { ToTop } from '@icon-park/react'

import AnimatedOutlet from '../Main/outlet'

const Main: React.FC = () => {
    const scrollRef = useRef<HTMLDivElement>(null)

    return (
        <div ref={scrollRef} className="overflow-auto box-border h-[calc(100vh-80px)]">
            <AnimatedOutlet />
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
