set timezone = 'Africa/Nairobi'; --Set default time zone for dateadd/dateupdate timestamps

    create extension if not exists postgis; --Seqeulize seems to do this automatically

    create extension if not exists  "uuid-ossp"; --Support for creation of Universally Unique Identifiers
    
--ISO boundaries
    --level0
        --Datasource: WorldBank/GADM. Database currently uses WB due to ease of accessing the whole world as a singular package
            --create table level0 as select objectid, iso_a3 as admin0 , continent, name_en, geom, formal_en,shape_area from wb_countries; --Copy countries from WB dataset

            --insert into level0(objectid,admin0,continent,name_en, formal_en) values('252','NON','Unknown','Unknown','Unknown');  --Some groups-of-interest(goi) do not have apparent sovereign origins necessitating a more conducive designation of origin
create table if not exists level0(
    fid serial,
    admin0 varchar(3) primary key,
    country varchar,
    geom geometry(MultiPolygon, 4326)
)
            --alter table level0  add primary key (admin0); --Note that duplicates such as ISOCode ="-99" or "UMI" (US Minor Islands) should and have been deleted to ensure implementation of the primary key
   
    --level1
        --Notes: --Level0-Level5 have duplicate fields such as country.
                --To ease transition and inserted of update boundaries, duplicates will be maintained. 
                --level1-level5 will be sourced from GADM to ensure constistency with future updates to subnational boundaries
        create table if not exists level1(
        fid serial,
        admin0 varchar(3),
        country varchar,  
        admin1 varchar primary key,
        name_1 varchar,
        varname_1 varchar,
        nl_name_1 varchar,
        type_1 varchar,
        engtype_1 varchar,
        cc_1 varchar,
        hasc_1 varchar,
        iso_1 varchar,
        geom geometry(MultiPolygon, 4326),
        foreign key(admin0) references level0(admin0) on delete RESTRICT on update cascade);
        --foreign key actions:  --onUpdate:'CASCADE'
                                --onDelete: 'RESTRICT'/'NO ACTION'
                                --this is true for all foreign keys in this project.
    
    --level2
        create table if not exists level2(
        fid serial,
        admin0 varchar(3),
        country varchar,
        admin1 varchar,
        name_1 varchar,
        nl_name_1 varchar,
        admin2 varchar primary key,
        name_2 varchar,
        varname_2 varchar,
        nl_name_2 varchar,
        type_2 varchar,
        engtype_2 varchar,
        cc_2 varchar,
        hasc_2 varchar,
        geom geometry(MultiPolygon,4326),
        foreign key(admin1) references level1(admin1) on update cascade on delete RESTRICT,
        foreign key(admin0) references level0(admin0) on update cascade on delete RESTRICT);
   
    --level3
        create table if not exists level3(
        gid serial,
        admin0 varchar(3),
        country varchar,
        admin1 varchar,
        name_1 varchar,
        nl_name_1 varchar,
        admin2 varchar,
        name_2 varchar,
        nl_name_2 varchar,
        admin3 varchar primary key,
        name_3  varchar,
        varname_3  varchar,
        nl_name_3 varchar,
        type_3  varchar,
        engtype_3  varchar,
        cc_3 varchar,
        hasc_3  varchar,
        geom geometry(MultiPolygon,4326),
        foreign key(admin2) references level2(admin2) on update cascade on delete RESTRICT,        
        foreign key(admin1) references level1(admin1) on update cascade on delete RESTRICT,
        foreign key(admin0) references level0(admin0) on update cascade on delete RESTRICT);
   
    --level4
        create table if not exists level4(
        gid serial,
        admin0 varchar(3),
        country varchar,
        admin1 varchar,
        name_1 varchar,
        admin2 varchar,
        name_2 varchar,
        admin4 varchar primary key,
        admin3 varchar,
        name_3 varchar,
        name_4 varchar,
        varname_4 varchar,
        type_4 varchar,
        engtype_4 varchar,
        cc_4 varchar,
        geom geometry(MultiPolygon,4326),
        foreign key(admin3) references level3(admin3) on update cascade,
        foreign key(admin2) references level2(admin2) on update cascade,
        foreign key(admin1) references level1(admin1) on update cascade,
        foreign key(admin0) references level0(admin0) on update cascade);
   
    --level5
        create table if not exists level5(
        gid serial,
        admin0 varchar(3),
        country varchar,
        admin1 varchar,
        name_1 varchar,
        admin2 varchar,
        name_2 varchar,
        admin3 varchar,
        name_3 varchar,
        admin4 varchar,
        name_4 varchar,
        admin5 varchar primary key,
        name_5 varchar,
        type_5 varchar,
        engtype_5 varchar,
        cc_5 varchar,
        geom geometry(MultiPolygon,4326),
        foreign key(admin4) references level4(admin4) on update cascade on delete RESTRICT,
        foreign key(admin3) references level3(admin3) on update cascade on delete RESTRICT,
        foreign key(admin2) references level2(admin2) on update cascade on delete RESTRICT,
        foreign key(admin1) references level1(admin1) on update cascade on delete RESTRICT,
        foreign key(admin0) references level0(admin0) on update cascade on delete RESTRICT);

    --create spatial indices on level0-level5 geometry to speed up processes such as ST_CONTAINS;
        create index if not exists  l0index on level0 using gist(geom);
        create index if not exists  l1index on level1 using gist(geom);
        create index if not exists  l2index on level2 using gist(geom);
        create index if not exists  l3index on level3 using gist(geom);
        create index if not exists  l4index on level4 using gist(geom);
        create index if not exists  l5index on level5 using gist(geom);

---ogr2ogr script to import the gpkg file


--Table: goi 
    CREATE TABLE IF NOT EXISTS goi(
    Id SERIAL,
    category varchar --These checks will be implemented in-database as well as in sequelize using the isIn[[]] validator
                    check (category = 'militant' or
                           category = 'governmental' or 
                           category= 'civilian' or 
                           --category ='press' or 
                           category ='unknown' or
                           category ='humanitarian' or
                           category ='cyberactor'),
    groupid UUID default uuid_generate_v4() primary key, --groupid will be a 32/n-number randomized character string. Duplicates will be checked on a case by case basis in-DB
    groupName varchar,
    origin varchar(3) default('NON'), --ensure that the fK is not empty after insertion
    uri varchar, --overview hyperlink for each group. isURL validation is implemented by sequelize
    dateadd timestamp with time zone,
    dateupdate timestamp with time zone, --date/time that event was added/updated to DB. Are primarily implemented by sequelize for R/W operations
    foreign key(origin) references level0(admin0) on update cascade on delete RESTRICT);

--Table: conflicts
    CREATE TABLE IF NOT EXISTS conflicts(
    Id SERIAL,
    startDate date,
    endDate date default now(), --assumes that the conflict is still ongoing
    conflictName varchar,
    admin0 varchar(3) default('NON'), --for conflicts with no apparent setting/origin
    overviewUri varchar, --sequelize validates using isURL
    conflictid uuid default uuid_generate_v4() primary key, --uses a uuid string as pK
    dateadd timestamp with time zone,
    dateupdate timestamp with time zone,
    foreign key(admin0) references level0(admin0)on update cascade on delete RESTRICT);
--Table: coups
    CREATE TABLE if NOT EXISTS coups(
        Id SERIAL,
        coupid uuid default uuid_generate_v4() primary key,
        dateoccurence date,
        resolved boolean,
        resolutiondate date,
        admin0 varchar(3),
        foreign key(admin0) references level0(admin0) on update cascade on delete RESTRICT
    );

--Table: incidents
CREATE TABLE IF NOT EXISTS incidents(
    Id SERIAL,
    dateoccurence date,
    incidentid uuid default uuid_generate_v4() primary key,
    incidentdesc varchar,
    groupid  uuid,
    category varchar 
                    --classification dependent on outcome, wording from media, etc
                    --Due to the hybrid nature of some incidents, further options are required to ensure that category reflects the situation
                        check (category='engagement' or --//incidents where militant/governmental goi(s) confront each other
                                category = 'massacre' or --//incidents where there is overwhelming loss of civilian life and where one goi is primarily blamed for the outcome
                                category = 'terror' or --//incidents where militant groups commit terror attacks
                                category = 'protests' or --//incidents where civilians are engaged in (non) destructive actions against a particular goi
                                --category = 'hostages' or --//incidents where hostages are taken
                                category = 'unknown' or--//incidents with no apparent motive from media etc
                                category = 'facility/infrastructure-physical' or --//primarily where critical services are targeted i.e. government/political offices
                                category = 'facility/infrastructure-cyber' or
                                category = 'hijacking'), --//incidents where hijackings are critical to national security i.e. plane hijackings                            
                                --category = 'arrests'),----//incidents where goi arrest individuals/goi who are implicated as critical to national security
    success boolean default true, --Determines the success of the incident towards achieving motive. The default assumes that the incident was successful
    locale varchar,
    conflictid uuid,--uuid default('9851f8fa-2921-4704-b617-e173c3853f34'), --uuid code for unspecified conflict
    admin0 varchar(3),
    admin1 varchar,
    admin2 varchar,
    admin3 varchar,
    admin4 varchar,
    admin5 varchar, 
    dateadd timestamp with time zone,
    dateupdate timestamp with time zone,
    geom geometry(Point, 4326), --instead of a generated column, use triggers to ensure constistency and non-duplicity
    foreign key(groupid) references goi(groupid) on update cascade,
    foreign key(conflictid) references conflicts (conflictid) on update cascade on delete RESTRICT,
    foreign key(admin5) references level5(admin5) on update cascade on delete RESTRICT,
    foreign key(admin4) references level4(admin4) on update cascade on delete RESTRICT,
    foreign key(admin3) references level3(admin3) on update cascade on delete RESTRICT,
    foreign key(admin2) references level2(admin2) on update cascade on delete RESTRICT,
    foreign key(admin1) references level1(admin1) on update cascade on delete RESTRICT,
    foreign key(admin0) references level0(admin0) on update cascade on delete RESTRICT);  


--Table: traveladvisories
    CREATE TABLE IF NOT EXISTS traveladvisories(
    Id SERIAL,
    advisoryid uuid default uuid_generate_v4(),
    xCountry varchar(3) not NULL, --country issuing travel advisory
    ycountry varchar(3) not null, --country that is subject of advisory
    dateIssued date,
    liftdate date default now(), --assumes that the advisory is still in effect
    uri varchar,
    dateadd timestamp with time zone,
    dateupdate timestamp with time zone,
    foreign key(xcountry) references level0(admin0)on update cascade on delete RESTRICT,
    foreign key(ycountry) references level0(admin0)on update cascade on delete RESTRICT);

--update admin1,admin2,admin3,admin4, admin5 if coordinates are not null and points are within available geometries
    create or replace  function adminupdate()
    returns trigger
    language plpgsql
    as
    $$
    begin
	--if new.latitude is not null and new.longitude is not null then new.geom := st_setsrid(St_MakePoint(new.longitude,new.latitude), 4326); --generates a point geometry. new ensures that operations are carried out before insert
	--end if;
	if new.geom is not null then select l0.admin0 into new.admin0  from level0 as l0 where st_contains(l0.geom,new.geom); --copy admin0 code into incidents.admin0 where the incident is within a country
	end if;
	if new.geom is not null then select l1.admin1 into new.admin1 from level1 as l1 where st_contains(l1.geom,new.geom);--"" admin1 code
	end if;
	if new.geom is not null then select l2.admin2 into new.admin2 from level2 as l2 where st_contains(l2.geom,new.geom);--""
	end if;
	if new.geom is not null then select l3.admin3 into new.admin3 from level3 as l3 where st_contains(l3.geom,new.geom);--""
	end if;
	if new.geom is not null then select l4.admin4 into new.admin4 from level4 as l4 where st_contains(l4.geom,new.geom);--""
	end if;
	if new.geom is not null then select l5.admin5 into new.admin5 from level5 as l5 where st_contains(l5.geom,new.geom);--""
	end if;
	return new;
	end;	
    $$;
    
   --create function trigger
    create or replace trigger adminupdate
    before insert or update
    on incidents
    for each row 
    execute function adminupdate();

--uuid default values. Enables uuids to be gen when data entered directly in the database
    --incidents:incidentid
    alter table incidents
    alter column incidentid
    set default uuid_generate_v4();
    
    --goi:groupid
    alter table goi
    alter column groupid
    set default uuid_generate_v4();


    --conflicts:conflictid
    alter table conflicts
    alter column conflictid
    set default uuid_generate_v4();

    --incidents: sucess(boolean)
    alter table incidents
    alter column success
    set default true;

    --###################GTDB 
    create table if not exists gtdbUnformatted( 
    eventid varchar , iyear varchar, imonth varchar, iday varchar,
    approxdate varchar, extended varchar, resolution varchar, country varchar,
    country_txt varchar, region varchar, region_txt varchar, provstate varchar,
    city varchar, latitude double precision, longitude double precision,specificity varchar,
    vicinity varchar, location varchar, summary varchar, crit1 varchar, crit2 varchar,
    crit3 varchar, doubtterr varchar, alternative varchar, alternative_txt varchar,
    multiple varchar, success varchar, suicide varchar, attacktype1 varchar, attacktype1_txt varchar,
    attacktype2  varchar, attacktype2_txt varchar, attacktype3 varchar,attacktype3_txt  varchar,
    targtype1 varchar, targtype1_txt  varchar,targsubtype1 varchar, targsubtype1_txt  varchar, corp1  varchar,
    target1  varchar, natlty1 varchar, natlty1_txt  varchar, targtype2 varchar, targtype2_txt  varchar,
    targsubtype2 varchar, targsubtype2_txt  varchar, corp2  varchar, target2   varchar,natlty2 varchar,
    natlty2_txt varchar, targtype3 varchar,targtype3_txt varchar,targsubtype3 varchar,targsubtype3_txt varchar,
    corp3  varchar,target3 varchar,natlty3 varchar,natlty3_txt varchar,gname   varchar,gsubname  varchar,gname2 varchar,
    gsubname2 varchar,gname3 varchar,gsubname3 varchar,motive    varchar,guncertain1 varchar,guncertain2 varchar,guncertain3 varchar,
    individual varchar,nperps varchar,nperpcap varchar,claimed varchar,claimmode varchar,claimmode_txt varchar,claim2 varchar,
    claimmode2 varchar,claimmode2_txt varchar,claim3 varchar,claimmode3 varchar,claimmode3_txt varchar,compclaim varchar,weaptype1 varchar,
    weaptype1_txt varchar,weapsubtype1 varchar,weapsubtype1_txt   varchar,weaptype2 varchar,weaptype2_txt varchar,weapsubtype2 varchar,
    weapsubtype2_txt varchar,weaptype3 varchar,weaptype3_txt varchar,weapsubtype3 varchar,weapsubtype3_txt varchar,weaptype4 varchar,
    weaptype4_txt varchar,weapsubtype4 varchar,weapsubtype4_txt varchar,weapdetail varchar,nkill varchar,nkillus varchar,nkillter varchar,
    nwound varchar,nwoundus varchar,nwoundte varchar,property varchar,propextent varchar,propextent_txt varchar,propvalue varchar,propcomment varchar,
    ishostkid varchar,nhostkid varchar,nhostkidus varchar,nhours varchar,ndays varchar,divert varchar,kidhijcountry varchar,ransom varchar,ransomamt varchar,
    ransomamtus varchar,ransompaid varchar,ransompaidus varchar,ransomnote varchar,hostkidoutcome varchar,hostkidoutcome_txt varchar,nreleased varchar, addnotes  varchar,  
    scite1 varchar,scite2 varchar,scite3   varchar,dbsource  varchar,int_log varchar,int_ideo varchar,int_misc varchar,int_any varchar,related  varchar);

    --Formatted
    create table if not exists gtdb(
        eventid varchar,
        summary varchar,
        dateoccurence date ,
        geom geometry(Point,4326),
        adm0 varchar(3),
        adm1 varchar,
        adm2 varchar,
        adm3 varchar,
        adm4 varchar,
        adm5 varchar,
        targtype1_txt varchar,
        gname varchar)

UPDATE gtdb
SET dateoccurence = TO_DATE(CONCAT(iyear, '-', imonth, '-', idate), 'YYYY-MM-DD'),
set geom = ST_SetSRID(ST_MakePoint(longitude, latitude),4326);

UPDATE gtdbunformatted t
SET 
--    adm0 = l0.country
--    adm1 = l1.name_1
--    adm2 = l2.name_2
--    adm3 = l3.name_3
--    adm4 = l4.name_4
--    adm5 = l5.name_5
FROM 
--	  level0 l0
--	  level1 l1
--    level2 l2
--    level3 l3
--    level4 l4
--    level5 l5
WHERE 
--    ST_Contains(l0.geom, t.geom)
--     ST_Contains(l1.geom, t.geom)
--     ST_Contains(l2.geom, t.geom)
--     ST_Contains(l3.geom, t.geom)
--     ST_Contains(l4.geom, t.geom)
--   ST_Contains(l5.geom, t.geom);