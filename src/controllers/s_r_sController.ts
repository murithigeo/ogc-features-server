import * as sequelize from 'sequelize';
import * as models from '../models';
const Spatial_ref_sys = models.spatial_ref_sys;
const {Op} = sequelize;

exports.getSpatialRefSystems = async function getSpatialRefSystems(context) {
    let limit: number;
    context.params.query.limit === undefined ? limit = 10 : limit = context.params.query.limit; // set limit to 10 by default}

    let offset: number;
    context.params.query.offset === undefined ? offset = 0 : offset = context.params.query.offset; // set offset to 0 by default

    const rows = await Spatial_ref_sys.findAll(
        {
            attributes: ['srid', 'auth_name'],
            order: [['srid', 'ASC']],
            limit: limit,
            offset: offset,
            raw: true
        }
    );
    //console.log(rows);
    const availableCRS = rows.map(item => {
        const { srid, auth_name } = item;
        const version: number = 0;
        return `http://www.opengis.net/def/crs/${auth_name}/${version}/${srid}`;
    });
    context.res.status(200).json(availableCRS);
}

export async function verifyCRS(crs: string) {
    const url = new URL(crs);
    const auth_name = url.pathname.split('/')[3];
    const version = parseInt(url.pathname.split('/')[4]);
    const srid = parseInt(url.pathname.split('/')[5]);

    console.log(crs);
    
    const rows = await Spatial_ref_sys.findAll({
        attributes: ['srid', 'auth_name'],
        order: [['srid', 'ASC']],
        where: {
            [Op.and]: [
                { auth_name: auth_name },
                { srid: srid }
            ]
        },
        raw: true
    });
return rows;
}