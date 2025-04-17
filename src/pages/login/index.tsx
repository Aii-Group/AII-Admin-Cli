import { Button, Checkbox, Form, Input, Flex } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { User, Lock, Earth, SunOne, Moon } from '@icon-park/react'
import { useUserStore, useThemeStore, useLanguageStore, useMenuStore } from '@/stores/system'
import { enableTransitions } from '@/utils/system'
import Logo from '@/assets/png/logo.png'
import Banner from '@/assets/svg/banner.svg?react'
import { login, getMenu } from '@/api/mock'

const Login: React.FC = () => {
  const { t } = useTranslation()
  const { setUserInfo } = useUserStore()
  const { theme, setTheme } = useThemeStore()
  const { language, setLanguage } = useLanguageStore()
  const { appendMenu } = useMenuStore()
  const navigate = useNavigate()

  const onChangeTheme = async (event: unknown) => {
    const { clientX: x, clientY: y } = event as MouseEvent
    const isDark = theme === 'dark'

    if (!enableTransitions()) {
      setTheme(theme === 'light' ? 'dark' : 'light')
      return
    }

    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))}px at ${x}px ${y}px)`,
    ]

    await document.startViewTransition(async () => {
      setTheme(theme === 'light' ? 'dark' : 'light')
    }).ready

    document.documentElement.animate(
      { clipPath: !isDark ? clipPath.reverse() : clipPath },
      {
        duration: 500,
        easing: 'ease-in',
        pseudoElement: `::view-transition-${!isDark ? 'old' : 'new'}(root)`,
      },
    )
  }
  const onChangeLanguage = () => {
    language === 'zh' ? setLanguage('en') : setLanguage('zh')
  }
  const onFinish = async (values: any) => {
    const loginRes = await login(values)
    if (loginRes.success && loginRes.data) {
      setUserInfo(loginRes.data)
      getMenuData()
    }
  }
  const getMenuData = async () => {
    const menuRes = await getMenu()
    if (menuRes.success) {
      appendMenu(menuRes.data ?? [])
      navigate('/')
    }
  }
  return (
    <div className="login">
      <div className="login__banner">
        <div className="system__logo">
          <img src={Logo} />
          <span>{t('System.System_Name')}</span>
        </div>
        <Banner className="w-[70%] h-full m-auto" />
      </div>
      <div className="login__form">
        <div className="setting">
          <Button
            type="text"
            icon={theme === 'light' ? <SunOne /> : <Moon />}
            onClick={(event) => onChangeTheme(event)}
          />
          <Button type="text" icon={<Earth />} onClick={onChangeLanguage} />
        </div>
        <div className="form">
          <div className="login__form__title">{t('System.Welcome')}</div>
          <Form
            size="large"
            name="login"
            initialValues={{ remember: true }}
            style={{ width: '60%', minWidth: 360 }}
            onFinish={onFinish}
          >
            <Form.Item name="username" rules={[{ required: true, message: t('Required.User_Name_Required') }]}>
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
export default Login
