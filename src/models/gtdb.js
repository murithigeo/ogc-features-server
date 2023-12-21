module.exports = (sequelize, DataTypes) => {
    const Gtdb = sequelize.define('gtdb', {
        eventid: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        dateoccurence: DataTypes.DATEONLY,
        gname: DataTypes.STRING,
        adm0: DataTypes.STRING,
        adm1: DataTypes.STRING,
        adm2: DataTypes.STRING,
        adm3: DataTypes.STRING,
        adm4: DataTypes.STRING,
        adm5: DataTypes.STRING,
        summary: DataTypes.STRING,
        targettype: DataTypes.STRING,
        geom: DataTypes.GEOMETRY('POINT', 4326)
    }, {
        sequelize,
        freezeTableName: true,
        timestamps: false,
    });
    return Gtdb;
}