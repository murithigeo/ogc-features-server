module.exports = (sequelize, DataTypes) => {
    const Incidents = sequelize.define('incidents', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true
        },
// latitude: DataTypes.DOUBLE, //Shift to geoJSON object forms
// longitude: DataTypes.DOUBLE,
        dateoccurence: DataTypes.DATEONLY,
        incidentid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4, // also implemented inDB using raw query. see PostgresNodeAPIsql.sql file
            primaryKey: true
        },
        incidentdesc: {
            type: DataTypes.STRING,
/*validate: {
                allowNull: false,
            }*/
        },
        groupid: {
            type: DataTypes.UUID,
            references: {
                model: 'goi',
                key: 'groupid'
            }
        },
        category: {
            type: DataTypes.STRING,
            //possibility to add a global array of allowed values
            isIn: [
                // Conforms to values from GTD
                [
                    'facility/infrastructure-cyber',
                    'facility/infrastructure-physical',
                    'terror',
                    'engagement',
                    'protests',
                    'hijacking',
                    'massacre',
                    'unknown'
                ]
            ]
        },
        success: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        locale: DataTypes.STRING,
// A datasource. If GTDB do not allow Write/Delete. Decided to go with OpenSource Int.
// Most GTD events do not have geospatial coordinates
        conflictid: {
            type: DataTypes.UUID,
            references: {
                model: 'conflicts',
                key: 'conflictid'
            }
        },
        admin0: {
            type: DataTypes.STRING(3),
            references: {
                model: 'level0',
                key: 'admin0'
            }
        },
        admin1: {
            type: DataTypes.STRING,
            references: {
                model: 'level1',
                key: 'admin1'
            }
        },
        admin2: {
            type: DataTypes.STRING,
            references: {
                model: 'level2',
                key: 'admin2'
            }
        },
        admin3: {
            type: DataTypes.STRING,
            references: {
                model: 'level3',
                key: 'admin3'
            }
        },
        admin4: {
            type: DataTypes.STRING,
            references: {
                model: 'level4',
                key: 'admin4'
            }
        },
        admin5: {
            type: DataTypes.STRING,
            references: {
                model: 'level5',
                key: 'admin5'
            }
        },
        geom: {
            type: DataTypes.GEOMETRY('POINT', 4326)
        },
        dateadd: DataTypes.DATE,
        dateupdate: DataTypes.DATE
    }, {
        // options
        sequelize,
// Scopes eschewed in favor of attributes
/*        defaultScope: {
            attributes: {
                exclude:['id','longitude','latitude','dateadd','dateupdate','admin0','admin1','admin2','admin3','admin4','admin5']
            },
        },
        scopes: {
            incidentid_only: {
                attributes: {
                    exclude: ['id', 'dateupdate', 'dateadd', 'geom', 'eventid', 'admin1', 'admin0', 'admin2', 'admin3', 'admin4', 'admin5', 'groupid', 'conflictid', 'locale', 'success', 'category','dateoccurence']
                }
            }
        },*/
        freezeTableName: true,
        createdAt: 'dateadd',
        updatedAt: 'dateupdate',
        deletedAt: 'datedeleted' // /Need to create column in postgres to match model
    });
    Incidents.associate = function (models) {
        Incidents.belongsTo(models.goi, {
            foreignKey: 'groupid',
            targetKey: 'groupid'
        });
        Incidents.belongsTo(models.level0, {
            foreignKey: 'admin0',
            targetKey: 'admin0'
        });
        Incidents.belongsTo(models.level1, {
            foreignKey: 'admin1',
            targetKey: 'admin1'
        });
        Incidents.belongsTo(models.level2, {
            foreignKey: 'admin2',
            targetKey: 'admin2'
        });
        Incidents.belongsTo(models.level3, {
            foreignKey: 'admin3',
            targetKey: 'admin3'
        });
        Incidents.belongsTo(models.level4, {
            foreignKey: 'admin4',
            targetKey: 'admin4'
        });
        Incidents.belongsTo(models.level5, {
            foreignKey: 'admin5',
            targetKey: 'admin5'
        });
        Incidents.belongsTo(models.conflicts, {
            foreignKey: 'conflictid',
            targetKey: 'conflictid'
        });
    };
    return Incidents;
};
