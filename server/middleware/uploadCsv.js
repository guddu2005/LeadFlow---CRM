const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadPath = "uploads/csv";

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({

    destination(req, file, cb) {
        cb(null, uploadPath);
    },

    filename(req, file, cb) {
        cb(
            null,
            `${Date.now()}-${file.originalname}`
        );
    }

});

const fileFilter = (req, file, cb) => {

    const ext = path.extname(file.originalname);

    if (ext !== ".csv") {
        return cb(
            new Error("Only CSV files are allowed")
        );
    }

    cb(null, true);

};

module.exports = multer({
    storage,
    fileFilter
});