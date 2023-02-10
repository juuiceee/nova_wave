import styles from './content.module.scss';
import { LeftContent } from "./leftContent/leftContent";
import { MiddleContent } from './middleContent/middleContent';

export function Content() {
    return (
        <div className={styles.content}>
            <LeftContent />
            <MiddleContent />
        </div>
    )
}