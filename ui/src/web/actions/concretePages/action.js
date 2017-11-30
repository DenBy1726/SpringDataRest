import * as func from "./actionFunc"

export function loadAll(page,sorter) {
    return func.loadWithSchema(page,sorter);
}

export function load(attributes, params){
    return func.load(attributes,params);
}

export function create(page, attributes, params){
    return func.create(page,attributes,params);
}

export function navigate(page, sorter, attributes){

    if(sorter && sorter.order)
        sorter.order = sorter.order.slice(0,-3);
    return func.load(attributes,page,sorter);
}


export function Delete(url, attributes, params){
    return func.Delete(url,attributes,params);
}

export function update(page, newPage, attributes, params){
    return func.update(page,newPage,attributes,params);
}

export default {create,Delete,update,load,loadAll,navigate}
































