import * as func from "./actionFunc"

export function loadAll(page,sorter) {
    return func.loadWithSchema(page,sorter);
}

export function load(attributes, params,sorter){
    return func.load(attributes,params,sorter);
}

export function create(page, attributes, params,sorter){
    return func.create(page,attributes,params,sorter);
}

export function navigate(page, sorter, attributes){

    if(sorter && sorter.order)
        sorter.order = sorter.order.slice(0,-3);
    return func.load(attributes,page,sorter);
}


export function Delete(url, attributes, params,sorter){
    return func.Delete(url,attributes,params,sorter);
}

export function update(page, newPage, attributes, params,sorter){
    return func.update(page,newPage,attributes,params,sorter);
}

export default {create,Delete,update,load,loadAll,navigate}
































