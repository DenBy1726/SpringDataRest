import handler from "../asyncErrorHandler"

module.exports = function follow(api, rootPath, relArray) {
    let root = api({
        method: 'GET',
        path: rootPath
    }).then(result=>result,e=>{
        handler(e);
    });

    return relArray.reduce(function(root, arrayItem) {
        var rel = typeof arrayItem === 'string' ? arrayItem : arrayItem.rel;
        return traverseNext(root, rel, arrayItem);
    }, root);

    function traverseNext (root, rel, arrayItem) {
        return root.then(function (response) {
            if (hasEmbeddedRel(response.entity, rel)) {
                return response.entity._embedded[rel];
            }

            if(!response.entity._links) {
                return [];
            }

            if (typeof arrayItem === 'string') {
                return api({
                    method: 'GET',
                    path: response.entity._links[rel].href
                }).then(result=>result,e=>{
                    handler(e);
                });
            } else {
                return api({
                    method: 'GET',
                    path: response.entity._links[rel].href,
                    params: arrayItem.params
                }).then(result=>result,e=>{
                    handler(e);
                });
            }
        });
    }

    function hasEmbeddedRel (entity, rel) {
        return entity._embedded && entity._embedded.hasOwnProperty(rel);
    }
};