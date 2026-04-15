import { useCallback, useEffect, useMemo, useReducer, useState, type ReactNode } from 'react'
import { Modal } from 'antd'

import { ModalContext, type ModalContextType, type ModalOptions, type ModalSlotState } from '@/hooks/modal.hooks'

export interface ModalProviderProps {
    children: ReactNode
}

type ModalAction =
    | { type: 'OPEN'; id: string; options: ModalOptions }
    | { type: 'CLOSE'; id: string }
    | { type: 'UPDATE'; id: string; options: Partial<ModalOptions> }

function modalReducer(state: Record<string, ModalSlotState>, action: ModalAction): Record<string, ModalSlotState> {
    switch (action.type) {
        case 'OPEN':
            return {
                ...state,
                [action.id]: { isOpen: true, options: action.options },
            }
        case 'CLOSE':
            return {
                ...state,
                [action.id]: { isOpen: false, options: {} },
            }
        case 'UPDATE': {
            const prev = state[action.id] ?? { isOpen: false, options: {} }
            return {
                ...state,
                [action.id]: {
                    ...prev,
                    options: { ...prev.options, ...action.options },
                },
            }
        }
        default:
            return state
    }
}

export function ModalProvider({ children }: ModalProviderProps) {
    const [states, dispatch] = useReducer(modalReducer, {})

    const openModal = useCallback((id: string, options: ModalOptions = {}) => {
        dispatch({ type: 'OPEN', id, options })
    }, [])

    const closeModal = useCallback((id: string) => {
        dispatch({ type: 'CLOSE', id })
    }, [])

    const updateModal = useCallback((id: string, options: Partial<ModalOptions>) => {
        dispatch({ type: 'UPDATE', id, options })
    }, [])

    const contextValue = useMemo<ModalContextType>(
        () => ({
            states,
            openModal,
            closeModal,
            updateModal,
        }),
        [states, openModal, closeModal, updateModal],
    )

    return (
        <ModalContext.Provider value={contextValue}>
            {children}
            {Object.entries(states).map(([id, { isOpen, options }]) => (
                <RegisteredModal key={id} id={id} isOpen={isOpen} options={options} closeModal={closeModal} />
            ))}
        </ModalContext.Provider>
    )
}

function RegisteredModal({
    id,
    isOpen,
    options,
    closeModal,
}: {
    id: string
    isOpen: boolean
    options: ModalOptions
    closeModal: (id: string) => void
}) {
    const {
        content,
        onOk: userOnOk,
        onCancel: userOnCancel,
        confirmLoading: optionConfirmLoading,
        ...modalProps
    } = options

    const [submitLoading, setSubmitLoading] = useState(false)

    useEffect(() => {
        if (!isOpen) {
            setSubmitLoading(false)
        }
    }, [isOpen])

    const handleOk = useCallback(() => {
        if (!userOnOk) {
            return
        }
        const ret = userOnOk()
        if (ret != null && typeof (ret as Promise<void>).then === 'function') {
            setSubmitLoading(true)
            ;(ret as Promise<void>).finally(() => {
                setSubmitLoading(false)
            })
        }
    }, [userOnOk])

    const confirmLoading = Boolean(optionConfirmLoading) || submitLoading

    return (
        <Modal
            {...modalProps}
            confirmLoading={confirmLoading}
            open={isOpen}
            onOk={handleOk}
            onCancel={() => {
                userOnCancel?.()
                closeModal(id)
            }}
        >
            {content}
        </Modal>
    )
}

export type { ModalOptions, ModalController, ModalContextType, ModalSlotState } from '@/hooks/modal.hooks'
