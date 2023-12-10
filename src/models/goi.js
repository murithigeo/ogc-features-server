module.exports = (sequelize, DataTypes) => {
    const GOI = sequelize.define('goi', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true
        },
        category: {
            type:DataTypes.STRING,
            isIn: [
                ['humanitarian',
                    'unknown',
                    'cyberactor',
                    'governmental',
                    'civilian',
                    'militant',
                    //'press', //Is not particularly useful. Therefore removed
                ]
            ],
        },
        groupid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,  //also implemented inDB using raw query. see PostgresNodeAPIsql.sql file
            primaryKey: true,
        },
        groupname: DataTypes.STRING,
        origin: {
            type: DataTypes.STRING(3),
            references: {
                model: 'level0',
                key: 'admin0',
            },
        },
        uri: {
            type: DataTypes.STRING,
            validate: {
                isUrl: true
            }
        },
        dateadd: DataTypes.DATE,
        dateupdate: DataTypes.DATE
    }, {
        //options
        sequelize,
        freezeTableName: true,
        createdAt: 'dateadd',
        updatedAt: 'dateupdate',
    });
    GOI.associate = function (models) {
        GOI.belongsTo(models.level0, {
            foreignKey: 'origin',
            targetKey: 'admin0',
        });
        GOI.hasMany(models.incidents, {
            foreignKey: 'groupid',
            sourceKey: 'groupid',
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
        });
    };
    return GOI;
};