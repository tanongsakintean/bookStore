const express = require("express");
const router = express.Router();
const shelvesRouter = require("./shelves");
const bookRouter = require("./books");

router.use("/", shelvesRouter);
router.use("/", bookRouter);

module.exports = router;
