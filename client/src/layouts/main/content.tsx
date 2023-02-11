import { Outlet } from 'react-router-dom';
import Header from '../header/header';
import styles from './content.module.scss';
import { LeftContent } from "./leftContent/leftContent";

export function Content() {
    return (
        <>
            <Header />
            <div className={styles.content}>
                <LeftContent />
                <Outlet />
            </div>
        </>
    )
}