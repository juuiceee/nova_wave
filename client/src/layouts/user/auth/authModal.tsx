import { Button, Input, message, Modal } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthProvider from "../../../domain/auth/authProvider";
import { TrendsLink } from "../../../domain/links/links";
import useUserStore from "../../../domain/user/userStore";
import styles from './auth.module.scss';

interface IProps {
    isOpenModal: boolean,
    handleOk: () => void,
}

export function AuthModal(props: IProps) {
    const navigateTo = useNavigate()

    const [messageApi, contextHolder] = message.useMessage();

    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [name, setName] = useState<string>('')

    const [isRegistry, setIsRegistry] = useState<boolean>(false)

    const [setUser, setIsAuth] = useUserStore(state => [state.setUser, state.setIsAuth])

    async function loginUser() {
        try {
            const response = await AuthProvider.login(email, password)
            localStorage.setItem('token', response.data.tokens.accessToken)
            setUser(response.data.user)
            setIsAuth(true)
            props.handleOk()
            navigateTo(TrendsLink)
        } catch (e: any) {
            messageApi.open({
                type: 'error',
                content: e.response.data.message,
                duration: 3
            })
        }
    }

    async function registryUser() {
        try {
            const response = await AuthProvider.registration(email, password, name)
            localStorage.setItem('token', response.data.tokens.accessToken)
            setUser(response.data.user)
            setIsAuth(true)
            props.handleOk()
            navigateTo(TrendsLink)
        } catch (e: any) {
            messageApi.open({
                type: 'error',
                content: e.response.data.message,
                duration: 3
            })
        }
    }

    function changeEmail(event: React.ChangeEvent<HTMLInputElement>) { setEmail(event.target.value) }

    function changePassword(event: React.ChangeEvent<HTMLInputElement>) { setPassword(event.target.value) }

    function changeName(event: React.ChangeEvent<HTMLInputElement>) { setName(event.target.value) }

    return (
        <>
            {contextHolder}
            <Modal open={props.isOpenModal} onOk={props.handleOk} onCancel={props.handleOk} width={300} footer={null}>
                {
                    isRegistry
                        ? <div className={styles.authContent}>
                            <div className={styles.inputs}>
                                <label>Отображаемое имя</label>
                                <Input
                                    type="text"
                                    value={name}
                                    onChange={changeName}
                                    placeholder=''
                                    maxLength={16}
                                    showCount
                                />
                            </div>
                            <div className={styles.inputs}>
                                <label>Email</label>
                                <Input
                                    type="text"
                                    value={email}
                                    onChange={changeEmail}

                                />
                            </div>
                            <div className={styles.inputs}>
                                <label>Пароль</label>
                                <Input.Password
                                    type="password"
                                    value={password}
                                    onChange={changePassword}
                                    maxLength={16}
                                    showCount
                                />
                            </div>
                            <div className={styles.buttonRow}>
                                <Button type="primary" className={styles.logButton} onClick={registryUser}>Регистрирация</Button >
                                <Button type="link" className={styles.regButton} onClick={() => setIsRegistry(false)}>Назад</Button >
                            </div>
                        </div>

                        : <div className={styles.authContent}>
                            <div className={styles.inputs}>
                                <label>Email</label>
                                <Input
                                    type="text"
                                    value={email}
                                    onChange={changeEmail}
                                />
                            </div>
                            <div className={styles.inputs}>
                                <label>Пароль</label>
                                <Input.Password
                                    type="password"
                                    value={password}
                                    onChange={changePassword}
                                />
                            </div>
                            <div className={styles.buttonRow}>
                                <Button type="primary" className={styles.logButton} onClick={loginUser}>Войти</Button >
                                <Button type="link" className={styles.regButton} onClick={() => setIsRegistry(true)}>Регистрирация</Button >
                            </div>
                        </div>
                }
            </Modal>
        </>
    )
}