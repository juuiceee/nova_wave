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

    function closeModal() {
        setEmail('')
        setPassword('')
        setName('')
        props.handleOk()
    }

    return (
        <>
            {contextHolder}
            <Modal open={props.isOpenModal} onOk={props.handleOk} onCancel={closeModal} width={350} footer={null} centered>
                {
                    isRegistry
                        ? <div className={styles.authContent}>
                            <div className={styles.inputs}>
                                <p>Отображаемое имя</p>
                                <Input
                                    type="text"
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    placeholder=''
                                    maxLength={16}
                                    showCount
                                />
                            </div>
                            <div className={styles.inputs}>
                                <p>Email</p>
                                <Input
                                    type="text"
                                    value={email}
                                    size="large"
                                    onChange={(event) => setEmail(event.target.value)}

                                />
                            </div>
                            <div className={styles.inputs}>
                                <p>Пароль</p>
                                <Input.Password
                                    type="password"
                                    value={password}
                                    size="large"
                                    maxLength={16}
                                    showCount
                                    onChange={(event) => setPassword(event.target.value)}
                                />
                            </div>
                            <div className={styles.buttonRow}>
                                <Button type="primary" className={styles.logButton} size="large" onClick={registryUser}>Регистрирация</Button >
                                <Button type="link" className={styles.regButton} size="large" onClick={() => setIsRegistry(false)}>Авторизация</Button >
                            </div>
                        </div>

                        : <div className={styles.authContent}>
                            <div className={styles.inputs}>
                                <p>Email</p>
                                <Input
                                    type="text"
                                    value={email}
                                    size="large"
                                    onChange={(event) => setEmail(event.target.value)}
                                />
                            </div>
                            <div className={styles.inputs}>
                                <p>Пароль</p>
                                <Input.Password
                                    type="password"
                                    value={password}
                                    size="large"
                                    onChange={(event) => setPassword(event.target.value)}
                                />
                            </div>
                            <div className={styles.buttonRow}>
                                <Button type="primary" className={styles.logButton} size="large" onClick={loginUser}>Войти</Button >
                                <Button type="link" className={styles.regButton} size="large" onClick={() => setIsRegistry(true)}>Регистрирация</Button >
                            </div>
                        </div>
                }
            </Modal>
        </>
    )
}