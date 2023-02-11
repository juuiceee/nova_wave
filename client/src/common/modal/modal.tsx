import { PropsWithChildren } from "react";
import { AiOutlineClose } from 'react-icons/ai';
import ReactModal from "react-modal";
import styles from "./modal.module.scss";

export interface Props {
    fullScreen?: boolean;
    isOpen: boolean;
    title?: string;
    className?: string;
    onClose?: () => void;
    onCloseWithoutIcon?: () => void;
}

export function Modal(props: PropsWithChildren<Props>) {
    const classNames = [styles.modal];

    if (props.className != undefined)
        classNames.push(props.className);

    if (props.fullScreen)
        classNames.push(styles.full_screen);

    return (
        <ReactModal
            isOpen={props.isOpen}
            className={classNames.join(' ')}
            overlayClassName={props.fullScreen ? styles.child_overlay : styles.overlay}
            onRequestClose={props.onClose != null ? props.onClose : props.onCloseWithoutIcon}
        >
            {
                props.onClose &&
                <AiOutlineClose onClick={props.onClose} className={styles.close_button} />
            }

            <div className={styles.content}>
                {
                    props.title != null &&
                    <div className={styles.titleContainer}>
                        <div className={styles.title}>
                            {props.title}
                        </div>
                    </div>
                }

                {props.children}
            </div>
        </ReactModal>
    )
}