module.exports = (sequelize, DataTypes) => {
    const Level4 = sequelize.define('level4', {
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
            primaryKey: true
        },
        name_4: DataTypes.STRING,
        type_4: DataTypes.STRING,
        engtype_4: DataTypes.STRING,
        cc_4: DataTypes.STRING,
        geom: DataTypes.GEOMETRY('MULTIPOLYGON', 4326),
}, {
        //options
        sequelize,
        defaultScope: {
            attributes: {
                exclude:['type_4','cc_4','engtype_4','name_3','admin3','geom','name_2','admin2','name_1','admin1','admin0','country','gid']
            }
        },
        freezeTableName: true,
        timestamps:false,
    });
    Level4.associate = function (models) {
        Level4.belongsTo(models.level0, {
            foreignKey: 'admin0',
            targetKey: 'admin0'
        });
        Level4.belongsTo(models.level1, {
            foreignKey: 'admin1',
            targetKey: 'admin1'
        });
        Level4.belongsTo(models.level2, {
            foreignKey: 'admin2',
            targetKey: 'admin2'
        });
        Level4.belongsTo(models.level3, {
            foreignKey: 'admin2',
            targetKey: 'admin2'
        });
        Level4.hasMany(models.incidents, {
            foreignKey: 'admin4',
            sourceKey: 'admin4',
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
        });
        Level4.hasMany(models.level5, {
            foreignKey: 'admin4',
            sourceKey: 'admin4',
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
        });
    };
    return Level4;
};