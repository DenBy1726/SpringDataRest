

export default function handle(error){
    let a = 0;
    let role = store.getState().role.user.role;
    if(role.findIndex(x => x.name === "ANONIM") === -1)
    {
        window.sessionExpired();
    }
}