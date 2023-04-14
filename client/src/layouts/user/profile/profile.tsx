import { SettingOutlined } from '@ant-design/icons'
import { Button, Tabs, TabsProps } from "antd"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from 'react-router-dom'
import { IComment } from '../../../domain/comment/comment'
import CommentProvider from '../../../domain/comment/commentProvider'
import { PostEditor, ProfileSettingsLink } from '../../../domain/links/links'
import { IPost } from "../../../domain/post/post"
import PostProvider from "../../../domain/post/postProvider"
import { IUser } from '../../../domain/user/user'
import UserProvider from '../../../domain/user/userProvider'
import useUserStore from '../../../domain/user/userStore'
import { CommentCard } from '../../commentCard/commentCard'
import { NotFoundPage } from '../../errorPages/notFoundPage/notFoundPage'
import { PostCard } from '../../postCard/postCard'
import { AuthModal } from "../auth/authModal"
import styles from './profile.module.scss'

export function Profile() {
    const { id } = useParams<string>();

    const [user] = useUserStore(state => [state.user])

    const [profileUser, setProfileUser] = useState<IUser | null>(null)

    const [posts, setPosts] = useState<IPost[]>([])
    const [comments, setComments] = useState<IComment[]>([])
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const navigateTo = useNavigate()

    useEffect(() => {
        if (id != null) {
            (async () => {
                const response = await UserProvider.getUserById(id)
                setProfileUser(response.data)
                getPostPaged()
                getComments()
            })()
        }
    }, [id])

    async function getPostPaged() {
        if (id != null) {
            setIsLoading(true)
            const postPaged = await PostProvider.getPostsByUserId(id)
            setPosts(postPaged.data.rows)
            setIsLoading(false)
        }
    }

    async function getComments() {
        if (id != null) {
            setIsLoading(true)
            const comments = await CommentProvider.getCommentsByUserId(id)
            setComments(comments.data)
            setIsLoading(false)
        }
    }

    const tabItems: TabsProps['items'] = [
        {
            key: 'posts',
            label: 'Статьи',
            children:
                posts.length == 0
                    ?
                    <div className={styles.emptyPosts}>
                        <p>Напишите первую статью, чтобы привлечь читателей в ваш блог</p>
                        <Button size='large' className={styles.createPost} onClick={() => navigateTo(PostEditor.replace(':id', '0'))}>
                            Создать запись
                        </Button>
                    </div>
                    :
                    <div className={styles.feed}>
                        {
                            posts.map((p, index) => (
                                <PostCard post={p} needLink previewImage={false} key={index}
                                    isEditable={user != null && user.id == id} refreshPage={getPostPaged} hoverable elipsis />
                            ))
                        }
                    </div>
        },
        {
            key: 'comments',
            label: 'Комментарии',
            children:
                comments.length == 0
                    ?
                    <div className={styles.emptyPosts}>
                        <p>У вас еще нет комментариев</p>
                    </div>
                    :
                    <div className={styles.feed}>
                        {
                            comments.map((c, index) => (
                                <CommentCard comment={c} isCardStyle key={index} />
                            ))
                        }
                    </div>
        }
    ]

    return (
        <div className={styles.profileContent}>
            {
                profileUser == null || id == null
                    ? <>
                        <NotFoundPage />
                    </>
                    :
                    <>
                        <div className={styles.profile}>
                            <div className={styles.imageAndSettings}>
                                <img src={process.env.REACT_APP_API_URL + profileUser.avatar!} width={120} height={120} />
                                {
                                    user != null && user.id == id &&
                                    <Button icon={<SettingOutlined />} size='large'
                                        onClick={() => navigateTo(ProfileSettingsLink.replace(':id', profileUser.id))} />
                                }
                            </div>
                            <div className={styles.description}>
                                <p className={styles.name}>{profileUser.name}</p>
                                <p>{profileUser.description}</p>
                            </div>
                        </div>

                        <div className={styles.posts}>
                            {
                                isLoading
                                    ? <></>
                                    : <Tabs type='card' items={tabItems} size='large' />
                            }
                        </div>
                    </>
            }
            <AuthModal isOpenModal={isAuthModalOpen} handleOk={() => setIsAuthModalOpen(false)} />
        </div >
    )
}