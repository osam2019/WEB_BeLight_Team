import * as jwt from "jsonwebtoken";
import { ResponseUser } from "../utils/global.interface";

interface ExpressJWTInterface {
  jwtObj: any;
  getToken(user: any, check: number): string;
  verifyToken(token: string): any;
}

class ExpressJWT implements ExpressJWTInterface {
  public jwtObj;

  constructor() {
    this.jwtObj = <any>{};
    this.jwtObj.secret = "YOUR_SECRET_KEY";
  }

  /* Create JWT Token & Return */
  public getToken(user: any): string {
    let check = user.userId ? user.userId : user.hostUserId;

    let token = jwt.sign(
      {
        userId: check
      },
      this.jwtObj.secret,
      {
        expiresIn: "7d",
        algorithm: "HS256"
      }
    );
    return token;
  }

  /* Verify JWT */
  public verifyToken(token: string): any {
    if (token) {
      return jwt.verify(token, this.jwtObj.secret);
    } else {
      return false;
    }
  }
}

export default new ExpressJWT();
