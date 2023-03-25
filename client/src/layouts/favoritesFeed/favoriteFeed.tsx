import { useEffect, useRef, useState } from "react";
import { IPost } from "../../domain/post/post";
import PostProvider from "../../domain/post/postProvider";
import useUserStore from "../../domain/user/userStore";
import { PostCard } from "../postCard/postCard";
import styles from './favoriteFeed.module.scss';

export function FavoriteFeed() {
    const [user] = useUserStore(state => [state.user])

    const limit = 10;
    const [posts, setPosts] = useState<IPost[]>([])
    const currentPage = useRef(1)
    const totalCount = useRef(0)

    useEffect(() => {
        if (user) {
            (async () => {
                const postPaged = await PostProvider.getFavouritePosts(user.id, limit, currentPage.current - 1)
                setPosts(postPaged.data.rows)
                totalCount.current = postPaged.data.count
            })()
        }
    }, [])


    useEffect(() => {
        document.addEventListener('scroll', scrollHandler)

        return function () {
            document.removeEventListener('scroll', scrollHandler)
        }
    }, [])

    async function scrollHandler() {
        if (currentPage.current * limit >= totalCount.current) {
            document.removeEventListener('scroll', scrollHandler)
            return
        }

        const scrollHeight = document.documentElement.scrollHeight
        const scrollTop = document.documentElement.scrollTop
        const innerHeight = window.innerHeight

        if (scrollHeight - (scrollTop + innerHeight) < 100 && user) {
            const response = await PostProvider.getFavouritePosts(user.id, limit, currentPage.current - 1)
            setPosts(prevState => [...prevState, ...response.data.rows])
            currentPage.current++
        }
    }

    return (
        <>
            {
                posts.length > 0 &&
                <div className={styles.feed}>

                    {
                        posts.map((p, index) => (
                            <PostCard post={p} needLink previewImage={false} key={index} hoverable />
                        ))
                    }
                </div>
            }
        </>
    )
}