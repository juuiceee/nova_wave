import { Outlet } from 'react-router-dom';
import { useWindowSize } from '../../hooks/useWindowSize';
import { MobileBar } from '../mobileBar/mobileBar';
import styles from './content.module.scss';
import { LeftContent } from "./leftContent/leftContent";

export function Content() {

    const windowSize = useWindowSize()

    return (
        <>
            <div className={styles.content}>
                <LeftContent />
                <Outlet />
            </div>
            {
                windowSize.width < 768 &&
                <MobileBar />
            }
        </>
    )
}