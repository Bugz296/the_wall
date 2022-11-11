export function createSession(req, params){

    req.session.user = params;
    req.session.save();
    return true
}

export function destroySession(req){

    req.session.destroy();
    return true
}