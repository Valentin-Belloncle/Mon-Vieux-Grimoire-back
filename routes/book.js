const express = require('express');
const router = express.Router();
const bookCtrl = require('../controllers/book')

router.get("/", bookCtrl.getAllBooks);
router.post("/", bookCtrl.createOneBook);
router.get("/bestrating", bookCtrl.getBestBooks);
router.get("/:id", bookCtrl.getOneBook);
router.put("/:id", bookCtrl.modifyOneBook);
router.delete("/:id", bookCtrl.deleteOneBook);

module.exports = router;