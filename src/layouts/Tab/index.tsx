import { useEffect, useRef, useState } from 'react'

import clsx from 'clsx'
import { Dropdown, MenuProps } from 'antd'
import { useTranslation } from 'react-i18next'

import { useTabStore } from '@/stores/system'
import { CloseOutlined } from '@ant-design/icons'
import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight, CloseOne, CloseSmall } from '@icon-park/react'

export default function TabBar() {
    const { t } = useTranslation()
    const location: Location = useLocation()
    const { tabs, removeTab, closeAllTabs, closeLeftTabs, closeRightTabs } = useTabStore()
    const navigate = useNavigate()
    const tabBarRef = useRef<HTMLDivElement>(null)
    const activeTabRef = useRef<HTMLDivElement>(null)
    const tabRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
    const [contextMenuTab, setContextMenuTab] = useState<System.Tab | null>(null)
    const [dropdownVisible, setDropdownVisible] = useState(false)

    const handleRemoveTab = (tab: System.Tab) => {
        removeTab(tab)
        if (tabs.length > 0) {
            const currentIndex = tabs.findIndex((t) => t.key === tab.key)
            const lastTab = tabs[currentIndex - 1]

            if (lastTab && tab.path === location.pathname) {
                navigate({ to: lastTab.path, search: { url: lastTab.link ?? undefined } })
            }
        }
    }

    const scrollToTargetTab = (tabRef: HTMLDivElement | null) => {
        if (tabRef && tabBarRef.current) {
            const tabBar = tabBarRef.current
            const tab = tabRef

            const tabBarRect = tabBar.getBoundingClientRect()
            const tabRect = tab.getBoundingClientRect()

            if (tabRect.right > tabBarRect.right || tabRect.left < tabBarRect.left) {
                tab.scrollIntoView({
                    behavior: 'smooth',
                    inline: 'center',
                    block: 'nearest',
                })
            }
        }
    }

    const handleCloseCurrentTab = () => {
        if (contextMenuTab) {
            handleRemoveTab(contextMenuTab)
            setDropdownVisible(false)
        }
    }

    const handleCloseAllTabs = () => {
        closeAllTabs()
        setDropdownVisible(false)
        // 导航到 dashboard
        navigate({ to: '/dashboard' })
    }

    const handleCloseLeftTabs = () => {
        if (contextMenuTab) {
            closeLeftTabs(contextMenuTab)
            // 导航到目标标签页
            navigate({ to: contextMenuTab.path, search: { url: contextMenuTab.link ?? undefined } })
        }
        setDropdownVisible(false)
    }

    const handleCloseRightTabs = () => {
        if (contextMenuTab) {
            closeRightTabs(contextMenuTab)
            // 导航到目标标签页
            navigate({ to: contextMenuTab.path, search: { url: contextMenuTab.link ?? undefined } })
        }
        setDropdownVisible(false)
    }

    useEffect(() => {
        if (activeTabRef.current) {
            scrollToTargetTab(activeTabRef.current)
        }
    }, [location.pathname, tabs, t])

    const dropdownMenu: MenuProps['items'] = [
        {
            key: 'closeCurrent',
            icon: <CloseOne />,
            label: t('Common.Close_Current'),
        },
        {
            key: 'closeLeft',
            icon: <ArrowLeft />,
            label: t('Common.Close_Left'),
        },
        {
            key: 'closeRight',
            icon: <ArrowRight />,
            label: t('Common.Close_Right'),
        },
        {
            key: 'closeAll',
            icon: <CloseSmall />,
            label: t('Common.Close_All'),
        },
    ]

    const handleClickDropdownMenu: MenuProps['onClick'] = ({ key }) => {
        switch (key) {
            case 'closeCurrent':
                handleCloseCurrentTab()
                break
            case 'closeLeft':
                handleCloseLeftTabs()
                break
            case 'closeRight':
                handleCloseRightTabs()
                break
            case 'closeAll':
                handleCloseAllTabs()
                break
            default:
                break
        }
    }

    return (
        <div
            ref={tabBarRef}
            className="rounded-borderRadiusLG bg-colorBgContainer dark:border-colorBorder! mb-2.5 flex h-9 w-full flex-nowrap overflow-x-auto px-1 py-2.5 whitespace-nowrap dark:border!"
        >
            {tabs.map((tab, index) => {
                return (
                    <Dropdown
                        key={tab.key}
                        trigger={['contextMenu']}
                        open={dropdownVisible && contextMenuTab?.key === tab.key}
                        onOpenChange={(open) => {
                            setDropdownVisible(open)
                            if (open) {
                                setContextMenuTab(tab)
                            } else if (contextMenuTab?.key === tab.key) {
                                setContextMenuTab(null)
                            }
                        }}
                        menu={{ items: dropdownMenu, onClick: handleClickDropdownMenu }}
                    >
                        <Link key={index} to={tab.path} search={{ url: tab.link ?? undefined }}>
                            <div
                                ref={(el) => {
                                    if (tab.path === location.pathname) {
                                        activeTabRef.current = el
                                    } else {
                                        tabRefs.current[tab.path] = el
                                    }
                                }}
                                className={clsx(
                                    'rounded-tl-borderRadiusLG rounded-tr-borderRadiusLG relative box-border inline-block h-full w-full shrink-0 cursor-pointer px-4 leading-[40px] whitespace-nowrap transition-all duration-300 ease-in-out',
                                    tab.path === location.pathname
                                        ? "text-colorPrimary border-b-colorPrimary bg-colorPrimaryBg before:bg-colorPrimary after:bg-colorPrimary before:absolute before:bottom-0 before:left-1/2 before:h-2 before:w-[calc(50%)] before:origin-right before:transition-all before:duration-300 before:ease-in-out before:content-[''] after:absolute after:right-1/2 after:bottom-0 after:h-2 after:w-[calc(50%)] after:origin-left after:transition-all after:duration-300 after:ease-in-out after:content-['']"
                                        : "before:absolute before:bottom-0 before:left-1/2 before:h-2 before:w-0 before:bg-transparent before:transition-all before:duration-300 before:ease-in-out before:content-[''] after:absolute after:right-1/2 after:bottom-0 after:h-2 after:w-0 after:bg-transparent after:transition-all after:duration-300 after:ease-in-out after:content-['']",
                                    'hover:text-colorPrimary',
                                )}
                                onContextMenu={(e) => {
                                    e.preventDefault()
                                    setContextMenuTab(tab)
                                    setDropdownVisible(true)
                                }}
                            >
                                <span className="px-10">{t(`Menu.${tab.key}`)}</span>
                                {tab.closeable && (
                                    <CloseOutlined
                                        className="h-0 w-0 origin-center transform transition-all duration-300 ease-in-out hover:h-14 hover:w-14"
                                        onClick={(event) => {
                                            event.preventDefault()
                                            event.stopPropagation()
                                            handleRemoveTab(tab)
                                        }}
                                    />
                                )}
                            </div>
                        </Link>
                    </Dropdown>
                )
            })}
        </div>
    )
}
