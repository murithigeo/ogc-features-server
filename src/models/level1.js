module.exports = (sequelize, DataTypes) => {
    const Level1 = sequelize.define('level1', {
        gid: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
        },
        admin0: {
            type: DataTypes.STRING(3),
            references: {
                model: 'level0',
                key:'admin0',
            }
        },
        country: DataTypes.STRING,
        admin1: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        name_1: DataTypes.STRING,
        varname_1: DataTypes.STRING,
        nl_name_1: DataTypes.STRING,
        type_1: DataTypes.STRING,
        engtype_1: DataTypes.STRING,
        cc_1: DataTypes.STRING,
        hasc_1: DataTypes.STRING,
        geom: DataTypes.GEOMETRY('MULTIPOLYGON', 4326),
}, {
        //options
        sequelize,
        defaultScope: {
            attributes: {
                exclude:['gid','admin0','country','varname_1','nl_name_1','type_1','engtype_1','cc_1','hasc_1','geom']
            },
        },
        freezeTableName: true,
        timestamps:false,
    });
    Level1.associate = function (models) {
        Level1.belongsTo(models.level0, {
            foreignKey: 'admin0',
            targetKey:'admin0'
        });
        Level1.hasMany(models.incidents, {
            foreignKey: 'admin1',
            sourceKey: 'admin1',
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
        });
        Level1.hasMany(models.level2, {
            foreignKey: 'admin1',
            sourceKey: 'admin1',
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
        });
        Level1.hasMany(models.level3, {
            foreignKey: 'admin1',
            sourceKey: 'admin1',
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
        });
        Level1.hasMany(models.level4, {
            foreignKey: 'admin1',
            sourceKey: 'admin1',
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
        });
        Level1.hasMany(models.level5, {
            foreignKey: 'admin1',
            sourceKey: 'admin1',
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
        });
    };
    return Level1;
};