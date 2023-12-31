/*
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        username: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        password: DataTypes.STRING,
        email: DataTypes.STRING,
        role: {
            type: DataTypes.STRING,
            defaultValue: 'demo',
            allowNull: false,
            validate: {
                isIn: [
                    ['demoUser', 'admin','verUser']
                ]
            }
        }
    }, {
        sequelize,
        freezeTableName: true,
        timestamps: false
    });
    return User;
}
*/