import { PictureOutlined } from '@ant-design/icons';
import { Button, Input, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { BsFillTrashFill } from "react-icons/bs";
import { useNavigate, useParams } from 'react-router-dom';
import { ProfileLink } from '../../../domain/links/links';
import UserProvider from "../../../domain/user/userProvider";
import useUserStore from "../../../domain/user/userStore";
import { NotAuthorizedPage } from '../../errorPages/notAuthorizedPage/notAuthorizedPage';
import styles from './settings.module.scss';

export function Settings() {
    const { id } = useParams<string>();

    const ref = useRef<HTMLInputElement>(null);

    const [messageApi, contextHolder] = message.useMessage();

    const [user, setUser, logout, checkAuth] = useUserStore(state => [state.user, state.setUser, state.logout, state.checkAuth])

    const [name, setName] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [email, setEmail] = useState<string>('')

    const [avatar, setAvatar] = useState<File | null>(null)
    const [imageSrc, setImageSrc] = useState<string>('');

    const navigateTo = useNavigate()

    useEffect(() => {
        if (user != null && id != null && user.id == id) {
            setName(user.name)
            setDescription(user.description)
            setEmail(user.email)
            setImageSrc(user.avatar ?? "")
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

    async function saveChanges() {
        await saveUser()
        setUser(user!)
        navigateTo(ProfileLink.replace(':id', user!.id))
    }

    return (
        <div className={styles.content}>
            {
                user != null && id != null && user.id == id ?
                    <div className={styles.settings}>
                        {contextHolder}
                        <div className={styles.avatar}>
                            {
                                !imageSrc &&
                                <div className={styles.imageInput}>
                                    <label htmlFor="file-upload">
                                        <p><PictureOutlined /> Загрузить картинку</p>
                                    </label>
                                    <input id="file-upload" style={{ display: 'none' }} type="file" accept='.jpg, .jpeg, .png'
                                        onChange={e => uploadPicture(e)} ref={ref} />
                                </div>
                            }
                            {
                                imageSrc &&
                                <div className={styles.imageContainer}>
                                    <div className={styles.picture}>
                                        <img src={avatar != null ? imageSrc : process.env.REACT_APP_API_URL + imageSrc} width={250} height={250} />
                                    </div>
                                    <Button className={styles.deleteButton} icon={<BsFillTrashFill />} danger type='default' size='large' onClick={deleteImage} />
                                </div>
                            }
                        </div>

                        <div className={styles.textInputs}>
                            <div>
                                <p>Отображаемое имя</p>
                                <Input type="text" maxLength={25} value={name} size='large' onChange={(event) => setName(event.target.value)}></Input>
                            </div>

                            <div>
                                <p>О себе</p>
                                <TextArea rows={2} maxLength={150} value={description} onChange={(event) => setDescription(event.target.value)}
                                    style={{ resize: 'none' }} size='large'></TextArea>
                            </div>

                            <div>
                                <p>Email</p>
                                <Input type="text" value={email} size='large' onChange={(event) => setEmail(event.target.value)}></Input>
                            </div>

                            <div className={styles.buttons}>
                                <Button type="primary" size='large' onClick={saveChanges}>Сохранить</Button>
                            </div>
                        </div>
                    </div>

                    : <NotAuthorizedPage />
            }
        </div>
    )
}