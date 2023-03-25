import { PlusOutlined } from '@ant-design/icons';
import { Avatar, Button } from 'antd';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../content/images/logo.png';
import { PostEditor, ProfileLink, TrendsLink } from '../../domain/links/links';
import useUserStore from '../../domain/user/userStore';
import { AuthModal } from '../user/auth/authModal';
import styles from './header.module.scss';

export default function Header() {

    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const user = useUserStore(state => state.user)

    function showAuthModal() {
        setIsAuthModalOpen(true)
    }

    function handleOk() {
        setIsAuthModalOpen(false)
    }

    return (
        <header className={styles.headerMain}>
            <div className={styles.headerContent}>
                <Link to={TrendsLink}>
                    <div className={styles.headerLeft}>
                        <img
                            src={logo}
                            alt="novaWave"
                            width={70}
                            height={40}
                        ></img>
                    </div>
                </Link>
                <div className={styles.createPost}>
                    {
                        user
                            ? <Link to={PostEditor.replace(':id', '0')}>
                                <Button icon={<PlusOutlined />}>
                                    Создать пост
                                </Button>
                            </Link>
                            : <Button icon={<PlusOutlined />} onClick={showAuthModal}>
                                Создать пост
                            </Button>
                    }

                </div>
                <div className={styles.headerRight} >
                    {
                        user != null
                            ? <Link to={ProfileLink}>
                                <div className={styles.profile}>
                                    <p>{user.name}</p>
                                    <Avatar src={process.env.REACT_APP_API_URL! + user.avatar} />
                                </div>
                            </Link>
                            : <p onClick={showAuthModal}>Войти</p>
                    }
                </div>
            </div>
            <AuthModal isOpenModal={isAuthModalOpen} handleOk={handleOk} />
        </header>
    )
}