import * as multer from "multer";
import * as path from "path";

class BeLightFile {
  public option: multer.Instance;
  public storage: multer.StorageEngine;

  constructor() {
    /* Define Storage */
    this.storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "./public_dist/upload");
      },
      filename: (req, file, cb) => {
        cb(null, new Date().valueOf() + path.extname(file.originalname));
      }
    });

    /* Settings Multer Options */
    this.option = multer({
      dest: "./public_dist/upload",
      limits: { fileSize: 5 * 1024 * 1024 },
      storage: this.storage
    });
  }
}

export default new BeLightFile();
