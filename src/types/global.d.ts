import ''
declare global {
  import { MessageInstance, HookAPI, NotificationInstance } from 'antd'
  import type { MenuItemType, SubMenuType, MenuItemGroupType } from 'antd'
  export interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any
    $message: MessageInstance
    $modal: HookAPI
    $notification: NotificationInstance
  }
  export namespace System {
    interface UserState {
      userInfo: UserInfo
      setUserInfo: (userInfo: UserInfo) => void
    }
    interface UserInfo {
      userId?: string
      userName?: string
      accessToken?: string
    }
    interface MenuState {
      menu: MenuOptions[]
      setMenu: (menu: MenuOptions[]) => void
      appendMenu: (menu: MenuOptions[]) => void
    }
    interface MenuOptions {
      key: string
      path: string
      filePath?: string
      label: string
      icon?: string
      children?: MenuOptions[]
    }
    interface CollapseState {
      collapsed: boolean
      collapseMenuOpenedKeys: string[]
      expandMenuOpenedKeys: string[]
      toggleCollapsed: () => void
      setOpenedKeys: (openedKeys: string[]) => void
    }
    interface ExpandState {
      expandedKeys: string[]
      setExpandedKeys: (expandedKeys: string[]) => void
    }
    interface ThemeState {
      theme: string
      color: Color
      setTheme: (theme: string) => void
      setColor: (color: Color) => void
    }
    interface Color {
      colorPrimary: string
      colorSuccess: string
      colorWarning: string
      colorError: string
    }
    interface Tab {
      requiredAuth?: boolean
      code: string
      path: string
      closeable?: boolean
    }
    interface TabState {
      tabs: Tab[]
      addTab: (tab: Tab) => void
      removeTab: (tab: Tab) => void
      setTabs: (tabs: Tab[]) => void
    }
    interface LanguageState {
      language: string
      setLanguage: (language: string) => void
    }
    interface FullscreenState {
      fullscreen: boolean
      setFullscreen: (fullscreen: boolean) => void
    }
    type Enum = MenuItemType | SubMenuType | MenuItemGroupType
  }

  export namespace OpenAI {
    interface ChatCompletionAssistantMessageParam {
      reasoning_content?: string
    }
  }
  export interface Navigator {
    msSaveOrOpenBlob: (blob: Blob, fileName: string) => void
    browserLanguage: string
  }
}
