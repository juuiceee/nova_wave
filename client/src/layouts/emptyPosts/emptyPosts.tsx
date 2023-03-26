import styles from './emptyPosts.module.scss'


interface IProps {
    message: string
}

export function EmptyPosts(props: IProps) {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.message}>
                    <p>{props.message}</p>
                </div>
            </div>
        </div>)
}