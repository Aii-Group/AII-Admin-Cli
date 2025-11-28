import React, { useEffect, useMemo, useState } from 'react'

import { Menu, MenuProps } from 'antd'
import { useTranslation } from 'react-i18next'

import { useLocation } from '@tanstack/react-router'
import { findActiveKey, renderMenuItems } from '@/utils/system'
import { useMenuCollapseStore, useMenuStore } from '@/stores/system'

type MenuItem = Required<MenuProps>['items'][number]

const Sidebar: React.FC = () => {
    const { t, i18n } = useTranslation()
    const location: Location = useLocation()
    const { collapsed, collapseMenuOpenedKeys, setOpenedKeys, expandMenuOpenedKeys, toggleCollapsed } =
        useMenuCollapseStore()
    const { menu } = useMenuStore()
    const [selectedKeys, setSelectedKeys] = useState<string[]>([location.pathname])
    const menuItems: MenuItem[] = useMemo(() => renderMenuItems(menu, t), [menu, i18n.language])

    const onOpenChange: MenuProps['onOpenChange'] = (keys) => {
        setOpenedKeys(keys)
    }

    useEffect(() => {
        setSelectedKeys(findActiveKey(menu, location.pathname))
    }, [menu, location.pathname, collapsed])

    return (
        <div className="relative h-[calc(100vh-80px)] box-border rounded-borderRadiusLG dark:!border dark:!border-dark-colorBorder">
            <Menu
                className="!border-0"
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
                className={`absolute w-6 h-100 top-1/2 -right-9 !-translate-y-1/2 cursor-pointer z-[50] before:content-[''] before:absolute before:-left-1 before:w-6 before:h-50 before:rounded-[3px] before:bg-light-colorBorder dark:before:!bg-dark-colorBorder before:shadow-xl before:transform before:rotate-[0] before:transition-all before:duration-300 before:ease-in-out before:top-2 after:content-[''] after:absolute after:-left-1 after:w-6 after:h-50 after:rounded-[3px] after:bg-light-colorBorder dark:after:!bg-dark-colorBorder after:shadow-xl after:transform after:rotate-[0] after:transition-all after:duration-300 after:ease-in-out after:bottom-2 ${
                    collapsed
                        ? 'hover:after:transform hover:after:rotate-[10deg] hover:after:origin-center hover:after:transition-all hover:after:duration-300 hover:after:ease-in-out hover:before:transform hover:before:-rotate-[10deg] hover:before:origin-center hover:before:transition-all hover:before:duration-300 hover:before:ease-in-out'
                        : 'hover:before:transform hover:before:rotate-[10deg] hover:before:origin-center hover:before:transition-all hover:before:duration-300 hover:before:ease-in-out hover:after:transform hover:after:-rotate-[10deg] hover:after:origin-center hover:after:transition-all hover:after:duration-300 hover:after:ease-in-out'
                }`}
                onClick={toggleCollapsed}
            ></div> */}
        </div>
    )
}

export default Sidebar
