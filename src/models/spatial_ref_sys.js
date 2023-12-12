module.exports = (sequelize, DataTypes) => {
    const Spatial_Ref_Sys = sequelize.define('spatial_ref_sys', {
        srid:{
            type:DataTypes.INTEGER,
            primaryKey:true
        },
        auth_name: DataTypes.STRING,
        auth_srid: DataTypes.INTEGER,
        srtext: DataTypes.STRING
    },{
        sequelize,
        freezeTableName:true,
        timestamps:false
    });
    return Spatial_Ref_Sys;
}