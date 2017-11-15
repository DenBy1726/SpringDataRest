const client = (method, path) => {
 return new Promise((resolve, reject) => {
    let request = new XMLHttpRequest();
    request.open(method, path, true);
    request.send();
    request.onreadystatechange = () => {
        if (request.readyState === 4 && request.status === 200) {
            let type = request.getResponseHeader('Content-Type');
            if (type.indexOf("text") !== 1) {
                let json = request.responseText;
                const data = JSON.parse(json);

                resolve(data);
            }
        }
    };
})
};

const loadPage = (method,path,pageSize) =>{
    let req = path+ '?size=' + pageSize;
    return client(method,req);
};

export {client,loadPage};
