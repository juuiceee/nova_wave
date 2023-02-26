import { Column, DataType, Model, Table } from 'sequelize-typescript';
import * as uuid from 'uuid';

interface UserCreationAtribute {
    id: uuid;
    name: string;
    description: string;
    password: string;
    email: string;
    roleId: string;
    isRemoved: boolean;
}

@Table({ tableName: 'users' })
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

    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    isRemoved: boolean;

    @Column({ type: DataType.UUID })
    roleId: uuid;
}