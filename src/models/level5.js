module.exports = (sequelize, DataTypes) => {
    const Level5 = sequelize.define('level5', {
        gid: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
        },
        admin0: {
            type: DataTypes.STRING(3),
            references: {
                model: 'level0',
                key: 'admin0',
            }
        },
        country: DataTypes.STRING,
        admin1: {
            type: DataTypes.STRING,
            references: {
                model: 'level1',
                key: 'admin1',
            }
        },
        name_1: DataTypes.STRING,
        admin2: {
            type: DataTypes.STRING,
            references: {
                model: 'level2',
                key: 'admin2',
            }
        },
        name_2: DataTypes.STRING,
        admin3: {
            type: DataTypes.STRING,
            references: {
                model: 'level3',
                key: 'admin3',
            }
        },
        name_3: DataTypes.STRING,
        admin4: {
            type: DataTypes.STRING,
            references: {
                model: 'level4',
                key: 'admin4',
            }
        },
        name_4: DataTypes.STRING,
        admin5: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        name_5: DataTypes.STRING,
        type_5: DataTypes.STRING,
        engtype_5: DataTypes.STRING,
        cc_5: DataTypes.STRING,
        geom: DataTypes.GEOMETRY('MULTIPOLYGON', 4326),
}, {
        //options
        sequelize,
        defaultScope: {
            attributes: {
                exclude: ['gid', 'admin0', 'country', 'admin1', 'name_1', 'admin2', 'name_2', 'admin3', 'name_3', 'admin4','name_4','type_5','engtype_5','cc_5','geom']
            }
        },
        freezeTableName: true,
        timestamps: false,
    });
   Level5.associate = function (models) {
        Level5.belongsTo(models.level0, {
            foreignKey: 'admin0',
            targetKey: 'admin0'
        });
        Level5.belongsTo(models.level1, {
            foreignKey: 'admin1',
            targetKey: 'admin1'
        });
        Level5.belongsTo(models.level2, {
            foreignKey: 'admin2',
            targetKey: 'admin2'
        });
        Level5.belongsTo(models.level3, {
            foreignKey: 'admin3',
            targetKey: 'admin3'
        });
        Level5.belongsTo(models.level4, {
            foreignKey: 'admin4',
            targetKey: 'admin4'
        });
        Level5.hasMany(models.incidents, {
            foreignKey: 'admin5',
            sourceKey: 'admin5',
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
        });
    };
    return Level5;
};