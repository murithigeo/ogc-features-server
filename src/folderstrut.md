# Folder Structure
## `etc`: Contains high level configuration files and functions for Exegesis, OAS and Sequelize
-  `apidefUpdates`: Updates the OAS Document with an up-to-date `servers` array. The `baseURL`is used.
- `dbConfig`: Connection details for sequelize
- `index`
- `networking`: Generates the current IP address of the machine(`serverIP`)
- `serverlinking`: Generates an HTTP uri (`baseURL`) using the `serverIP`
## `lib`: Contains: 
### `controllers`: exegesis controllers
- `collectionsController` handles requests to path `/collections` & `/collections/{collectionId}` 
- `conformanceController` handles requests to path `/conformance`
- `dataExportController` handles requests to download data in bulk. Path is optional
- `gtdbController` handles requests for path `/collections/gtdb/items` & `/collections/gtdb/items/{featureId}`. Other controllers for the actual data retrieval will similarly follow these paths.
- `landingpageController` handles requests for path  `/`
- `serviceDescController` handles requests for path `/api`
- `serviceDocController` handles requets for path `/api.html`. This requirement is fulfilled by ScalarDocs due to easy config.
### - `config`: 
#### - `links`: Contains functions for generating links for various objects
#### - `makeObject`: Receives various arguments and compiles the object into a single object
#### - `params`:
- `bbox`: Receives `bbox-crs` and returns a `bbox` array containing values if defined or undefined. The `bbox` values will always be in the format that `PostGIS` uses `[minx,miny,maxx,maxy]`. This means checking if `bbox-crs` `isGeographic` or not and accounting.
- `bboxCrs`: Sets default `bbox-crs` as `CRS84` if `bbox-crs` is undefined.
- `contentCrs`: Generates the `Content-Crs` header value. Returns value in form of `<crs>`.
- `crs`: Sets default `crs` as `CRS84` if `crs` is undefined.
- `datetime`: Generates a `datetimeVals` object containing values of the processed `datetime` param.
- `f`: Generates an `object` containing the `content-negotiation` values of parameter `f` and their alternate `f` values and `content-types`.
- `initCheckCRS`: Generates boolean condition `flipCoords` based on checking whether the `bbox-crs` and `crs` match values in `CrsnProps`.
- `limit`: Sets default `limit` to whatever is defined as default in the `OAS` Document.
- `offset`: If `offset` is `undefined || <0`, set it to `0`. Otherwise set it whatever is defined.
- `paging`: Calculates the values of `numberReturned, nextPageOffset, prevPageOffset` of the `featureCollection` values
#### - `common`: 
- `coreVariables`: Provides global variables such as the `StorageCrsCoordinateEpoch` which is calculated from the day of release of `PostGIS 3.4`
- `storageCrs`: Provides the CRS in which data is stored in. Is `CRS84`. Is `EPSG:4326` except `axisOrder of [x,y]` instead of `WGS84` which uses `axisOrder of [y,x]
- `validateCRS`: Receives a string and checks whether it exists in `CRSnProps`. Returns an empty array if `crs` URI does not match and a single element array if match. Used to trigger `HTTP Error 400` if requested `crs` or `bbox-crs` is not in `CrsnProps`.
- `supportedCRS`: An string array containing URIs of CRS supported by this project. First element is `CRS84`'s. 
- `CrsnProps`: An array containing `objects` having key-values of `crs` (an URI), `srid` (must exist in POSTGIS), `auth_name` (different between `crs` with reversed `axisOrder`) and `isGeographic` (if `true` then `ST_FlipCoordinates` used in query. `ProjectedCRS` use `[x,y]`, `GeographicCRS` use `[y,x]` and `PostGIS` stores using `[x,y]`).
## `logs`
- `reqs.log`: Logs HTTP Requests to the server
- `latest.zip`: Unmodified zip containing logs of results from the `TeamEngine`
## `models`
Sequelize models which define how data is queried.
