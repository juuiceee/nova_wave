import { SettingOutlined } from '@ant-design/icons'
import { Button } from "antd"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from 'react-router-dom'
import { ProfileSettingsLink } from '../../../domain/links/links'
import { IPost } from "../../../domain/post/post"
import PostProvider from "../../../domain/post/postProvider"
import { IUser } from '../../../domain/user/user'
import UserProvider from '../../../domain/user/userProvider'
import useUserStore from '../../../domain/user/userStore'
import { NotFoundPage } from '../../errorPages/notFoundPage/notFoundPage'
import { PostCard } from '../../postCard/postCard'
import { AuthModal } from "../auth/authModal"
import styles from './profile.module.scss'

export function Profile() {
    const { id } = useParams<string>();

    const [user] = useUserStore(state => [state.user])

    const [profileUser, setProfileUser] = useState<IUser | null>(null)

    const [posts, setPosts] = useState<IPost[]>([])
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const navigateTo = useNavigate()

    useEffect(() => {
        if (id != null) {
            (async () => {
                const response = await UserProvider.getUserById(id!)
                setProfileUser(response.data)
                getPostPaged()
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
                                    : <div className={styles.feed}>
                                        {
                                            posts.map((p, index) => (
                                                <PostCard post={p} needLink previewImage={false} key={index}
                                                    isEditable={user != null && user.id == id} refreshPage={getPostPaged} hoverable elipsis />
                                            ))
                                        }
                                    </div>

                            }
                        </div>
                    </>
            }
            <AuthModal isOpenModal={isAuthModalOpen} handleOk={() => setIsAuthModalOpen(false)} />
        </div >
    )
}