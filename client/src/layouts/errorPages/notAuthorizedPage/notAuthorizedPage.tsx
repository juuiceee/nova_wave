import styles from './notAuthorizedPage.module.scss'

export function NotAuthorizedPage() {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.error}>
                    <span>Пожалуйста, авторизуйтесь</span>
                </div>
            </div>
        </div>
    )
}