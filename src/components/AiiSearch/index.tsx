import { memo, useCallback, useState } from 'react'

import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'framer-motion'
import type { FormInstance } from 'antd/es/form/Form'
import { Button, Col, Form, Row, Space, Tooltip } from 'antd'

import { Clear, Down, Search } from '@icon-park/react'

const MOTION_TRANSITION = { duration: 0.3 } as const
const MOTION_EXPANDED = { height: 'auto' as const, opacity: 1 }
const MOTION_COLLAPSED = { height: 0, opacity: 0 }

export type AiiSearchValues = Record<string, unknown>

interface AiiSearchProps {
    items: React.ReactElement<typeof Form.Item>[]
    cols?: number
    onSearch?: (value: AiiSearchValues) => void
    wrapper?: boolean
    className?: string
    style?: React.CSSProperties
}

function renderItemCols(items: React.ReactElement<typeof Form.Item>[], start: number, end: number) {
    return items.slice(start, end).map((item, index) => (
        <Col key={start + index} span={6}>
            {item}
        </Col>
    ))
}

interface SearchOperationsBarProps {
    itemsLength: number
    expand: boolean
    onToggleExpand: () => void
    form: FormInstance
}

const SearchOperationsBar = memo(function SearchOperationsBar({
    itemsLength,
    expand,
    onToggleExpand,
    form,
}: SearchOperationsBarProps) {
    const { t } = useTranslation()

    const handleReset = useCallback(() => {
        form.resetFields()
    }, [form])

    return (
        <Col span={itemsLength < 4 ? 6 : 24}>
            <div className={clsx('text-right', itemsLength >= 4)}>
                <Space size="small">
                    <Button icon={<Search />} type="primary" htmlType="submit">
                        {t('Action.Search')}
                    </Button>
                    <Button icon={<Clear />} onClick={handleReset}>
                        {t('Action.Reset')}
                    </Button>
                    {itemsLength > 4 ? (
                        <Tooltip title={expand ? t('Action.Collapse') : t('Action.Expand')}>
                            <span
                                className={clsx(
                                    'hover:text-colorPrimary flex items-center transition-all duration-300 ease-in-out',
                                    { 'rotate-180': expand, 'rotate-0': !expand },
                                )}
                                onClick={onToggleExpand}
                            >
                                <Down />
                            </span>
                        </Tooltip>
                    ) : null}
                </Space>
            </div>
        </Col>
    )
})

interface DynamicFieldsRowsProps {
    items: React.ReactElement<typeof Form.Item>[]
    expand: boolean
    form: FormInstance
    onToggleExpand: () => void
}

const DynamicFieldsRows = memo(function DynamicFieldsRows({
    items,
    expand,
    form,
    onToggleExpand,
}: DynamicFieldsRowsProps) {
    const itemsLength = items.length

    if (itemsLength < 4) {
        return (
            <Row gutter={24}>
                {renderItemCols(items, 0, itemsLength)}
                <SearchOperationsBar
                    itemsLength={itemsLength}
                    expand={expand}
                    onToggleExpand={onToggleExpand}
                    form={form}
                />
            </Row>
        )
    }

    return (
        <>
            <Row gutter={24}>{renderItemCols(items, 0, 4)}</Row>
            <AnimatePresence mode="wait">
                <motion.div
                    initial={false}
                    animate={expand ? MOTION_EXPANDED : MOTION_COLLAPSED}
                    transition={MOTION_TRANSITION}
                    style={{
                        overflow: 'hidden',
                        pointerEvents: expand ? 'auto' : 'none',
                    }}
                >
                    <Row gutter={24}>{renderItemCols(items, 4, itemsLength)}</Row>
                </motion.div>
            </AnimatePresence>
            <SearchOperationsBar
                itemsLength={itemsLength}
                expand={expand}
                onToggleExpand={onToggleExpand}
                form={form}
            />
        </>
    )
})

export default function AiiSearch(props: AiiSearchProps) {
    const { items, onSearch, wrapper = true, className, style } = props
    const [form] = Form.useForm()
    const [expand, setExpand] = useState(false)

    const handleExpand = useCallback(() => setExpand((e) => !e), [])

    const onFinish = useCallback(
        (values: Record<string, unknown> = {}) => {
            if (!onSearch) return
            const result = Object.keys(values).reduce(
                (acc, key) => {
                    acc[key] = values[key] === undefined ? '' : values[key]
                    return acc
                },
                {} as Record<string, unknown>,
            )
            onSearch(result)
        },
        [onSearch],
    )

    return (
        <div className={clsx('mb-4', { 'pb-0': items.length < 4, wrapper: wrapper }, className)} style={style}>
            <Form form={form} name="advanced_search" onFinish={onFinish}>
                <DynamicFieldsRows items={items} expand={expand} form={form} onToggleExpand={handleExpand} />
            </Form>
        </div>
    )
}
