module.exports = (sequelize, DataTypes) => {
    const Level3 = sequelize.define('level3', {
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
            references: {
                model: 'level2',
                key: 'admin2',
            }
        },
        name_2: DataTypes.STRING,
        nl_name_2: DataTypes.STRING,
        admin3: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        name_3: DataTypes.STRING,
        varname_3: DataTypes.STRING,
        nl_name_3: DataTypes.STRING,
        type_3: DataTypes.STRING,
        engtype_3: DataTypes.STRING,
        cc_3: DataTypes.STRING,
        hasc_3: DataTypes.STRING,
        geom: DataTypes.GEOMETRY('MULTIPOLYGON', 4326),
}, {
        //options
        sequelize,
        defaultScope:{
        attributes: {
            exclude: ['gid', 'admin0','name_1','varname_3','nl_name_3','type_3','engtype_3','cc_3','hasc_3', 'country','admin1','admin2','name_2','nl_name_2','varname_1', 'nl_name_1', 'type_1', 'engtype_1', 'cc_1', 'hasc_1', 'geom']
        },
    },
        freezeTableName: true,
        timestamps:false,
    });
    Level3.associate = function (models) {
        Level3.belongsTo(models.level0, {
            foreignKey: 'admin0',
            targetKey: 'admin0'
        });
        Level3.belongsTo(models.level1, {
            foreignKey: 'admin1',
            targetKey: 'admin1'
        });
        Level3.belongsTo(models.level2, {
            foreignKey: 'admin2',
            targetKey: 'admin2'
        });
        Level3.hasMany(models.level4, {
            foreignKey: 'admin3',
            sourceKey: 'admin3',
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
        });
        Level3.hasMany(models.level5, {
            foreignKey: 'admin3',
            sourceKey: 'admin3',
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
        });
        Level3.hasMany(models.incidents, {
            foreignKey: 'admin3',
            sourceKey: 'admin3',
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
        });
    };
    return Level3;
};