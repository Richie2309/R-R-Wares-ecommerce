const Multer = require('multer');
const path = require('path');

const storage = Multer.diskStorage({
    destination: (req, file, callBack) => {
        const assetsDir = path.join(__dirname,'../../../','assets');
        const destinationPath = path.join(assetsDir,'uploadedImages');
        callBack(null, destinationPath);
    },
    filename: (req, file, callBack) => {
          const extenction = file.originalname.substring(file.originalname.lastIndexOf('.'));
          callBack(null, `${file.fieldname}-${Date.now()}${extenction}`);  
    }
});


module.exports = store = Multer({storage});