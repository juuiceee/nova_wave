import { Card } from "antd"
import { useEffect, useRef, useState } from "react"
import { IPost } from "../../domain/post/post"
import PostProvider from "../../domain/post/postProvider"
import styles from './newsFeed.module.scss'

export function NewsFeed() {

    const [posts, setPosts] = useState<IPost[]>([])
    const currentPage = useRef(1)
    const totalCount = useRef(0)

    useEffect(() => {
        (async () => {
            const p = await PostProvider.getLimitPosts(10, currentPage.current - 1)
            setPosts(p.data.rows)
            totalCount.current = p.data.count
        })()
    }, [])


    useEffect(() => {
        document.addEventListener('scroll', scrollHandler)

        return function () {
            document.removeEventListener('scroll', scrollHandler)
        }
    }, [])

    async function scrollHandler() {
        if (currentPage.current * 10 >= totalCount.current) {
            document.removeEventListener('scroll', scrollHandler)
            return
        }

        const scrollHeight = document.documentElement.scrollHeight
        const scrollTop = document.documentElement.scrollTop
        const innerHeight = window.innerHeight

        if (scrollHeight - (scrollTop + innerHeight) < 100) {
            const response = await PostProvider.getLimitPosts(10, currentPage.current)
            setPosts(prevState => [...prevState, ...response.data.rows])
            currentPage.current++
        }
    }

    return (
        <>
            <div className={styles.feed}>
                {
                    posts.map((p, index) => (
                        <Card className={styles.post} key={index}>
                            <h3>{p.title}</h3>
                            <p>{p.content}</p>
                        </Card>
                    ))
                }
            </div>
        </>
    )
}