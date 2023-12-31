module.exports = {
    isAdminAuth: (req, res, next) => {
        if(req.session.isAdminAuth){
            next();
        }else{
            res.status(401).redirect('/adminSignin');
        }
    },
    noAdminAuth: (req, res, next) => {
        if(req.session.isAdminAuth){
            res.status(401).redirect('/adminHome');
        }else{
            next();
        }
    }
}