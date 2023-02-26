import { FiStar } from 'react-icons/fi'
import { IoCheckmark } from 'react-icons/io5'
import { TbLeaf } from 'react-icons/tb'
import { TiWorldOutline } from 'react-icons/ti'
import { Link, useLocation } from 'react-router-dom'
import { FavouritesLink, NewLink, SubscriptionsLink, TrendsLink } from '../../../domain/links/links'
import styles from './leftContent.module.scss'

export function LeftContent() {

    const location = useLocation();

    function isActive(href: string): boolean {
        return location.pathname.indexOf(href) !== -1;
    }

    return (
        <div className={styles.sidebar}>
            <Link to={TrendsLink}>
                <div className={isActive(TrendsLink) ? styles.sidebarItemSelected : styles.sidebarItem}>
                    <TiWorldOutline size={17} />
                    <p>Тренды</p>
                </div>
            </Link>

            <Link to={NewLink}>
                <div className={isActive(NewLink) ? styles.sidebarItemSelected : styles.sidebarItem}>
                    <TbLeaf size={17} />
                    <p>Свежее</p>
                </div>
            </Link>

            <Link to={FavouritesLink}>
                <div className={isActive(FavouritesLink) ? styles.sidebarItemSelected : styles.sidebarItem}>
                    <FiStar size={17} />
                    <p>Избранное</p>
                </div>
            </Link>

            <Link to={SubscriptionsLink}>
                <div className={isActive(SubscriptionsLink) ? styles.sidebarItemSelected : styles.sidebarItem}>
                    <IoCheckmark size={17} />
                    <p>Подписки</p>
                </div>
            </Link>
        </div >
    )
}