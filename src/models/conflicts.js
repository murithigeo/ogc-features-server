module.exports = (sequelize, DataTypes) => {
    const Conflicts = sequelize.define('conflicts', {
        id: {
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
        conflictname: DataTypes.STRING,
        conflictid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,  //also implemented inDB using raw query. see PostgresNodeAPIsql.sql file
            primaryKey: true,
        },
        startdate: DataTypes.DATEONLY,
        enddate: {
            type: DataTypes.DATEONLY
        },
        overviewuri: {
            type: DataTypes.STRING,
            validate: {
                isUrl: true,
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
    Conflicts.associate = function (models) {
        Conflicts.belongsTo(models.level0, {
            foreignKey: 'admin0',
            targetKey: 'admin0',
        });
        Conflicts.hasMany(models.incidents, {
            foreignKey: 'conflictid',
            sourceKey: 'conflictid',
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT',
        });
    };
    return Conflicts;
};