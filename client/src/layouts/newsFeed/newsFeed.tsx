import { Card, Image } from "antd"
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
                        <Card bodyStyle={{ padding: 18 }} className={styles.post} key={index}>
                            <div className={styles.headerContainer}>
                                <p>{p.title}</p>
                            </div>
                            {
                                p.image != null &&
                                <div className={styles.imageContainer}>
                                    <Image preview={false} width={250} height={250} src={process.env.REACT_APP_API_URL + p.image} />
                                </div>
                            }
                            <p>{p.content}</p>
                        </Card>
                    ))
                }
            </div>
        </>
    )
}