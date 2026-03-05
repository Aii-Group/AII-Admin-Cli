import { createContext, useContext, useState } from 'react'

import { Drawer, type DrawerProps } from 'antd'

export interface AiiDrawerProps extends DrawerProps {}

export type DrawerContent = React.ReactNode | null

export interface DrawerContextType {
    showDrawer: (content: DrawerContent, drawerProps?: Partial<AiiDrawerProps>) => void
    closeDrawer: () => void
}

export interface DrawerProviderProps {
    children: React.ReactNode
}

const DrawerContext = createContext<DrawerContextType>({
    showDrawer: () => {},
    closeDrawer: () => {},
})

export const DrawerProvider = ({ children }: DrawerProviderProps) => {
    const [open, setOpen] = useState(false)
    const [content, setContent] = useState<DrawerContent>(null)
    const [drawerProps, setDrawerProps] = useState<Partial<AiiDrawerProps>>({})

    const showDrawer = (drawerContent: DrawerContent, props: Partial<AiiDrawerProps> = {}) => {
        setContent(drawerContent)
        setDrawerProps(props)
        setOpen(true)
    }

    const closeDrawer = () => {
        setOpen(false)
        setContent(null)
        setDrawerProps({})
    }

    return (
        <DrawerContext.Provider value={{ showDrawer, closeDrawer }}>
            {children}
            <Drawer title="Drawer" placement="right" onClose={closeDrawer} open={open} size={400} {...drawerProps}>
                {content}
            </Drawer>
        </DrawerContext.Provider>
    )
}

export const useDrawer = (): DrawerContextType => {
    const context = useContext(DrawerContext)
    if (!context) {
        throw new Error('useDrawer must be used in DrawerProvider')
    }
    return context
}
