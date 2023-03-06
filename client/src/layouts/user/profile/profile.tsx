import { Button, Card, Image, Input, message, Tabs, TabsProps } from "antd"
import TextArea from "antd/es/input/TextArea"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { IPost } from "../../../domain/post/post"
import PostProvider from "../../../domain/post/postProvider"
import { IUser } from "../../../domain/user/user"
import UserProvider from "../../../domain/user/userProvider"
import useUserStore from "../../../domain/user/userStore"
import { AuthModal } from "../auth/authModal"
import styles from './profile.module.scss'

interface IProps {
    user: IUser | null
}

export function Profile(props: IProps) {

    const [messageApi, contextHolder] = message.useMessage();

    const [isAuth, setUser, logout, checkAuth] = useUserStore(state => [state.isAuth, state.setUser, state.logout, state.checkAuth])

    const [name, setName] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [posts, setPosts] = useState<IPost[]>([])

    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    useEffect(() => {
        if (props.user) {
            setName(props.user.name)
            setDescription(props.user.description)
            setEmail(props.user.email)
        }
    }, [props.user])

    async function saveUser() {
        if (props.user)
            try {
                const response = await UserProvider.save({ ...props.user, name, description, email })
                setUser(response.data)
                checkAuth()
                messageApi.open({
                    type: 'success',
                    content: 'Успешно сохранено',
                    duration: 3
                })
            } catch (e: any) {
                messageApi.open({
                    type: 'error',
                    content: e.response.data.message,
                    duration: 3
                })
            }
    }

    async function changeTabs(key: string) {
        if (key == 'posts' && posts.length == 0 && props.user) //изменить логику, по которой идет запрос на получение постов
        {
            const postPaged = await PostProvider.getPostsByUserId(props.user.id)
            setPosts(postPaged.data.rows)
        }

    }

    function changeName(event: React.ChangeEvent<HTMLInputElement>) { setName(event.target.value) }

    function changeDescription(event: React.ChangeEvent<HTMLTextAreaElement>) { setDescription(event.target.value) }

    function changeEmail(event: React.ChangeEvent<HTMLInputElement>) { setEmail(event.target.value) }

    function showAuthModal() { setIsAuthModalOpen(true) }

    function handleOk() { setIsAuthModalOpen(false) }

    const tabItems: TabsProps['items'] = [
        {
            key: 'profile',
            label: 'Настройки профиля',
            children: <div className={styles.settings}>
                <div>
                    <label>Отображаемое имя</label>
                    <Input type="text" maxLength={25} value={name} onChange={changeName}></Input>
                </div>

                <div>
                    <label>О себе</label>
                    <TextArea rows={2} maxLength={150} value={description} onChange={changeDescription} style={{ resize: 'none' }}></TextArea>
                </div>

                <div>
                    <label>Email</label>
                    <Input type="text" value={email} onChange={changeEmail}></Input>
                </div>

                <div className={styles.buttons}>
                    <Button type="primary" onClick={saveUser}>Сохранить</Button>
                    {
                        isAuth &&
                        <Button onClick={logout} danger type="primary">Выйти</Button>
                    }
                </div>
            </div>
        },
        {
            key: 'posts',
            label: 'Мои посты',
            children: <div className={styles.feed}>

                {
                    posts.map((p, index) => (
                        <Link key={p.id} to={`/post/${p.id}`} className={styles.postLink}>
                            <Card
                                bodyStyle={{ padding: 18 }}
                                className={styles.post}
                                key={index}
                            >
                                <div className={styles.headerContainer}>
                                    <p>{p.title}</p>
                                </div>
                                {
                                    p.image != null &&
                                    <div className={styles.imageContainer}>
                                        <Image preview={false} src={process.env.REACT_APP_API_URL + p.image} />
                                    </div>
                                }
                                <p>{p.content}</p>
                            </Card>
                        </Link>
                    ))
                }
            </div>
        },
    ]

    return (
        <div className={styles.profileContent}>
            {contextHolder}
            {
                !props.user
                    ? <>
                        <Button type="link" onClick={showAuthModal} size="large" className={styles.modalButton}>
                            Авторизируйтесь чтобы попасть на свой аккаунт
                        </Button>
                    </>
                    :
                    <Tabs defaultActiveKey="1" items={tabItems} onChange={changeTabs} />
            }
            <AuthModal isOpenModal={isAuthModalOpen} handleOk={handleOk} />
        </div>
    )
}