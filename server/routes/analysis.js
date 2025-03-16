const express = require('express');
const multer = require('multer');
const { analyzeBinary } = require('../controllers/analyzeController');

const router = express.Router();
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.post('/upload', upload.single('binary'), analyzeBinary);
module.exports = router;
