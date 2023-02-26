import { Column, DataType, Model, Table } from 'sequelize-typescript';
import * as uuid from 'uuid';

interface RoleCreationAtribute {
    name: string;
    value: string;
}

@Table({ tableName: 'roles' })
export class Role extends Model<Role, RoleCreationAtribute>{
    @Column({ type: DataType.UUID, unique: true, primaryKey: true, defaultValue: uuid.v4() })
    id: uuid;

    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    name: string;

    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    value: string;
}