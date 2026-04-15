import { useTranslation } from 'react-i18next'
import { Button, Checkbox, Flex, Form, Input } from 'antd'

import { mockApiClient } from '@/utils/http'
import Logo from '@/assets/png/logo.png'
import { Lock, User } from '@icon-park/react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { LanguageButton, ThemeButton } from '@/layouts/components'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMenuStore, useThemeStore, useUserStore } from '@/stores/system'
import menu from '@/utils/menu'

export const Route = createFileRoute('/login')({
    component: RouteComponent,
    staticData: {
        key: 'Login',
    },
})

function RouteComponent() {
    const { t } = useTranslation()
    const { setUserInfo } = useUserStore()
    const { theme } = useThemeStore()
    const { appendMenu } = useMenuStore()
    const navigate = useNavigate()

    const onFinish = async (values: any) => {
        const loginRes = await mockApiClient.login(values)
        if (loginRes.success && loginRes.data) {
            setUserInfo(loginRes.data)
            appendMenu(menu)
            navigate({ to: '/dashboard' })
        }
    }

    return (
        <div className="flex h-screen w-full min-w-240">
            <div
                className="dark:bg-dark-colorBgContainer! m-auto flex h-120 w-225 gap-2.5 rounded-[40px] bg-white"
                style={{
                    boxShadow:
                        theme === 'dark'
                            ? '-20px 20px 60px #23272a, 20px -20px 60px #2d3236'
                            : '-20px 20px 60px #cbcfd1, 20px -20px 60px #ffffff',
                }}
            >
                <div className="box-border w-125">
                    <div className="absolute top-4 left-4 flex items-center">
                        <img src={Logo} className="h-9 w-9" />
                        <span className="px-4 text-2xl font-bold">{t('System.System_Name')}</span>
                    </div>
                    <div className="h-full w-full rounded-[40px] bg-slate-100 p-10 dark:bg-black!">
                        <DotLottieReact src="/banner.json" autoplay loop />
                    </div>
                </div>
                <div className="m-auto box-border w-100 pr-2.5">
                    <div className="absolute top-4 right-4">
                        <ThemeButton />
                        <LanguageButton />
                    </div>
                    <div className="mb-15 text-center text-2xl font-bold">{t('System.Welcome')}</div>
                    <Form
                        size="large"
                        name="login"
                        initialValues={{ remember: true }}
                        className="box-border w-full!"
                        onFinish={onFinish}
                    >
                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: t('Required.User_Name_Required') }]}
                        >
                            <Input prefix={<User size={14} />} placeholder={t('Common.Username')} />
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
                            <Button className="my-1" block type="primary" htmlType="submit">
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
