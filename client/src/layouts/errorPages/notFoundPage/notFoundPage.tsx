import { TbError404 } from 'react-icons/tb'
import styles from './notFoundPage.module.scss'

export function NotFoundPage() {

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.error}>
                    <TbError404 size={40} />
                    <span>Страница не найдена</span>
                </div>
            </div>
        </div>
    )

}