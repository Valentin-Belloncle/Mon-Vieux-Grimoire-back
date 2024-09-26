const express = require('express');
const router = express.Router();
const bookCtrl = require('../controllers/book')
const auth = require('../middleware/auth');
const { upload, compressAndSaveImage } = require("../middleware/multer-sharp-config");


router.get("/", bookCtrl.getAllBooks);
router.post("/", auth, upload, compressAndSaveImage, bookCtrl.createOneBook);
router.get("/bestrating", bookCtrl.getBestBooks);
router.get("/:id", bookCtrl.getOneBook);
router.put("/:id", auth, upload, compressAndSaveImage, bookCtrl.modifyOneBook);
router.delete("/:id", auth, bookCtrl.deleteOneBook);
router.post("/:id/rating", auth, bookCtrl.rateOneBook);

module.exports = router;