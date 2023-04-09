import { FiStar } from 'react-icons/fi'
import { TbLeaf } from 'react-icons/tb'
import { TiWorldOutline } from 'react-icons/ti'
import { Link, useLocation } from 'react-router-dom'
import { FavoritesLink, NewLink, TrendsLink } from '../../../domain/links/links'
import useUserStore from '../../../domain/user/userStore'
import styles from './leftContent.module.scss'

export function LeftContent() {

    const [user] = useUserStore(state => [state.user])

    const location = useLocation();

    function isActive(href: string): boolean {
        return location.pathname.indexOf(href) !== -1;
    }

    return (
        <div className={styles.sidebar}>
            <Link to={TrendsLink}>
                <div className={isActive(TrendsLink) ? styles.sidebarItemSelected : styles.sidebarItem}>
                    <TiWorldOutline size={24} />
                    <p>Тренды</p>
                </div>
            </Link>

            <Link to={NewLink}>
                <div className={isActive(NewLink) ? styles.sidebarItemSelected : styles.sidebarItem}>
                    <TbLeaf size={24} />
                    <p>Свежее</p>
                </div>
            </Link>

            {
                user != null &&
                <Link to={FavoritesLink}>
                    <div className={isActive(FavoritesLink) ? styles.sidebarItemSelected : styles.sidebarItem}>
                        <FiStar size={24} />
                        <p>Избранное</p>
                    </div>
                </Link>
            }

            {/* <Link to={SubscriptionsLink}>
            <div className={isActive(SubscriptionsLink) ? styles.sidebarItemSelected : styles.sidebarItem}>
                <IoCheckmark size={24} />
                <p>Подписки</p>
            </div>
            </Link> */}
        </div >
    )
}