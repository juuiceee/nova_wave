import { Column, DataType, Model, Table } from 'sequelize-typescript';
import * as uuid from 'uuid';

interface TokenCreationAtribute {
    userId: uuid;
    refreshToken: string;
    createdDateTime: Date;
    updatedDateTime: Date;
}

@Table({ tableName: 'tokens', createdAt: false, updatedAt: false })
export class Token extends Model<Token, TokenCreationAtribute>{

    @Column({ type: DataType.UUID, primaryKey: true, references: { model: 'users', key: 'id' } })
    userId: uuid;

    @Column({ type: DataType.TEXT, allowNull: false })
    refreshToken: string;

    @Column({ type: DataType.DATE, allowNull: false })
    createdDateTime: Date;

    @Column({ type: DataType.DATE })
    updatedDateTime: Date;
}