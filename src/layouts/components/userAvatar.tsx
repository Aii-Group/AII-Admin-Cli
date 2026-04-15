import { Avatar, Dropdown, type MenuProps } from 'antd'
import { useTranslation } from 'react-i18next'

import Logo from '@/assets/png/logo.png'
import { resetLogout } from '@/utils/system'
import { Logout, User } from '@icon-park/react'
import { useNavigate } from '@tanstack/react-router'

export default function UserAvatar() {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const items: MenuProps['items'] = [
        {
            key: 'userInfo',
            icon: <User />,
            label: t('Common.User_Info'),
        },
        {
            key: 'logout',
            icon: <Logout />,
            label: t('Common.Logout'),
        },
    ]

    const onClick: MenuProps['onClick'] = ({ key }) => {
        switch (key) {
            case 'userInfo':
                window.$message.info('User Info')
                break
            case 'logout':
                handleLogout()
                break
            default:
                break
        }
    }
    const handleLogout = () => {
        window.$modal.confirm({
            title: t('Common.Warning'),
            content: t('Tips.Logout_Tips'),
            okText: t('Common.Logout'),
            onOk() {
                resetLogout()
                navigate({ to: '/login' })
            },
        })
    }
    return (
        <Dropdown menu={{ items, onClick }} placement="bottomLeft">
            <Avatar size={32} src={<img src={Logo} alt="avatar" />} />
        </Dropdown>
    )
}
