import { useEffect, useMemo, useState } from 'react'

import { Menu, MenuProps } from 'antd'
import { useTranslation } from 'react-i18next'

import { useLocation } from '@tanstack/react-router'
import { findActiveKey, renderMenuItems } from '@/utils/system'
import { useMenuCollapseStore, useMenuStore } from '@/stores/system'

type MenuItem = Required<MenuProps>['items'][number]

export default function Sidebar() {
    const { t } = useTranslation()
    const location: Location = useLocation()
    const { collapsed, collapseMenuOpenedKeys, setOpenedKeys, expandMenuOpenedKeys } = useMenuCollapseStore()
    const { menu } = useMenuStore()

    const [selectedKeys, setSelectedKeys] = useState<string[]>([location.pathname])

    const menuItems: MenuItem[] = useMemo(() => renderMenuItems(menu, t), [menu, t])

    const onOpenChange: MenuProps['onOpenChange'] = (keys) => {
        setOpenedKeys(keys)
    }

    useEffect(() => {
        setSelectedKeys(findActiveKey(menu, location.pathname))
    }, [menu, location.pathname, collapsed, t])

    return (
        <div className="rounded-borderRadiusLG dark:border-colorBorder! relative box-border h-[calc(100vh-80px)] dark:border!">
            <Menu
                className="border-0!"
                style={{
                    width: collapsed ? 50 : 240,
                    height: '100%',
                    overflowY: 'auto',
                    borderRadius: '8px',
                    background: 'transparent',
                }}
                inlineCollapsed={collapsed}
                selectedKeys={selectedKeys}
                openKeys={collapsed ? collapseMenuOpenedKeys : expandMenuOpenedKeys}
                defaultSelectedKeys={['/dashboard']}
                onOpenChange={onOpenChange}
                mode="inline"
                items={menuItems}
            />
            {/* <div
                className={`before:bg-colorBorder dark:before:!bg-colorBorder after:bg-colorBorder dark:after:!bg-colorBorder absolute top-1/2 -right-9 z-[50] h-100 w-6 !-translate-y-1/2 cursor-pointer before:absolute before:top-2 before:-left-1 before:h-50 before:w-6 before:rotate-[0] before:transform before:rounded-[3px] before:shadow-xl before:transition-all before:duration-300 before:ease-in-out before:content-[''] after:absolute after:bottom-2 after:-left-1 after:h-50 after:w-6 after:rotate-[0] after:transform after:rounded-[3px] after:shadow-xl after:transition-all after:duration-300 after:ease-in-out after:content-[''] ${
                    collapsed
                        ? 'hover:before:origin-center hover:before:-rotate-[10deg] hover:before:transform hover:before:transition-all hover:before:duration-300 hover:before:ease-in-out hover:after:origin-center hover:after:rotate-[10deg] hover:after:transform hover:after:transition-all hover:after:duration-300 hover:after:ease-in-out'
                        : 'hover:before:origin-center hover:before:rotate-[10deg] hover:before:transform hover:before:transition-all hover:before:duration-300 hover:before:ease-in-out hover:after:origin-center hover:after:-rotate-[10deg] hover:after:transform hover:after:transition-all hover:after:duration-300 hover:after:ease-in-out'
                }`}
                onClick={toggleCollapsed}
            ></div> */}
        </div>
    )
}
