import { Link } from 'react-router-dom'
import avatar from '../../content/images/avatar.jpg'
import logo from '../../content/images/logo.png'
import styles from './header.module.scss'

export default function Header() {

    return (
        <header className={styles.headerMain}>
            <div className={styles.headerContent}>
                <Link to="/">
                    <div className={styles.headerLeft}>
                        {/* <HiBars3 size={20} /> */}
                        <img
                            src={logo}
                            alt="novaWave"
                            width={70}
                            height={40}
                        ></img>
                    </div>
                </Link>
                <Link to="/profile">
                    <div className={styles.headerRight}>
                        <img
                            className={styles.profile}
                            src={avatar}
                            alt='аватар'
                            width={40}
                            height={40}
                        ></img>
                    </div>
                </Link>
            </div>
        </header>
    )
}