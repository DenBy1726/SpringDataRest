import client from "./client"
import handler from "../asyncErrorHandler"
export default function request(method){
    return client(method)
        .then(result=> {
                return result
            },
            e=> {
                handler(e);
            }
    );
}