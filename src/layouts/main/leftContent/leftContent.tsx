import { FiStar } from 'react-icons/fi'
import { IoCheckmark } from 'react-icons/io5'
import { TbLeaf } from 'react-icons/tb'
import { TiWorldOutline } from 'react-icons/ti'
import styles from './leftContent.module.scss'

export function LeftContent() {
    return (
        <div className={styles.sidebar}>
            <div className={styles.sidebarItemSelected}>
                <TiWorldOutline size={17} color={1 == 1 ? 'rgba(34,193,195,1)' : '#686868'} />
                <p>Тренды</p>
            </div>

            <div className={styles.sidebarItem}>
                <TbLeaf size={17} color='#686868' />
                <p>Свежее</p>
            </div>

            <div className={styles.sidebarItem}>
                <FiStar size={17} color='#686868' />
                <p>Избранное</p>
            </div>

            <div className={styles.sidebarItem}>
                <IoCheckmark size={17} color='#686868' />
                <p>Подписки</p>
            </div>
        </div>
    )
}