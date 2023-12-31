import * as fs from 'fs';
import * as path from 'path';
import { Sequelize, DataTypes } from 'sequelize';
import envConfigs from '../etc/dBconfig';

const basename = path.basename(__filename);
const env: string = process.env.NODE_ENV || 'development';
const config = envConfigs[env];
const db: { [key: string]: any } = {};

let sequelize: Sequelize;
if (config.url) {
    sequelize = new Sequelize(config.url, config);
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
    .readdirSync(__dirname)
    .filter((file: string) => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach((file: string) => {
        const model = require(path.join(__dirname, file))(sequelize, DataTypes);
        db[model.name] = model;
    });

Object.keys(db).forEach((modelName: string) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export  default db;