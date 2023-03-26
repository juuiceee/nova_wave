import { PictureOutlined } from '@ant-design/icons';
import { Button, Image, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { BsFillTrashFill } from 'react-icons/bs';
import { useNavigate, useParams } from "react-router-dom";
import { ProfileLink, TrendsLink } from "../../domain/links/links";
import PostProvider from "../../domain/post/postProvider";
import useUserStore from '../../domain/user/userStore';
import { NotAuthorizedPage } from '../errorPages/notAuthorizedPage/notAuthorizedPage';
import styles from './postCreator.module.scss';

export function PostCreator() {
    const { id } = useParams<string>();

    const ref = useRef<HTMLInputElement>(null);

    const textAreaTitle = useRef<any>(null)
    const textAreaContent = useRef<any>(null)

    const user = useUserStore(state => state.user)

    const [title, setTitle] = useState<string>('')
    const [content, setContent] = useState<string>('')
    const [image, setImage] = useState<File | null>(null)
    const [imageSrc, setImageSrc] = useState<string | null>(null);

    const [messageApi, contextHolder] = message.useMessage();
    const navigateTo = useNavigate()

    useEffect(() => {
        if (user != null && id != '0' && id != null) {
            (async () => {
                const response = await PostProvider.getPostById(id)
                setTitle(response.data.title)
                setContent(response.data.content)

                if (response.data.image != null)
                    setImageSrc(response.data.image)
            })()
        }
    }, [])

    function keyUpTitle(event: React.KeyboardEvent<HTMLTextAreaElement>) {
        textAreaTitle.current!.resizableTextArea.textArea.style.height = `auto`
        let scHeight = event.currentTarget.scrollHeight
        textAreaTitle.current!.resizableTextArea.textArea.style.height = `${scHeight}px`
    }

    function keyUpContent(event: React.KeyboardEvent<HTMLTextAreaElement>) {
        textAreaContent.current!.resizableTextArea.textArea.style.height = `auto`
        let scHeight = event.currentTarget.scrollHeight
        textAreaContent.current!.resizableTextArea.textArea.style.height = `${scHeight}px`
        window.scrollTo(0, scHeight);
    }

    function uploadPicture(e: ChangeEvent<HTMLInputElement>) {
        if (!e.target.files?.length) return;

        if (!e.target.files[0].type.includes('image'))
            return messageApi.open({
                type: 'error',
                content: "Неверный тип файла",
                duration: 3
            })

        const file = e.target.files[0]
        setImage(file)

        const src = URL.createObjectURL(file);
        setImageSrc(src)
    }

    function deleteImage() {
        setImage(null)
        setImageSrc(null);
        if (!ref.current) return;
        ref.current.value = "";
    }

    async function createPost() {
        if (content == "")
            return messageApi.open({
                type: 'error',
                content: "Напишите текст",
                duration: 3
            })

        if (user != null)
            try {
                const formData = new FormData()
                formData.append('title', title)
                formData.append('content', content)
                formData.append('userId', user.id)

                if (image)
                    formData.append('image', image)

                if (id != '0' && id != null) {
                    formData.append('id', id)

                    if (imageSrc != null)
                        formData.append('imageSrc', imageSrc)

                    await PostProvider.edit(formData)
                    return navigateTo(ProfileLink)
                }

                await PostProvider.create(formData);
                navigateTo(TrendsLink)

            } catch (e: any) {
                messageApi.open({
                    type: 'error',
                    content: e.response.data.message,
                    duration: 3
                })
            }
    }

    return (
        <>
            {
                user != null ?
                    <div className={styles.content}>
                        {contextHolder}
                        <div className={styles.editor}>
                            <TextArea
                                id="title"
                                className={styles.title}
                                ref={textAreaTitle}
                                placeholder="Заголовок"
                                value={title}
                                bordered={false}
                                size='large'
                                maxLength={100}
                                onKeyUp={keyUpTitle}
                                onChange={e => setTitle(e.target.value)}
                            />

                            {
                                !imageSrc &&
                                <div className={styles.imageInput}>
                                    <label htmlFor="file-upload">
                                        <p><PictureOutlined /> Загрузить картинку</p>
                                    </label>
                                    <input id="file-upload" style={{ display: 'none' }} type="file" accept='image/*' onChange={e => uploadPicture(e)} ref={ref} />
                                </div>
                            }
                            {
                                imageSrc &&
                                <div className={styles.imageContainer}>
                                    <div className={styles.picture}>
                                        <Image src={image != null ? imageSrc : process.env.REACT_APP_API_URL + imageSrc} />
                                    </div>
                                    <Button className={styles.deleteButton} icon={<BsFillTrashFill />} danger type='default' onClick={deleteImage}>Удалить</Button>
                                </div>
                            }

                            <TextArea
                                id="text"
                                className={styles.text}
                                ref={textAreaContent}
                                placeholder="Ваш текст"
                                value={content}
                                bordered={false}
                                onKeyUp={keyUpContent}
                                onChange={e => setContent(e.target.value)}
                            />
                        </div>

                        <div className={styles.footer}>
                            <Button type="primary" onClick={createPost}>
                                {id != '0' ? "Сохранить" : "Опубликовать"}
                            </Button>
                        </div>
                    </div>
                    : <NotAuthorizedPage />
            }
        </>
    )
}