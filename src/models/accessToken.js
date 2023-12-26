module.exports= (sequelize, DataTypes) => {
    const AccessToken = sequelize.define('accessToken', {
        token: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        username: DataTypes.STRING,
        expiry: DataTypes.DATE
    }, {
        sequelize,
        freezeTableName: true,
        timestamps: false
    });
    return AccessToken;
}