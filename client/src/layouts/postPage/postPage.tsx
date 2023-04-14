import { Button, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IComment } from "../../domain/comment/comment";
import CommentProvider from "../../domain/comment/commentProvider";
import { IPost } from "../../domain/post/post";
import PostProvider from "../../domain/post/postProvider";
import useUserStore from "../../domain/user/userStore";
import { CommentCard } from "../commentCard/commentCard";
import { PostCard } from "../postCard/postCard";
import { AuthModal } from "../user/auth/authModal";
import styles from './postPage.module.scss';

export function PostPage() {

    const { id } = useParams<string>();
    const user = useUserStore(state => state.user)
    const [post, setPost] = useState<IPost | null>(null)
    const [comments, setComments] = useState<IComment[]>([])
    const [comment, setComment] = useState<string | null>(null)

    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        if (id) {
            (async () => {
                const postResponse = await PostProvider.getPostById(id)
                setPost(postResponse.data)

                const commentsResponse = await CommentProvider.getCommentsByPostId(id)
                setComments(commentsResponse.data)
            })()
        }
    }, [id])

    async function createComment() {

        if (id === undefined)
            return

        if (comment === null) {
            return messageApi.open({
                type: 'error',
                content: "Напишите текст комментария",
                duration: 3
            })
        }

        if (user === null)
            return setIsAuthModalOpen(true)

        await CommentProvider.create({
            id: '', postId: id, userId: user.id, userName: user.name, userAvatarPath: user.avatar,
            text: comment, usersLiked: [], createdDateTime: new Date()
        })

        setComment(null);

        const commentsResponse = await CommentProvider.getCommentsByPostId(id)
        setComments(commentsResponse.data)
    }

    return (
        <div className={styles.postPage}>
            {contextHolder}
            <div className={styles.postContainer}>
                {
                    post &&
                    <div className={styles.post}>
                        <PostCard post={post} needLink={false} previewImage hoverable={false} />
                    </div>
                }
            </div>
            <div className={styles.commentsContainer}>
                <div className={styles.createComment}>
                    <TextArea
                        className={styles.commentTextArea}
                        autoSize
                        placeholder="Написать комментарий"
                        value={comment || ''}
                        onChange={e => setComment(e.target.value)}
                    />
                    <div className={styles.createCommentButton}>
                        <Button type="primary" onClick={createComment} disabled={comment === null}> Отправить </Button>
                    </div>
                </div>
                <div className={styles.comments}>
                    {
                        comments.map(c => (
                            <CommentCard isCardStyle={false} comment={c} />
                        ))
                    }
                </div>
            </div>
            <AuthModal isOpenModal={isAuthModalOpen} handleOk={() => setIsAuthModalOpen(false)} />
        </div>
    )
}