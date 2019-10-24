import * as QRCode from "qrcode";
import * as path from "path";

interface BeLightQRCodeInterface {
  createQRCodeString(text: string, id: string): string;
}

/* Define Class BeLight QRCode */
class BeLightQRCode implements BeLightQRCodeInterface {
  constructor() {}

  public createQRCodeString(text: string, id: string): string {
    const qrName = new Date().valueOf() + path.extname(text);
    let qrContent = "checkText=" + text + "&userId=" + id;
    QRCode.toFile(
      "./public_dist/qrcode/" + qrName + ".png",
      qrContent,
      { type: "png" },
      err => {
        console.log(err);
      }
    );

    return "/qrcode/" + qrName + ".png";
  }
}

export default new BeLightQRCode();
