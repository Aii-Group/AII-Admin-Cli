import { createContext, useContext, type ReactNode } from 'react'

import type { DrawerProps } from 'antd'

export type AiiDrawerProps = DrawerProps

export type DrawerContent = ReactNode | null

export interface DrawerContextType {
    showDrawer: (content: DrawerContent, drawerProps?: Partial<AiiDrawerProps>) => void
    closeDrawer: () => void
}

export const DrawerContext = createContext<DrawerContextType | undefined>(undefined)

export function useDrawer(): DrawerContextType {
    const context = useContext(DrawerContext)
    if (context === undefined) {
        throw new Error('useDrawer must be used within DrawerProvider')
    }
    return context
}
