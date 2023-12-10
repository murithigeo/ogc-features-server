import { UUIDV4 } from 'sequelize';
import { Model, Table, Column, DataType, IsIn, IsUUID, Default, PrimaryKey,   } from 'sequelize-typescript';
@Table({
    tableName: "incidents",
})
export default class Incidents extends Model {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: false,
        field: 'id'
    })
    id?: number;

    @Column({
        type: DataType.DATEONLY,
        field: 'dateoccurence'
    })
    dateoccurence?: string;

    //@PrimaryKey
    @IsUUID(4)
    @Default(UUIDV4())
    @Column({
        type: DataType.UUID,
        field: 'incidentid',
        primaryKey: true
    })
    incidentid?: string;

    @Column({
        type: DataType.STRING,
        field: 'incidentdesc'
    })
    incidentdesc?: string;

    @IsUUID(4)
    @Column({
        type: DataType.UUID,
        references: {
            model: 'goi',
            key: 'groupid'
        },
        field: 'groupid'
    })
    groupid?: string;

    @IsIn([
        [
            'facility/infrastructure-cyber',
            'facility/infrastructure-physical',
            'terror',
            'engagement',
            'protests',
            'hijacking',
            'massacre',
            'unknown'
        ]
    ])
    @Column({
        type: DataType.STRING,
        field: 'category'
    })
    category?: string;

    @Column({
        type: DataType.BOOLEAN,
        field: 'success',
        defaultValue: true
    })
    success?: string

}