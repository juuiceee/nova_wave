import { Column, DataType, Model, Table } from "sequelize-typescript";
import * as uuid from 'uuid';

interface CommentCreationAttribute {
    id: uuid;
    postId: uuid;
    userId: uuid;
    userName: string;
    userAvatarPath: string;
    text: string;
    usersLiked: uuid[];
    isRemoved: boolean;
    createdDateTime: Date;
    updatedDateTime: Date;
}

@Table({ tableName: 'comments', createdAt: false, updatedAt: false })
export class Comment extends Model<Comment, CommentCreationAttribute>{

    @Column({ type: DataType.UUID, unique: true, primaryKey: true })
    id: uuid;

    @Column({ type: DataType.UUID, allowNull: false, references: { model: 'posts', key: 'id' } })
    postId: uuid;

    @Column({ type: DataType.UUID, allowNull: false, references: { model: 'users', key: 'id' } })
    userId: uuid;

    @Column({ type: DataType.STRING, allowNull: false })
    userName: string;

    @Column({ type: DataType.STRING })
    userAvatarPath: string;

    @Column({ type: DataType.STRING, allowNull: false })
    text: string;

    @Column({ type: DataType.ARRAY(DataType.UUID), defaultValue: [], allowNull: false })
    usersLiked: uuid[];

    @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
    isRemoved: boolean;

    @Column({ type: DataType.DATE, allowNull: false })
    createdDateTime: Date;

    @Column({ type: DataType.DATE })
    updatedDateTime: Date;
}