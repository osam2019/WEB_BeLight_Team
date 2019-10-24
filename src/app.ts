import * as express from "express";
import * as bodyParser from "body-parser";
import * as path from "path";
import * as cookieParser from "cookie-parser";
import * as methodOverride from "method-override";
import { Routes } from "./routes/belight.router";

class App {
  public app: express.Application;
  public routePrv: Routes = new Routes();
  constructor() {
    /* app settings */
    this.app = express();

    /* set view folders, pug engine */
    this.app.set("views", path.join(__dirname, "views"));
    this.app.set("view engine", "pug");

    /* use body-parser */
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));

    /* use method-override */
    this.app.use(methodOverride("_method"));

    /* use cookie-parser */
    this.app.use(cookieParser());

    /* setting default static folder */
    this.app.use(express.static("public_dist"));
    this.app.use(express.static("public_dist/svg"));
    this.app.use(express.static("public_dist/upload"));
    this.app.use(express.static("public_dist/qrcode"));

    /* routing settings */
    this.routePrv.routes(this.app);
  }
}

export default new App().app;
