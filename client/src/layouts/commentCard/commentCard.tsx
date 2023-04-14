import { Avatar, Card } from "antd";
import { isYesterday } from "date-fns";
import { useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { IComment } from "../../domain/comment/comment";
import CommentProvider from "../../domain/comment/commentProvider";
import { ProfileLink } from "../../domain/links/links";
import useUserStore from "../../domain/user/userStore";
import { dateFormat, hoursToday, shortDateFormat } from "../../tools/date/dateExtensions";
import { AuthModal } from "../user/auth/authModal";
import styles from './commentCard.module.scss';

export interface IProps {
    comment: IComment
    isCardStyle: boolean
}

export function CommentCard(props: IProps) {

    const user = useUserStore(state => state.user)

    const [likes, setLikes] = useState<string[]>(props.comment.usersLiked)
    const [likesCount, setLikesCount] = useState<number>(props.comment.usersLiked.length)

    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const navigateTo = useNavigate()

    async function changeLike() {
        if (user) {
            const comment = await CommentProvider.likeComment(props.comment.id, user.id)
            if (comment.data.usersLiked.filter(u => u == user.id).length > 0)
                setLikesCount(prev => prev + 1)
            else
                setLikesCount(prev => prev - 1)

            setLikes(comment.data.usersLiked)
        }
        else {
            setIsAuthModalOpen(true)
        }
    }

    return (
        <Card className={styles.card}>
            <div className={styles.commentCard}>
                <div className={styles.header}>
                    {props.comment.userAvatarPath !== null &&
                        <Avatar src={process.env.REACT_APP_API_URL + props.comment.userAvatarPath} size={40} />
                    }
                    <div className={styles.author}>
                        <Link to={ProfileLink.replace(':id', props.comment.userId)} className={styles.authorName}>{props.comment.userName}</Link>
                        <p className={styles.date}>
                            {
                                dateFormat(new Date(props.comment.createdDateTime)) == dateFormat(new Date())
                                    ? hoursToday(new Date(props.comment.createdDateTime))
                                    : isYesterday(new Date(props.comment.createdDateTime))
                                        ? "Вчера"
                                        : shortDateFormat(new Date(props.comment.createdDateTime))
                            }
                        </p>
                    </div>
                </div>
                <div className={styles.content}>
                    {props.comment.text}
                </div>
                <div className={styles.footer}>
                    <div className={styles.likeContainer} onClick={changeLike}>
                        {
                            user == null
                                ? <AiOutlineHeart size={26} className={styles.likeIcon} />
                                : likes.filter(u => u == user.id).length == 0
                                    ? <AiOutlineHeart size={26} className={styles.likeIcon} />
                                    : <AiFillHeart size={26} className={styles.activeLikeIcon} />
                        }
                        <span className={styles.likeCount}>{likesCount}</span>
                    </div>
                </div>
                <AuthModal isOpenModal={isAuthModalOpen} handleOk={() => setIsAuthModalOpen(false)} />
            </div>
        </Card>
    )
}