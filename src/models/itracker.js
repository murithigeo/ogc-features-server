module.exports = (sequelize, DataTypes) => {
    const Itracker = sequelize.define('itracker', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true
        },
        trackid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,  //also implemented inDB using raw query. see PostgresNodeAPIsql.sql file
            primaryKey:true
        },
        incidentid: {
            type: DataTypes.UUID,
            references: {
                model: 'incidents',
                key:'incidentid'
            },
        },
        propchange: DataTypes.STRING(255),
        isstate: {
            type: DataTypes.BOOLEAN,
            defaultValue: false, //also implemented inDB using raw query. see PostgresNodeAPIsql.sql file
        },
        admincomments: DataTypes.STRING(255),
        dateadd: DataTypes.DATE,
        dateupdate: DataTypes.DATE
    }, {
        //options
        sequelize,
        freezeTableName: true,
        createdAt: 'dateadd',
        updatedAt: 'dateupdate',
    });
    Itracker.associate = function (models) {
        Itracker.belongsTo(models.incidents, {
            foreignKey: 'incidentid',
            targetKey: 'incidentid',
        });
    };
    return Itracker;
};