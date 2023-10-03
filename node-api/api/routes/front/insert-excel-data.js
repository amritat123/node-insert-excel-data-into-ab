const express = require("express");
const router = express.Router();
const InsertExcelDataController = require("../../controller/front/insert-excel-data");
const multer = require("multer");
const fs = require("fs");
const Helper = require("../../helper/index");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/excel/");
  },
  filename: function (req, file, cb) {
    cb(null, Helper.generateRandomString(5) + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "application/zip" ||
    file.mimetype === "application/vnd.ms-excel" ||
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only Excel and Zip files are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

router.post(
  "/insert-data",
  upload.single("excel"),
  InsertExcelDataController.insertExcelDataIntoMongo
);

module.exports = router;
