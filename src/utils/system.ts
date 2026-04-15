import React from 'react'

import { MenuProps } from 'antd'
import { TFunction } from 'i18next'

import SvgIcon from '@/components/SvgIcon'
import { isMicroAppEnv } from '@/utils/micro'
import { isLink } from '@/utils/utils'
import { languageEnums } from '@/enums'
import { Link, type LinkProps } from '@tanstack/react-router'
import { useFullscreenStore, useMenuCollapseStore, useMenuStore, useTabStore, useUserStore } from '@/stores/system'

type MenuItem = Required<MenuProps>['items'][number]

/** 退出登录后重置用户态与布局态（含微前端环境的数据清理）。 */
export const resetLogout = () => {
    useUserStore.getState().setUserInfo({
        userId: '',
        userName: '',
        token: '',
        permissions: [],
    })
    useTabStore.getState().setTabs([])
    useMenuStore.getState().setMenu([])
    useMenuCollapseStore.getState().setOpenedKeys([])
    useFullscreenStore.getState().setFullscreen(false)
    if (isMicroAppEnv) {
        window.microApp.clearData()
        window.microApp.clearGlobalData()
        window.microApp.clearDataListener()
        window.microApp.clearGlobalDataListener()
    }
}

/** 外链内嵌页路径（与 `routes/iframe/$name` 一致，用于菜单高亮与 Link） */
export const externalEmbedMenuPath = (menuKey: string) => `/iframe/${menuKey}` as const

/** 仅允许 http(s)，避免 javascript: 等注入进 iframe */
export const isHttpOrHttpsUrl = (value: string): boolean => {
    try {
        const u = new URL(value)
        return u.protocol === 'http:' || u.protocol === 'https:'
    } catch {
        return false
    }
}

/**
 * 菜单点击的“实际路由”解析：
 * - 对可安全内嵌的 http(s) 外链，统一走 iframe 承载页（便于菜单高亮、Tab 体系与权限路由一致）
 * - 其余情况保持原 `path`
 */
export const resolveMenuItemPath = (item: System.MenuOptions): string => {
    const { path, link, key } = item
    if (link && isLink(link) && isHttpOrHttpsUrl(link)) {
        return externalEmbedMenuPath(key)
    }
    return path
}

/** 将后端/配置的菜单树转换为 antd `Menu` 所需的 `items` 结构（含 i18n 与图标）。 */
export const renderMenuItems = (menuList: System.MenuOptions[], t: TFunction): MenuItem[] => {
    return menuList.map((item) => {
        const { key, path, icon, children, link } = item

        if (children && children.length > 0) {
            return {
                key,
                label: t(`Menu.${key}`),
                icon: icon ? React.createElement(SvgIcon, { icon }) : null,
                children: renderMenuItems(children, t),
            }
        }

        const useEmbed = Boolean(link && isLink(link) && isHttpOrHttpsUrl(link))

        return {
            key,
            label: useEmbed
                ? React.createElement(
                      Link,
                      {
                          to: '/iframe/$name',
                          params: { name: key },
                          search: { url: link },
                      } satisfies LinkProps,
                      t(`Menu.${key}`),
                  )
                : link && isLink(link)
                  ? // 非 http(s) 外链：新窗口打开，避免错误地当作内部路由
                    React.createElement(
                        'a',
                        { href: link, target: '_blank', rel: 'noreferrer noopener' },
                        t(`Menu.${key}`),
                    )
                  : React.createElement(Link, { to: path } satisfies LinkProps, t(`Menu.${key}`)),
            icon: icon ? React.createElement(SvgIcon, { icon }) : null,
            path: resolveMenuItemPath(item),
        }
    })
}

/**
 * 根据当前路由 path 在菜单树中查找命中的菜单 key（用于高亮/展开）。
 * 返回值为命中的 key 列表（可能包含多个，取决于菜单配置）。
 */
export const findActiveKey = (menuList: System.MenuOptions[], path: string): string[] => {
    const activeKey: string[] = []
    const loop = (items: System.MenuOptions[]) => {
        for (const item of items) {
            if (resolveMenuItemPath(item) === path) {
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

/** 获取浏览器语言并映射到系统语言枚举（仅区分中文/英文）。 */
export const getBrowserLang = () => {
    const browserLang = navigator.language ? navigator.language : navigator.browserLanguage
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

/** 是否允许启用过渡动效：需要支持 View Transitions 且用户未开启“减少动态效果”。 */
export const enableTransitions = () =>
    'startViewTransition' in document && window.matchMedia('(prefers-reduced-motion: no-preference)').matches
