import { Column, DataType, Model, Table } from 'sequelize-typescript';
import * as uuid from 'uuid';

interface TokenCreationAtribute {
    userId: uuid;
    refreshToken: string;
}

@Table({ tableName: 'tokens' })
export class Token extends Model<Token, TokenCreationAtribute>{
    @Column({ type: DataType.UUID, primaryKey: true, references: { model: 'users', key: 'id' } })
    userId: uuid;

    @Column({ type: DataType.TEXT, allowNull: false })
    refreshToken: string;
}