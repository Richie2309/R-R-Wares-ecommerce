const multer=require('multer')
const { callbackPromise } = require('nodemailer/lib/shared')
const path=require('path')

exports.storage=multer.diskStorage({
    destination: (req,file,callBack)=>{
        callBack(null,'assets/uploads')
    },
    filename:(req, file, callBack)=>{
        callBack(null, Date.now() + "_" + path.extname(file.originalName))
    }
})