import { PlusOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Button, Dropdown, MenuProps } from 'antd';
import { useState } from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { RxHamburgerMenu } from 'react-icons/rx';
import { TbDoorExit } from 'react-icons/tb';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../content/images/logo.png';
import { PostEditor, ProfileLink, ProfileSettingsLink, TrendsLink } from '../../domain/links/links';
import useUserStore from '../../domain/user/userStore';
import { useWindowSize } from '../../hooks/useWindowSize';
import { MobileMenu } from '../main/leftContent/mobileMenu/mobileMenu';
import { AuthModal } from '../user/auth/authModal';
import styles from './header.module.scss';

export default function Header() {

    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isShowMobileMenu, setIsShowMobileMenu] = useState(false)

    const [user, logout] = useUserStore(state => [state.user, state.logout])

    const navigateTo = useNavigate()
    const windowSize = useWindowSize()

    function onClickCreatePost() {
        if (user != null)
            navigateTo(PostEditor.replace(':id', '0'))
        else
            setIsAuthModalOpen(true)
    }

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
        <header className={styles.headerMain}>
            <div className={styles.headerContent}>
                <div className={styles.headerLeft}>
                    {
                        windowSize.width < 910 &&
                        <div className={styles.menu} onClick={() => setIsShowMobileMenu(true)}>
                            <RxHamburgerMenu size={27} />
                        </div>
                    }
                    <Link to={TrendsLink}>
                        <img
                            src={logo}
                            alt="novaWave"
                            width={90}
                            height={50}
                        />
                    </Link>
                </div>
                {
                    windowSize.width > 768 &&
                    <>
                        <div className={styles.createPost}>
                            <Button icon={<PlusOutlined />} onClick={onClickCreatePost} size='large'>
                                Создать пост
                            </Button>
                        </div>
                        <div className={styles.headerRight} >
                            {
                                user != null
                                    ? <>
                                        <Link to={ProfileLink.replace(':id', user.id)}>
                                            <div className={styles.profile}>
                                                <Avatar src={process.env.REACT_APP_API_URL! + user.avatar} size={50} />
                                            </div>
                                        </Link>
                                        <Dropdown menu={{ items }} placement="bottomRight" trigger={['click']} >
                                            <MdKeyboardArrowDown size={24} />
                                        </Dropdown>
                                    </>
                                    : <p onClick={() => setIsAuthModalOpen(true)}>Войти</p>
                            }
                        </div>
                    </>
                }
            </div>
            <AuthModal isOpenModal={isAuthModalOpen} handleOk={() => setIsAuthModalOpen(false)} />

            {
                isShowMobileMenu &&
                <MobileMenu closeMenu={() => setIsShowMobileMenu(false)} />
            }

            {
                isShowMobileMenu &&
                <div className={styles.tint}></div>
            }
        </header>
    )
}