const multer = require('multer');

exports.upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './assets')
        },
        filename: (req, file, cb) => {
            // console.log('multer');

            const uniqueSuffix = new Date().getTime() + '-' + Math.round(Math.random() * 1E6)
            const extension = file.originalname.split('.').pop()
            cb(null, file.fieldname + '-' + uniqueSuffix + '.' + extension)
        }
    }),
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            cb(new Error('Invalid Image Format'))
        } else { 
            cb(null, true)
        }
    }
})
