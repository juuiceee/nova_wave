import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IPost } from "../../domain/post/post";
import PostProvider from "../../domain/post/postProvider";
import { PostCard } from "../postCard/postCard";
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
                <div className={styles.postContainer}>
                    <PostCard post={post} needLink={false} previewImage hoverable={false} />
                </div>
            }
        </div>
    )
}