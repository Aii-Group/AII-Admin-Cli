import { useCallback, useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import { Drawer, type DrawerProps } from 'antd'

import { DrawerContext, type AiiDrawerProps, type DrawerContent, type DrawerContextType } from '@/hooks/drawer.hooks'

export interface DrawerProviderProps {
    children: ReactNode
}

export function DrawerProvider({ children }: DrawerProviderProps) {
    const [open, setOpen] = useState(false)
    const [content, setContent] = useState<DrawerContent>(null)
    const [drawerProps, setDrawerProps] = useState<Partial<AiiDrawerProps>>({})
    const [drawerMounted, setDrawerMounted] = useState(false)
    const [size, setSize] = useState(600)
    const [loading, setLoading] = useState(false)

    const showDrawer = useCallback((drawerContent: DrawerContent, props: Partial<AiiDrawerProps> = {}) => {
        setDrawerMounted(true)
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 1000)
        setContent(drawerContent)
        setDrawerProps(props)
        if (typeof props.size === 'number') {
            setSize(props.size)
        } else {
            setSize(600)
        }
        setOpen(true)
    }, [])

    const closeDrawer = useCallback(() => {
        setOpen(false)
        setContent(null)
        setDrawerProps({})
    }, [])

    const contextValue = useMemo<DrawerContextType>(() => ({ showDrawer, closeDrawer }), [showDrawer, closeDrawer])

    const mergedStyles = useMemo((): DrawerProps['styles'] => {
        const fromProps =
            drawerProps.styles && typeof drawerProps.styles === 'object'
                ? (drawerProps.styles as Record<string, CSSProperties | undefined>)
                : {}
        const section = fromProps.section
        return {
            ...fromProps,
            section: {
                ...section,
                borderRadius: '16px 0 0 16px',
            },
        }
    }, [drawerProps.styles])

    return (
        <DrawerContext.Provider value={contextValue}>
            {children}
            {drawerMounted ? (
                <Drawer
                    {...drawerProps}
                    title={drawerProps.title ?? 'Drawer'}
                    placement={drawerProps.placement ?? 'right'}
                    styles={mergedStyles}
                    loading={loading}
                    onClose={closeDrawer}
                    open={open}
                    size={size}
                    resizable={{
                        onResize: (newSize) => setSize(newSize),
                    }}
                >
                    {content}
                </Drawer>
            ) : null}
        </DrawerContext.Provider>
    )
}

export type { AiiDrawerProps, DrawerContent, DrawerContextType } from '@/hooks/drawer.hooks'
