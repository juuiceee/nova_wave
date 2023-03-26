import { PictureOutlined } from '@ant-design/icons'
import { Button, Image, Input, message, Tabs, TabsProps } from "antd"
import TextArea from "antd/es/input/TextArea"
import { ChangeEvent, useEffect, useRef, useState } from "react"
import { BsFillTrashFill } from 'react-icons/bs'
import { IPost } from "../../../domain/post/post"
import PostProvider from "../../../domain/post/postProvider"
import UserProvider from "../../../domain/user/userProvider"
import useUserStore from "../../../domain/user/userStore"
import { PostCard } from '../../postCard/postCard'
import { AuthModal } from "../auth/authModal"
import styles from './profile.module.scss'


export function Profile() {
    const user = useUserStore(state => state.user)

    const ref = useRef<HTMLInputElement>(null);

    const [messageApi, contextHolder] = message.useMessage();

    const [isAuth, setUser, logout, checkAuth] = useUserStore(state => [state.isAuth, state.setUser, state.logout, state.checkAuth])

    const [name, setName] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [posts, setPosts] = useState<IPost[]>([])

    const [avatar, setAvatar] = useState<File | null>(null)
    const [imageSrc, setImageSrc] = useState<string>('');

    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    useEffect(() => {
        if (user != null) {
            setName(user.name)
            setDescription(user.description)
            setEmail(user.email)
            setImageSrc(user.avatar ? user.avatar : "")
        }
    }, [user])

    async function saveUser() {
        if (user != null)
            try {
                const formData = new FormData()
                formData.append('id', user.id)
                formData.append('name', name)
                formData.append('description', description)
                formData.append('email', email)
                formData.append('avatarSrc', imageSrc)
                if (avatar != null)
                    formData.append('avatar', avatar)

                const response = await UserProvider.save(formData)

                setUser(response.data)
                checkAuth()
                setAvatar(null)
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
        if (key == 'posts' && posts.length == 0) //изменить логику, по которой идет запрос на получение постов
            getPostPaged()
    }

    async function getPostPaged() {
        if (user != null) {
            const postPaged = await PostProvider.getPostsByUserId(user.id)
            setPosts(postPaged.data.rows)
        }
    }

    function uploadPicture(e: ChangeEvent<HTMLInputElement>) {
        if (!e.target.files?.length) return;

        if (!['jpg', 'jpeg', 'png'].some(a => e.target.files![0].type.includes(a)))
            return messageApi.open({
                type: 'error',
                content: "Неверный тип файла",
                duration: 3
            })

        const file = e.target.files[0]
        setAvatar(file)

        const src = URL.createObjectURL(file);
        setImageSrc(src)
    }

    function deleteImage() {
        setAvatar(null)
        setImageSrc("");
        if (!ref.current) return;
        ref.current.value = "";
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
            children:
                <div className={styles.settings}>
                    <div className={styles.avatar}>
                        {
                            !imageSrc &&
                            <div className={styles.imageInput}>
                                <label htmlFor="file-upload">
                                    <p><PictureOutlined /> Загрузить картинку</p>
                                </label>
                                <input id="file-upload" style={{ display: 'none' }} type="file" accept='.jpg, .jpeg, .png' onChange={e => uploadPicture(e)} ref={ref} />
                            </div>
                        }
                        {
                            imageSrc &&
                            <div className={styles.imageContainer}>
                                <div className={styles.picture}>
                                    <Image src={avatar != null ? imageSrc : process.env.REACT_APP_API_URL + imageSrc} preview={false} />
                                </div>
                                <Button className={styles.deleteButton} icon={<BsFillTrashFill />} danger type='default' onClick={deleteImage} />
                            </div>
                        }
                    </div>

                    <div className={styles.textInputs}>
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
                </div>
        },
        {
            key: 'posts',
            label: 'Мои посты',
            children:
                <div className={styles.feed}>
                    {
                        posts.map((p, index) => (
                            <div className={styles.post}>
                                <PostCard post={p} needLink previewImage={false} key={index} isEditable refreshPage={getPostPaged} hoverable />
                            </div>
                        ))
                    }
                </div>
        },
    ]

    return (
        <div className={styles.profileContent}>
            {contextHolder}
            {
                user == null
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