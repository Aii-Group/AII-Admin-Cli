import { createContext, useContext, useMemo, type ReactNode } from 'react'

import { type ModalProps } from 'antd'

export interface ModalOptions extends ModalProps {
    content?: ReactNode
    onOk?: () => void | Promise<void>
    onCancel?: () => void
}

export interface ModalController {
    isOpen: boolean
    modalOptions: ModalOptions
    openModal: (options?: ModalOptions) => void
    closeModal: () => void
    updateModal: (options: Partial<ModalOptions>) => void
}

export type ModalSlotState = {
    isOpen: boolean
    options: ModalOptions
}

export interface ModalContextType {
    states: Record<string, ModalSlotState>
    openModal: (id: string, options?: ModalOptions) => void
    closeModal: (id: string) => void
    updateModal: (id: string, options: Partial<ModalOptions>) => void
}

export const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function useModalContext(): ModalContextType {
    const context = useContext(ModalContext)
    if (context === undefined) {
        throw new Error('useModalContext must be used within ModalProvider')
    }
    return context
}

export function useModal(ids: string[]): Record<string, ModalController> {
    const { states, openModal, closeModal, updateModal } = useModalContext()

    return useMemo(() => {
        const acc: Record<string, ModalController> = {}
        for (const id of ids) {
            const slot = states[id]
            acc[id] = {
                isOpen: slot?.isOpen ?? false,
                modalOptions: slot?.options ?? {},
                openModal: (options) => openModal(id, options),
                closeModal: () => closeModal(id),
                updateModal: (options) => updateModal(id, options),
            }
        }
        return acc
    }, [ids, states, openModal, closeModal, updateModal])
}
