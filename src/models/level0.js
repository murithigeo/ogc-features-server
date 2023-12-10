const DataTypes = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    const Level0 = sequelize.define('level0', {
        fid: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
        },
        admin0: {
            type: DataTypes.STRING(3),
            primaryKey: true,
        },
        country: DataTypes.STRING,
        geom: DataTypes.GEOMETRY('MULTIPOLYGON', 4326),
}, {
        //options
        sequelize,
        freezeTableName: true,
        defaultScope:{
            attributes:{
                exclude:['geom','objectid','continent','formal_en','shape_area']
            }
        },
        timestamps: false,
    });
    Level0.associate = function (models) {
        Level0.hasMany(models.level1, {
            foreignKey: 'admin0',
            sourceKey: 'admin0',
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
        });
        Level0.hasMany(models.level2, {
            foreignKey: 'admin0',
            sourceKey: 'admin0',
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
        });
        Level0.hasMany(models.level3, {
            foreignKey: 'admin0',
            sourceKey: 'admin0',
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
        });
        Level0.hasMany(models.level4, {
            foreignKey: 'admin0',
            sourceKey: 'admin0'
        });
        Level0.hasMany(models.level5, {
            foreignKey: 'admin0',
            sourceKey: 'admin0',
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
        });
        Level0.hasMany(models.incidents, {
            foreignKey: 'admin0',
            sourceKey: 'admin0',
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
        });
        Level0.hasMany(models.conflicts, {
            foreignKey: 'admin0',
            sourceKey: 'admin0',
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
        });
        Level0.hasMany(models.goi, {
            foreignKey: 'origin',
            sourceKey: 'admin0',
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
        });
        Level0.hasMany(models.traveladvisories, {
            foreignKey: 'xcountry',
            sourceKey: 'admin0',
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
        });
        Level0.hasMany(models.traveladvisories, {
            foreignKey: 'ycountry',
            sourceKey: 'admin0',
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
        });
        Level0.hasMany(models.coups, {
            foreignKey: 'admin0',
            sourceKey: 'admin0',
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
        });
    };
    return Level0;
};