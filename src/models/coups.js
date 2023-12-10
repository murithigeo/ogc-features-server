module.exports = (sequelize, DataTypes) => {
    const Coups = sequelize.define('coups', {
        Id: {
            type: DataTypes.STRING,
            autoIncrement: true
        },
        dateoccurence: DataTypes.DATEONLY,
        coupid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4, //also implemented inDB using raw query. see PostgresNodeAPIsql.sql file
            primaryKey: true,
        },
        resolved: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        resolutiondate: DataTypes.DATEONLY,
        admin0: {
            type: DataTypes.STRING(3),
            references: {
                model: 'level0',
                key: 'admin0',
            }
        },
        dateadd: DataTypes.DATE,
        dateupdate: DataTypes.DATE
    }, {
        sequelize,
        freezeTableName: true,
        createdAt: 'dateadd',
        updatedAt: 'dateupdate',
    });
    Coups.associate = function (models) {
        Coups.belongsTo(models.level0, {
            foreignKey: 'admin0',
            targetKey: 'admin0',
        });
    };
    return Coups;
}