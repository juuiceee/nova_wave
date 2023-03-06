import { PictureOutlined } from '@ant-design/icons';
import { Button, Image, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import { ChangeEvent, useRef, useState } from "react";
import { BsFillTrashFill } from 'react-icons/bs';
import { useNavigate } from "react-router-dom";
import { TrendsLink } from "../../domain/links/links";
import PostProvider from "../../domain/post/postProvider";
import { IUser } from "../../domain/user/user";
import styles from './postCreator.module.scss';

interface IProps {
    user: IUser | null
}

export function PostCreator(props: IProps) {
    const ref = useRef<HTMLInputElement>(null);

    const textAreaTitle = useRef<any>(null)
    const textAreaContent = useRef<any>(null)

    const [title, setTitle] = useState<string>('')
    const [content, setContent] = useState<string>('')
    const [image, setImage] = useState<File | null>(null)
    const [imageSrc, setImageSrc] = useState('');

    const [messageApi, contextHolder] = message.useMessage();
    const navigateTo = useNavigate()

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
        setImageSrc("");
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

        if (props.user)
            try {
                const formData = new FormData()
                formData.append('title', title)
                formData.append('content', content)
                formData.append('userId', props.user.id)
                if (image)
                    formData.append('image', image)

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
                            <Image src={imageSrc} />
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
                    Опубликовать
                </Button>
            </div>
        </div>
    )
}