const express = require('express');
const router = express.Router();
const bookCtrl = require('../controllers/book')
const auth = require('../middleware/auth');

router.get("/", bookCtrl.getAllBooks);
router.post("/", auth, bookCtrl.createOneBook);
router.get("/bestrating", bookCtrl.getBestBooks);
router.get("/:id", bookCtrl.getOneBook);
router.put("/:id", auth, bookCtrl.modifyOneBook);
router.delete("/:id", auth, bookCtrl.deleteOneBook);

module.exports = router;