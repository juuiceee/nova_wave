import { Column, DataType, Model, Table } from 'sequelize-typescript';
import * as uuid from 'uuid';

interface UserCreationAtribute {
    id: uuid;
    name: string;
    description: string;
    password: string;
    email: string;
    avatar: string;
    favouritePosts: uuid[];
    isRemoved: boolean;
    createdDateTime: Date;
    updatedDateTime: Date;
}

@Table({ tableName: 'users', createdAt: false, updatedAt: false })
export class User extends Model<User, UserCreationAtribute>{

    @Column({ type: DataType.UUID, unique: true, primaryKey: true })
    id: uuid;

    @Column({ type: DataType.STRING })
    name: string;

    @Column({ type: DataType.TEXT })
    description: string;

    @Column({ type: DataType.STRING, allowNull: false })
    password: string;

    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    email: string;

    @Column({ type: DataType.STRING })
    avatar: string;

    @Column({ type: DataType.ARRAY(DataType.UUID), defaultValue: [], allowNull: false })
    favouritePosts: uuid[];

    @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
    isRemoved: boolean;

    @Column({ type: DataType.DATE, allowNull: false })
    createdDateTime: Date;

    @Column({ type: DataType.DATE })
    updatedDateTime: Date;
}