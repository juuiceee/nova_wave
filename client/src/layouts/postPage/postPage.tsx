import { Card, Image } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IPost } from "../../domain/post/post";
import PostProvider from "../../domain/post/postProvider";
import styles from './postPage.module.scss';

export function PostPage() {

    const { id } = useParams<string>();
    const [post, setPost] = useState<IPost | null>(null)

    useEffect(() => {
        if (id) {
            (async () => {
                const response = await PostProvider.getPostById(id)
                setPost(response.data)
            })()
        }
    }, [])

    return (
        <div className={styles.postPage}>
            {
                post &&
                <div>
                    <Card className={styles.postContainer}>
                        <div className={styles.post}>
                            <div className={styles.headerContainer}>
                                <p>{post.title}</p>
                            </div>
                            {
                                post.image != null &&
                                <div className={styles.imageContainer}>
                                    <Image preview={false} src={process.env.REACT_APP_API_URL + post.image} />
                                </div>
                            }
                            <div>
                                <p>{post.content}</p>
                            </div>
                        </div>
                    </Card>
                </div>
            }
        </div>
    )
}