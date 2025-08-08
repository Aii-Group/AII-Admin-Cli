import { create } from 'zustand'

import { ThemeEnum } from '@/enums/themeEnum'
import { createJSONStorage, persist } from 'zustand/middleware'

const storagePrefix = `[${import.meta.env.VITE_TITLE || 'AII'}]`

export const useUserStore = create<System.UserState>()(
    persist(
        (set) => ({
            userInfo: {
                userId: '',
                userName: '',
                token: '',
                permissions: [],
            },
            setUserInfo: (userInfo: System.UserInfo) => set({ userInfo }),
        }),
        {
            name: `${storagePrefix}-user-storage`,
            storage: createJSONStorage(() => localStorage),
        },
    ),
)

export const useMenuStore = create<System.MenuState>()(
    persist(
        (set) => ({
            menu: [
                // {
                //   key: 'Dashboard',
                //   label: 'Dashboard',
                //   icon: 'dashboard',
                //   path: '/dashboard',
                //   filePath: '/dashboard/index',
                // },
            ],
            setMenu: (menu: System.MenuOptions[]) => set({ menu }),
            appendMenu: (menu: System.MenuOptions[]) =>
                set((state) => {
                    const newMenuItems = menu.filter(
                        (newItem) => !state.menu.some((existingItem) => existingItem.key === newItem.key),
                    )
                    return { menu: [...state.menu, ...newMenuItems] }
                }),
        }),
        {
            name: `${storagePrefix}-menu-storage`,
            storage: createJSONStorage(() => localStorage),
        },
    ),
)

export const useMenuCollapseStore = create<System.CollapseState>()(
    persist(
        (set) => ({
            collapsed: false,
            collapseMenuOpenedKeys: [],
            expandMenuOpenedKeys: [],
            toggleCollapsed: () => set((state) => ({ collapsed: !state.collapsed })),
            setOpenedKeys: (openedKeys: string[]) =>
                set((state) => ({
                    ...(state.collapsed
                        ? { collapseMenuOpenedKeys: openedKeys }
                        : { expandMenuOpenedKeys: openedKeys }),
                })),
        }),
        {
            name: `${storagePrefix}-collapse-storage`,
            storage: createJSONStorage(() => localStorage),
        },
    ),
)

export const useThemeStore = create<System.ThemeState>()(
    persist(
        (set) => ({
            theme: 'light',
            color: {
                colorPrimary: ThemeEnum.colorPrimary,
                colorSuccess: ThemeEnum.colorSuccess,
                colorWarning: ThemeEnum.colorWarning,
                colorError: ThemeEnum.colorError,
            },
            setTheme: (theme: string) => set({ theme }),
            setColor: (color: System.Color) => set({ color }),
        }),
        {
            name: `${storagePrefix}-theme-storage`,
            storage: createJSONStorage(() => localStorage),
        },
    ),
)

export const useTabStore = create<System.TabState>()(
    persist(
        (set) => ({
            tabs: [],
            addTab: (tab: System.Tab) =>
                set((state) => {
                    const existingTab = state.tabs.find((t) => t.code === tab.code)
                    if (existingTab) {
                        return state
                    }
                    return { tabs: [...state.tabs, tab] }
                }),
            removeTab: (tab: System.Tab) =>
                set((state) => {
                    const currentTabs = state.tabs
                    const currentIndex = currentTabs.findIndex((t) => t.code === tab.code)
                    if (currentIndex !== -1) {
                        const newTabs = currentTabs.filter((t) => t.code !== tab.code)
                        return { tabs: newTabs }
                    }
                    return { tabs: currentTabs }
                }),
            setTabs: (tabs: System.Tab[]) => set({ tabs }),
        }),
        {
            name: `${storagePrefix}-tab-storage`,
            storage: createJSONStorage(() => localStorage),
        },
    ),
)

export const useLanguageStore = create<System.LanguageState>()(
    persist(
        (set) => ({
            language: 'zh',
            setLanguage: (language: string) => set({ language }),
        }),
        {
            name: `${storagePrefix}-language-storage`,
            storage: createJSONStorage(() => localStorage),
        },
    ),
)

export const useFullscreenStore = create<System.FullscreenState>()(
    persist(
        (set) => ({
            fullscreen: false,
            setFullscreen: (fullscreen: boolean) => set({ fullscreen }),
        }),
        {
            name: `${storagePrefix}-fullscreen-storage`,
            storage: createJSONStorage(() => localStorage),
        },
    ),
)
