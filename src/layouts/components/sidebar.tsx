import React, { useEffect, useMemo, useState } from 'react'

import { Menu, MenuProps } from 'antd'
import { useTranslation } from 'react-i18next'
import { Location, useLocation } from 'react-router-dom'

import { findActiveKey, renderMenuItems } from '@/utils/system'
import { useMenuCollapseStore, useMenuStore } from '@/stores/system'

import { getMenu } from '@/api/mock'

type MenuItem = Required<MenuProps>['items'][number]

const Sidebar: React.FC = () => {
  const { t, i18n } = useTranslation()
  const location: Location = useLocation()
  const { collapsed, collapseMenuOpenedKeys, setOpenedKeys, expandMenuOpenedKeys, toggleCollapsed } =
    useMenuCollapseStore()
  const { menu, appendMenu } = useMenuStore()
  const [selectedKeys, setSelectedKeys] = useState<string[]>([location.pathname])
  const menuItems: MenuItem[] = useMemo(() => renderMenuItems(menu, t), [menu, i18n.language])

  const onOpenChange: MenuProps['onOpenChange'] = (keys) => {
    setOpenedKeys(keys)
  }

  const getMenuData = async () => {
    const menuRes = await getMenu()
    if (menuRes.success) {
      appendMenu(menuRes.data ?? [])
    }
  }

  useEffect(() => {
    getMenuData()
  }, [])

  useEffect(() => {
    setSelectedKeys(findActiveKey(menu, location.pathname))
  }, [menu, location.pathname, collapsed])

  return (
    <div className="sidebar-inline">
      <Menu
        className="!border-0"
        style={{
          width: collapsed ? 50 : 240,
          height: '100%',
          overflowY: 'auto',
          borderRadius: '8px',
        }}
        inlineCollapsed={collapsed}
        selectedKeys={selectedKeys}
        openKeys={collapsed ? collapseMenuOpenedKeys : expandMenuOpenedKeys}
        defaultSelectedKeys={['/dashboard']}
        onOpenChange={onOpenChange}
        mode="inline"
        items={menuItems}
      />
      <div
        className={`collapse-btn ${collapsed ? 'collapse-btn-fold' : 'collapse-btn-expand'}`}
        onClick={toggleCollapsed}
      ></div>
    </div>
  )
}

export default Sidebar
