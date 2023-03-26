import { useEffect, useRef, useState } from "react"
import { IPost } from "../../domain/post/post"
import PostProvider from "../../domain/post/postProvider"
import { EmptyPosts } from "../emptyPosts/emptyPosts"
import { PostCard } from "../postCard/postCard"
import styles from './trendFeed.module.scss'

export function TrendFeed() {

    const limit = 10;
    const [posts, setPosts] = useState<IPost[]>([])
    const currentPage = useRef(1)
    const totalCount = useRef(0)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        (async () => {
            setIsLoading(true)
            const postPaged = await PostProvider.getLimitPostsByLikes(limit, currentPage.current - 1)
            setPosts(postPaged.data.rows)
            totalCount.current = postPaged.data.count
            setIsLoading(false)
        })()
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

        if (scrollHeight - (scrollTop + innerHeight) < 100) {
            const response = await PostProvider.getLimitPostsByLikes(limit, currentPage.current)
            setPosts(prevState => [...prevState, ...response.data.rows])
            currentPage.current++
        }
    }

    return (
        <>
            {
                isLoading
                    ? <></>
                    : posts.length != 0
                        ? <div className={styles.feed}>
                            {
                                posts.map((p, index) => (
                                    <PostCard post={p} needLink previewImage={false} key={index} hoverable elipsis />
                                ))
                            }
                        </div>
                        : <EmptyPosts message="Здесь еще нет постов. Создайте их первым!" />
            }
        </>
    )
}