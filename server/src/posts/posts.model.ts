import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from 'src/users/users.model';
import * as uuid from 'uuid';

interface PostCreationAttribute {
    id: uuid;
    title: string;
    content: string;
    userId: uuid;
    image?: string;
}

@Table({ tableName: 'posts' })
export class Post extends Model<Post, PostCreationAttribute>{

    @Column({ type: DataType.UUID, unique: true, primaryKey: true })
    id: uuid;

    @Column({ type: DataType.STRING, allowNull: false })
    title: string;

    @Column({ type: DataType.TEXT, allowNull: false })
    content: string;

    @Column({ type: DataType.STRING })
    image: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID })
    userId: uuid

    @BelongsTo(() => User)
    author: User
}