import { Button, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TrendsLink } from "../../domain/links/links";
import PostProvider from "../../domain/post/postProvider";
import { IUser } from "../../domain/user/user";
import styles from './postCreator.module.scss';

interface IProps {
    user: IUser | null
}

export function PostCreator(props: IProps) {

    const textAreaTitle = useRef<any>(null)
    const textAreaContent = useRef<any>(null)

    const [title, setTitle] = useState<string>('')
    const [content, setContent] = useState<string>('')

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
    }

    async function createPost() {
        if (props.user)
            try {
                await PostProvider.create({ content, image: null, title, userId: props.user?.id })
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