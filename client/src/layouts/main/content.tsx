import { Outlet } from 'react-router-dom';
import styles from './content.module.scss';
import { LeftContent } from "./leftContent/leftContent";

export function Content() {
    return (
        <>
            <div className={styles.content}>
                <LeftContent />
                <Outlet />
            </div>
        </>
    )
}