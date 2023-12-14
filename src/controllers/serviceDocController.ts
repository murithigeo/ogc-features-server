import { createServerLinks } from '../core/serverlinking';
import { genBaseLink } from './core/resourceURIgen';

exports.getServiceDoc = async function getServiceDoc(context) {
    const { baseLink } = await genBaseLink(context);

    const docURL = baseLink + '/api';
    const scalarCode =
        '<!doctype html>' +
        '<html>' +
        '<head>' +
        '<title>API Reference</title>' +
        '<meta charset="utf-8" />' +
        '<meta' +
        'name="viewport"' +
        'content = "width=device-width, initial-scale=1" />' +
        '<style>' +
        'body {' +
        'margin: 0;' +
        '}' +
        '</style >' +
        '</head >' +
        '<body>' +
        '<script ' +
        'id="api-reference" ' +
        //'type="application/json" ' +
        'data-url="' + docURL + '">' +
        //'>' + JSON.stringify(Doc) +
        '</script>' +
        '<script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>' +
        '</body>' +
        '</html>';
    context.res.status(200).set('content-type', 'text/html').setBody(scalarCode)
}
