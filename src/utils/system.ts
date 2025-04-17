import React from 'react'

import { MenuProps } from 'antd'
import { TFunction } from 'i18next'
import { Link } from 'react-router-dom'

import SvgIcon from '@/components/SvgIcon'
import { languageEnums } from '@/enums/languageEnum'
import { useFullscreenStore, useMenuStore, useTabStore, useUserStore } from '@/stores/system'

type MenuItem = Required<MenuProps>['items'][number]

export const resetLogout = () => {
  useUserStore.getState().setUserInfo({
    userId: '',
    userName: '',
    accessToken: '',
  })
  useTabStore.getState().setTabs([])
  useMenuStore.getState().setMenu([
    {
      key: 'Dashboard',
      label: 'Dashboard',
      icon: 'dashboard',
      path: '/dashboard',
      filePath: '/dashboard/index',
    },
  ])
  useFullscreenStore.getState().setFullscreen(false)
}

export const renderMenuItems = (menuList: System.MenuOptions[], t: TFunction): MenuItem[] => {
  return menuList.map((item) => {
    const { key, path, icon, children } = item
    if (children && children.length > 0) {
      return {
        key,
        label: t(`Menu.${key}`),
        icon: icon ? React.createElement(SvgIcon, { icon }) : null,
        children: renderMenuItems(children, t),
      }
    }
    return {
      key,
      label: React.createElement(Link, { to: path }, t(`Menu.${key}`)),
      icon: icon ? React.createElement(SvgIcon, { icon }) : null,
      path,
    }
  })
}

export const findActiveKey = (menuList: System.MenuOptions[], path: string): string[] => {
  const activeKey: string[] = []
  const loop = (items: System.MenuOptions[]) => {
    for (let item of items) {
      if (item.path === path) {
        activeKey.push(item.key)
      }
      if (item.children) {
        loop(item.children)
      }
    }
  }

  loop(menuList)
  return activeKey
}

export const getBrowserLang = () => {
  let browserLang = navigator.language ? navigator.language : navigator.browserLanguage
  let defaultBrowserLang
  if (
    browserLang.toLowerCase() === 'cn' ||
    browserLang.toLowerCase() === 'zh' ||
    browserLang.toLowerCase() === 'zh-cn'
  ) {
    defaultBrowserLang = languageEnums.ZH
  } else {
    defaultBrowserLang = languageEnums.EN
  }
  return defaultBrowserLang
}

export const enableTransitions = () =>
  'startViewTransition' in document && window.matchMedia('(prefers-reduced-motion: no-preference)').matches
