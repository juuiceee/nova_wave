import { Card, Image, Typography } from "antd"
import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { IPost } from "../../domain/post/post"
import PostProvider from "../../domain/post/postProvider"
import styles from './newsFeed.module.scss'

export function NewsFeed() {

    const limit = 10;
    const [posts, setPosts] = useState<IPost[]>([])
    const currentPage = useRef(1)
    const totalCount = useRef(0)

    useEffect(() => {
        (async () => {
            const postPaged = await PostProvider.getLimitPosts(limit, currentPage.current - 1)
            setPosts(postPaged.data.rows)
            totalCount.current = postPaged.data.count
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
            const response = await PostProvider.getLimitPosts(limit, currentPage.current)
            setPosts(prevState => [...prevState, ...response.data.rows])
            currentPage.current++
        }
    }

    return (
        <>
            <div className={styles.feed}>
                {
                    posts.map((p, index) => (
                        <Link key={p.id} to={`/post/${p.id}`}>
                            <Card bodyStyle={{ padding: 18 }} className={styles.post} key={index}>
                                <div className={styles.headerContainer}>
                                    <p>{p.title}</p>
                                </div>
                                {
                                    p.image != null &&
                                    <div className={styles.imageContainer}>
                                        <Image preview={false} src={process.env.REACT_APP_API_URL + p.image} />
                                    </div>
                                }
                                <Typography.Paragraph ellipsis={{ rows: 5 }}>
                                    {p.content}
                                </Typography.Paragraph>
                            </Card>
                        </Link>
                    ))
                }
            </div>
        </>
    )
}