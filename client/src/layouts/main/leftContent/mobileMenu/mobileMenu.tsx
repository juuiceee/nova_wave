import { FiStar } from "react-icons/fi";
import { RxHamburgerMenu } from 'react-icons/rx';
import { TbLeaf } from "react-icons/tb";
import { TiWorldOutline } from "react-icons/ti";
import { Link, useLocation } from "react-router-dom";
import logo from '../../../../content/images/logo.png';
import { FavoritesLink, NewLink, TrendsLink } from "../../../../domain/links/links";
import useUserStore from "../../../../domain/user/userStore";
import styles from './mobileMenu.module.scss';

interface IProps {
    closeMenu: () => void
}

export function MobileMenu(props: IProps) {
    const [user] = useUserStore(state => [state.user])

    const location = useLocation();

    function isActive(href: string): boolean {
        return location.pathname.indexOf(href) !== -1;
    }

    return (
        <div className={styles.menu}>
            <div className={styles.header}>
                <RxHamburgerMenu size={27} onClick={props.closeMenu} />
                <Link to={TrendsLink}>
                    <img
                        src={logo}
                        alt="novaWave"
                        width={90}
                        height={50}
                    />
                </Link>
            </div>
            <div className={styles.linkItems}>
                <Link to={TrendsLink} onClick={props.closeMenu}>
                    <div className={isActive(TrendsLink) ? styles.sidebarItemSelected : styles.sidebarItem}>
                        <TiWorldOutline size={24} />
                        <p>Тренды</p>
                    </div>
                </Link>

                <Link to={NewLink} onClick={props.closeMenu}>
                    <div className={isActive(NewLink) ? styles.sidebarItemSelected : styles.sidebarItem}>
                        <TbLeaf size={24} />
                        <p>Свежее</p>
                    </div>
                </Link>

                {
                    user != null &&
                    <Link to={FavoritesLink} onClick={props.closeMenu}>
                        <div className={isActive(FavoritesLink) ? styles.sidebarItemSelected : styles.sidebarItem}>
                            <FiStar size={24} />
                            <p>Избранное</p>
                        </div>
                    </Link>
                }
            </div>
        </div>
    )
}