import { useTranslation } from 'react-i18next'
import { Button, Checkbox, Flex, Form, Input } from 'antd'

import apiClient from '@/utils/http'
import Logo from '@/assets/png/logo.png'
import { Lock, User } from '@icon-park/react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { LanguageButton, ThemeButton } from '@/layouts/components'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMenuStore, useThemeStore, useUserStore } from '@/stores/system'

export const Route = createFileRoute('/login')({
    component: () => <Login />,
    staticData: {
        code: 'Login',
        langCode: 'Common.Login',
    },
})

const Login: React.FC = () => {
    const [form] = Form.useForm()
    const { t } = useTranslation()
    const { setUserInfo } = useUserStore()
    const { theme } = useThemeStore()
    const { appendMenu } = useMenuStore()
    const navigate = useNavigate()

    const onFinish = async (values: any) => {
        const loginRes = await apiClient.login(values)
        if (loginRes.success && loginRes.data) {
            setUserInfo(loginRes.data)
            getMenuData()
        }
    }
    const getMenuData = async () => {
        const menuRes = await apiClient.getMenu()
        if (menuRes.success) {
            appendMenu(menuRes.data ?? [])
            navigate({ to: '/dashboard' })
        }
    }
    return (
        <div className="w-full min-w-960 h-[100vh] flex">
            <div
                className="w-900 h-480 flex gap-10 m-auto rounded-[40px] bg-white dark:!bg-dark-colorBgContainer"
                style={{
                    boxShadow:
                        theme === 'dark'
                            ? '-20px 20px 60px #23272a, 20px -20px 60px #2d3236'
                            : '-20px 20px 60px #cbcfd1, 20px -20px 60px #ffffff',
                }}
            >
                <div className="w-500 box-border">
                    <div className="absolute top-16 left-16 flex items-center">
                        <img src={Logo} className="w-36 h-36" />
                        <span className="text-24 font-bold px-16">{t('System.System_Name')}</span>
                    </div>
                    <div className="w-full h-full p-40 bg-slate-100 dark:!bg-black rounded-[40px]">
                        <DotLottieReact src="/banner.json" autoplay loop />
                    </div>
                </div>
                <div className="w-400 box-border m-auto pr-10">
                    <div className="absolute top-16 right-16">
                        <ThemeButton />
                        <LanguageButton />
                    </div>
                    <div className="text-24 font-bold mb-60 text-center">{t('System.Welcome')}</div>
                    <Form
                        size="large"
                        name="login"
                        initialValues={{ remember: true }}
                        className="!w-full box-border"
                        onFinish={onFinish}
                    >
                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: t('Required.User_Name_Required') }]}
                        >
                            <Input prefix={<User size={14} />} placeholder={t('Common.Name')} />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: t('Required.User_Password_Required'),
                                },
                            ]}
                        >
                            <Input prefix={<Lock size={14} />} type="password" placeholder={t('Common.Password')} />
                        </Form.Item>
                        <Form.Item>
                            <Flex justify="space-between" align="center">
                                <Form.Item name="remember" valuePropName="checked" noStyle>
                                    <Checkbox>{t('Common.Remember_Me')}</Checkbox>
                                </Form.Item>
                                <a href="">{t('Common.Forgot_Password')}</a>
                            </Flex>
                            <Button className="my-4" block type="primary" htmlType="submit">
                                {t('Common.Log_In')}
                            </Button>
                            <div className="text-center">
                                <a href="">{t('Common.Register_Now')}</a>
                            </div>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    )
}
