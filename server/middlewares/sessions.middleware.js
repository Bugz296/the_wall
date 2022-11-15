export function checkSession(){
    return (req, res, next) => {
        if(req.originalUrl === '/' && req.session?.user){
            res.redirect('/home');
        }
        else if(req.originalUrl === '/home' && !req.session?.user){
            res.redirect('/');
        }
        else{
            next();
        }
    }
}