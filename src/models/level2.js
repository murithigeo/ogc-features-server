module.exports = (sequelize, DataTypes) => {
    const Level2 = sequelize.define('level2', {
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
        nl_name_1: DataTypes.STRING,
        admin2: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        name_2: DataTypes.STRING,
        nl_name_2: DataTypes.STRING,
        varname_2: DataTypes.STRING,
        type_2: DataTypes.STRING,
        engtype_2: DataTypes.STRING,
        cc_2: DataTypes.STRING,
        hasc_2: DataTypes.STRING,
        geom: DataTypes.GEOMETRY('MULTIPOLYGON', 4326),
}, {
        //options
        sequelize,
        defaultScope: {
            attributes: {
                exclude: ['gid','admin0','admin1','nl_name_2','name_1','nl_name_2','varname_2','type_2','engtype_2','cc_2','hasc_2' ,'country', 'varname_1', 'nl_name_1', 'type_1', 'engtype_1', 'cc_1', 'hasc_1', 'geom']
            },
        },
        freezeTableName: true,
        timestamps:false,
    });
    Level2.associate = function (models) {
        Level2.hasMany(models.incidents, {
            foreignKey: 'admin2',
            sourceKey: 'admin2',
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
        });
        Level2.belongsTo(models.level0, {
            foreignKey: 'admin0',
            targetKey: 'admin0'
        });
        Level2.belongsTo(models.level1, {
            foreignKey: 'admin1',
            targetKey: 'admin1'
        });
        Level2.hasMany(models.level3, {
            foreignKey: 'admin2',
            sourceKey: 'admin2',
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
        });
        Level2.hasMany(models.level4, {
            foreignKey: 'admin2',
            sourceKey: 'admin2',
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
        });
        Level2.hasMany(models.level5, {
            foreignKey: 'admin2',
            sourceKey: 'admin2',
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
        });
    };
    return Level2;
};