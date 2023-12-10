module.exports = (sequelize, DataTypes) => {
    const TravelAdvisories = sequelize.define('traveladvisories', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
        },
        advisoryid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        xcountry: {
            type: DataTypes.STRING(3),
            references: {
                model: 'level0',
                key: 'admin0',
            }
        },
        ycountry: {
            type: DataTypes.STRING(3),
            references: {
                model: 'level0',
                key: 'admin0',
            }
        },
        dateissued: DataTypes.DATEONLY,
        liftdate: DataTypes.DATEONLY,
        uri: DataTypes.STRING,
        dateadd: DataTypes.DATE,
        dateupdate: DataTypes.DATE
}, {
        //options
        sequelize,
        freezeTableName: true,
        createdAt: 'dateadd',
        updatedAt: 'dateupdate',
    });
    TravelAdvisories.associate = function (models) {
        TravelAdvisories.belongsTo(models.level0, {
            foreignKey: 'xcountry',
            targetKey: 'admin0'
        });
        TravelAdvisories.belongsTo(models.level0, {
            foreignKey: 'ycountry',
            targetKey:'admin0'
        });
    };
    return TravelAdvisories;
};