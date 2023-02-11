import { Modal } from "../../../common/modal/modal";
import styles from './auth.module.scss';

export function Auth() {

    return (
        <>
            <Modal isOpen >
                <div className={styles.authContent}>
                    <div className={styles.inputs}>
                        <label>Почта</label>
                        <input type="text" />
                    </div>
                    <div className={styles.inputs}>
                        <label>Пароль</label>
                        <input type="password" />
                    </div>
                    <div className={styles.buttonRow}>
                        <button>Войти</button>
                        <p>Еще нет акаунта? <a href="/">Регистрация</a></p>
                    </div>
                </div>
            </Modal>
        </>
    )
}