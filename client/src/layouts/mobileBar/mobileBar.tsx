import { PlusOutlined, SettingOutlined } from '@ant-design/icons'
import { Avatar, Dropdown, MenuProps } from 'antd'
import { useState } from 'react'
import { AiOutlineHome } from 'react-icons/ai'
import { MdKeyboardArrowUp } from 'react-icons/md'
import { TbDoorExit } from 'react-icons/tb'
import { Link, useNavigate } from 'react-router-dom'
import { PostEditor, ProfileLink, ProfileSettingsLink, TrendsLink } from '../../domain/links/links'
import useUserStore from '../../domain/user/userStore'
import { AuthModal } from '../user/auth/authModal'
import styles from './mobileBar.module.scss'

export function MobileBar() {

    const [user, logout] = useUserStore(state => [state.user, state.logout])
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const navigateTo = useNavigate()

    const items: MenuProps['items'] = user !== null ? [
        {
            label: 'Мой профиль',
            key: 'title',
            type: 'group',
            style: { fontSize: 14, fontWeight: 'bold', color: "black" }
        },
        {
            label: (
                <div className={styles.profile}>
                    <Avatar src={process.env.REACT_APP_API_URL! + user.avatar} />
                    <p>{user.name}</p>
                </div>
            ),
            key: 'profile',
            style: { width: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: 16 },
            onClick: () => navigateTo(ProfileLink.replace(':id', user.id)),
        },
        {
            label: 'Настройки',
            key: 'settings',
            icon: <SettingOutlined />,
            style: { fontSize: 16 },
            onClick: () => navigateTo(ProfileSettingsLink.replace(':id', user.id))
        },
        {
            type: 'divider'
        },
        {
            label: 'Выход',
            key: 'out',
            icon: <TbDoorExit />,
            danger: true,
            style: { fontSize: 16 },
            onClick: logout
        }
    ] : []

    return (
        <>
            <div className={styles.container}>
                <Link to={TrendsLink}>
                    <AiOutlineHome size={24} />
                </Link>
                <Link to={PostEditor.replace(':id', '0')}>
                    <PlusOutlined size={24} />
                </Link>
                <div className={styles.profile}>
                    {
                        user != null
                            ? <>
                                <Link to={ProfileLink.replace(':id', user.id)}>
                                    <div className={styles.profile}>
                                        <Avatar src={process.env.REACT_APP_API_URL! + user.avatar} size={40} />
                                    </div>
                                </Link>
                                <Dropdown menu={{ items }} placement="topRight" trigger={['click']} >
                                    <MdKeyboardArrowUp size={24} />
                                </Dropdown>
                            </>
                            : <p onClick={() => setIsAuthModalOpen(true)}>Войти</p>
                    }
                </div>
            </div>
            <AuthModal isOpenModal={isAuthModalOpen} handleOk={() => setIsAuthModalOpen(false)} />
        </>

    )
}