import { createFileRoute } from '@tanstack/react-router'
import AiiTab from '@/components/AiiTab'
import { Input, Button, Form, InputNumber } from 'antd'
import AiiSearch from '@/components/AiiSearch'
import { Label } from '@icon-park/react'

export const Route = createFileRoute('/_authentication/_tab/tab')({
    component: RouteComponent,
    staticData: {
        code: 'Tab',
        langCode: 'Menu.Tab',
    },
})

function RouteComponent() {
    const [form] = Form.useForm()

    const searchItem = [
        <Form.Item name="username">
            <Input placeholder="Name" />
        </Form.Item>,
        <Form.Item name="age">
            <Input placeholder="Age" />
        </Form.Item>,
        <Form.Item name="address">
            <Input placeholder="Address" />
        </Form.Item>,
        <Form.Item name="email">
            <Input placeholder="Email" />
        </Form.Item>,
        <Form.Item name="phone">
            <Input placeholder="Phone" />
        </Form.Item>,
        <Form.Item name="mobile">
            <Input placeholder="Mobile" />
        </Form.Item>,
        <Form.Item name="createTime">
            <Input placeholder="Create Time" />
        </Form.Item>,
        <Form.Item name="status">
            <Input placeholder="Status" />
        </Form.Item>,
        <Form.Item name="birthday">
            <Input placeholder="Birthday" />
        </Form.Item>,
    ]

    const tabs = [
        {
            key: 1,
            icon: <Label />,
            label: 'Tab 1',
            content: (
                <div className="px-16 py-24">
                    <AiiSearch items={searchItem} wrapper={false} />
                </div>
            ),
        },
        {
            key: 2,
            label: 'Tab 2',
            content: (
                <div className="px-16 py-24">
                    <Form form={form} layout="vertical">
                        <Form.Item label="用户名" name="username">
                            <Input placeholder="请输入用户名" />
                        </Form.Item>
                        <Form.Item label="年龄" name="age">
                            <InputNumber className="w-full" placeholder="请输入年龄" />
                        </Form.Item>
                        <Button
                            type="primary"
                            onClick={() => form.validateFields().then((values) => console.log(values))}
                        >
                            提交
                        </Button>
                    </Form>
                </div>
            ),
        },
        {
            key: 3,
            label: 'Tab 3',
            content: (
                <div className="px-16 py-24">
                    <Input />
                </div>
            ),
        },
    ]

    return (
        <div className="w-full h-full p-4">
            <AiiTab tabs={tabs} defaultActiveKey={1} />
        </div>
    )
}
