import { useEffect, useRef, useState } from 'react'

import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
export interface Tab {
    key: number | string
    label: string
    icon?: React.ReactNode
    content?: React.ReactNode | string
}

export interface AiiTabProps {
    defaultActiveKey: number | string
    tabs: Tab[]
    onTabClick?: (label: string) => void
    simple?: boolean
}

const AiiTab = (props: AiiTabProps) => {
    const { tabs, defaultActiveKey, onTabClick } = props
    const [activeTabKey, setActiveTabKey] = useState(defaultActiveKey || 0)

    const [indicatorPosition, setIndicatorPosition] = useState({ left: 0, width: 0, top: 0 })
    const navRef = useRef<HTMLDivElement>(null)
    const activeTabRef = useRef<HTMLDivElement>(null)

    const handleTabClick = (key: number | string, label: string) => {
        onTabClick?.(label)
        setActiveTabKey(key)
    }

    useEffect(() => {
        if (activeTabRef.current && navRef.current) {
            const { offsetLeft, offsetWidth, offsetTop } = activeTabRef.current
            setIndicatorPosition({ left: offsetLeft, width: offsetWidth, top: offsetTop })
        }
    }, [activeTabKey])

    useEffect(() => {
        if (activeTabRef.current && navRef.current) {
            const { offsetLeft, offsetWidth, offsetTop } = activeTabRef.current
            setIndicatorPosition({ left: offsetLeft, width: offsetWidth, top: offsetTop })
        }
    }, [activeTabKey])

    return (
        <motion.div className="w-full h-full relative">
            <div ref={navRef} className="relative flex items-center gap-10 mb-10">
                {tabs.map((item) => (
                    <div
                        key={item.key}
                        ref={activeTabKey === item.key ? activeTabRef : null}
                        className={clsx(
                            'flex items-center cursor-pointer z-10 h-38 px-16 py-8 rounded-borderRadiusLG relative bg-transparent transition-all duration-300 hover:text-light-colorPrimary dark:hover:text-dark-colorPrimary',
                            {
                                'text-light-colorPrimary dark:text-dark-colorPrimary': activeTabKey === item.key,
                            },
                        )}
                        onClick={() => handleTabClick(item.key, item.label)}
                    >
                        <div className="flex items-center gap-4">
                            {item.icon && <>{item.icon}</>}
                            {item.label}
                        </div>
                    </div>
                ))}
                <motion.div
                    className="absolute z-0 top-0 h-38 rounded-borderRadiusLG bg-light-colorPrimaryBg dark:bg-dark-colorPrimaryBg"
                    layoutId="activeTabIndicator"
                    animate={{
                        left: indicatorPosition.left,
                        top: indicatorPosition.top,
                        width: indicatorPosition.width,
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
            </div>
            <div className="overflow-hidden">
                <AnimatePresence>
                    {tabs.map((item) => (
                        <motion.div
                            key={item.key}
                            variants={{
                                active: { opacity: 1, filter: 'blur(0px)', height: 'auto' },
                                inactive: { opacity: 0, filter: 'blur(4px)', height: 0 },
                            }}
                            initial="inactive"
                            animate={activeTabKey === item.key ? 'active' : 'inactive'}
                            exit="inactive"
                            transition={{ ease: 'easeInOut', duration: 0.3 }}
                            style={{ overflow: 'hidden' }}
                        >
                            {item.content}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </motion.div>
    )
}

export default AiiTab
