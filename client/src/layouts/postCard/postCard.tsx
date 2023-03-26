import { EditOutlined, SmallDashOutlined } from '@ant-design/icons';
import { Button, Card, Image, Popover, Typography } from "antd";
import Avatar from "antd/es/avatar/avatar";
import useModal from 'antd/es/modal/useModal';
import Title from "antd/es/typography/Title";
import { isYesterday } from 'date-fns';
import { useState } from "react";
import { AiFillHeart, AiFillStar, AiOutlineHeart, AiOutlineStar } from "react-icons/ai";
import { BsFillTrashFill } from 'react-icons/bs';
import { Link, useNavigate } from "react-router-dom";
import { PostEditor, PostLink } from '../../domain/links/links';
import { IPost } from "../../domain/post/post";
import PostProvider from "../../domain/post/postProvider";
import UserProvider from "../../domain/user/userProvider";
import useUserStore from "../../domain/user/userStore";
import { dateFormat, hoursToday, shortDateFormat } from '../../tools/date/dateExtensions';
import { AuthModal } from '../user/auth/authModal';
import styles from "./postCard.module.scss";

interface IProps {
    post: IPost;
    needLink: boolean;
    previewImage: boolean;
    hoverable: boolean
    isEditable?: boolean;
    refreshPage?: () => Promise<void>;
}

export function PostCard(props: IProps) {
    const [user, setUser] = useUserStore(state => [state.user, state.setUser])

    const [likes, setLikes] = useState<string[]>(props.post.usersLiked)
    const [likesCount, setLikesCount] = useState<number>(props.post.usersLiked.length)

    const [modal, contextHolder] = useModal();
    const [openPopover, setOpenPopover] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const navigateTo = useNavigate()

    async function changeLike() {
        if (user) {
            const post = await PostProvider.likePost(user.id, props.post.id)
            if (post.data.usersLiked.filter(u => u == user.id).length > 0)
                setLikesCount(prev => prev + 1)
            else
                setLikesCount(prev => prev - 1)

            setLikes(post.data.usersLiked)
        }
        else {
            setIsAuthModalOpen(true)
        }
    }

    async function changeFavorite() {
        if (user) {
            const userResponse = await UserProvider.setFavoritePost(user.id, props.post.id)
            setUser(userResponse.data)
        }
        else {
            setIsAuthModalOpen(true)
        }
    }

    async function deletePost() {
        setOpenPopover(false);
        modal.confirm({
            content: (
                <>
                    Вы уверены что хотите удалить пост?
                </>
            ),
            okText: 'Да',
            okType: 'danger',
            cancelText: 'Нет',
            async onOk() {
                await PostProvider.deletePost(props.post.id)

                if (props.refreshPage != null)
                    await props.refreshPage()
            }
        })
    }

    function editPost() {
        navigateTo(PostEditor.replace(':id', props.post.id))
    }

    const popoverContent = (
        <div className={styles.popoverContent} onClick={e => e.stopPropagation()}>
            <Button
                type='text'
                danger
                size='small'
                icon={<BsFillTrashFill style={{ marginRight: 8 }} />}
                className={styles.button}
                onClick={deletePost}>
                Удалить
            </Button>
            <Button
                type='link'
                size='small'
                icon={<EditOutlined />}
                className={styles.button}
                onClick={editPost}>
                Редактировать
            </Button>
            {contextHolder}
        </div>
    )

    return (
        <Card bodyStyle={{ padding: 18 }} className={props.hoverable ? styles.post : styles.postWithoutShadow} bordered={false}>
            <div className={styles.link}>
                <div className={styles.meta}>
                    <div className={styles.author}>
                        <Avatar src={process.env.REACT_APP_API_URL + props.post.authorAvatar} />
                        <p className={styles.authorName}>{props.post.authorName}</p>
                        <p className={styles.date}>
                            {
                                dateFormat(new Date(props.post.createdDateTime)) == dateFormat(new Date())
                                    ? hoursToday(new Date(props.post.createdDateTime))
                                    : isYesterday(new Date(props.post.createdDateTime))
                                        ? "Вчера"
                                        : shortDateFormat(new Date(props.post.createdDateTime))
                            }
                        </p>
                    </div>

                    {
                        props.isEditable &&
                        <Popover
                            trigger="click"
                            placement="bottom"
                            content={popoverContent}
                            className={styles.popover}
                            open={openPopover}
                            onOpenChange={() => setOpenPopover(!openPopover)}
                        >
                            <SmallDashOutlined />
                        </Popover>
                    }
                </div>
                {
                    props.needLink
                        ?
                        <Link key={props.post.id} to={PostLink.replace(':id', props.post.id)}>
                            {
                                props.post.title != "" &&
                                <Title level={3} >
                                    {props.post.title}
                                </Title>
                            }
                            {
                                props.post.image != null &&
                                <div className={styles.imageContainer}>
                                    <Image preview={false} src={process.env.REACT_APP_API_URL + props.post.image} />
                                </div>
                            }
                            <Typography.Paragraph ellipsis={{ rows: 5 }}>
                                {props.post.content}
                            </Typography.Paragraph>
                        </Link>
                        :
                        <div className={styles.link}>
                            {
                                props.post.title != "" &&
                                <Title level={3} >
                                    {props.post.title}
                                </Title>
                            }
                            {
                                props.post.image != null &&
                                <div className={styles.imageContainer}>
                                    <Image preview={props.previewImage} src={process.env.REACT_APP_API_URL + props.post.image} />
                                </div>
                            }
                            <Typography.Paragraph ellipsis={{ rows: 5 }}>
                                {props.post.content}
                            </Typography.Paragraph>
                        </div>
                }

                <div className={styles.bottomContainer}>
                    <div className={styles.likeContainer} onClick={changeLike}>
                        {
                            user == null
                                ? <AiOutlineHeart size={24} className={styles.likeIcon} />
                                : likes.filter(u => u == user.id).length == 0
                                    ? <AiOutlineHeart size={24} className={styles.likeIcon} />
                                    : <AiFillHeart size={24} className={styles.activeLikeIcon} />
                        }
                        <span className={styles.likeCount}>{likesCount}</span>
                    </div>
                    <div className={styles.favoriteContainer} onClick={changeFavorite}>
                        {
                            user == null
                                ? <AiOutlineStar size={24} className={styles.favoriteIcon} />
                                : user.favouritePosts.filter(p => p == props.post.id).length == 0
                                    ? <AiOutlineStar size={24} className={styles.favoriteIcon} />
                                    : <AiFillStar size={24} className={styles.activeFavoriteIcon} />
                        }
                    </div>
                </div>
            </div>
            <AuthModal isOpenModal={isAuthModalOpen} handleOk={() => setIsAuthModalOpen(false)} />
        </Card>
    )
}