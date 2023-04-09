import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from 'src/users/users.model';
import * as uuid from 'uuid';

interface PostCreationAttribute {
    id: uuid;
    title: string | null;
    content: string;
    image: string | null;
    usersLiked: uuid[];
    authorName: string;
    authorAvatar: string;
    userId: uuid;
    isRemoved: boolean;
    createdDateTime: Date;
    updatedDateTime: Date;
}

@Table({ tableName: 'posts', createdAt: false, updatedAt: false })
export class Post extends Model<Post, PostCreationAttribute>{

    @Column({ type: DataType.UUID, unique: true, primaryKey: true })
    id: uuid;

    @Column({ type: DataType.STRING })
    title: string;

    @Column({ type: DataType.TEXT, allowNull: false })
    content: string;

    @Column({ type: DataType.STRING })
    image: string;

    @Column({ type: DataType.ARRAY(DataType.UUID), defaultValue: [], allowNull: false })
    usersLiked: uuid[];

    @Column({ type: DataType.STRING, allowNull: false })
    authorName: string;

    @Column({ type: DataType.STRING })
    authorAvatar: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, allowNull: false })
    userId: uuid

    @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
    isRemoved: boolean;

    @Column({ type: DataType.DATE, allowNull: false })
    createdDateTime: Date;

    @Column({ type: DataType.DATE })
    updatedDateTime: Date;
}