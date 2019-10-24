import { ResSkeleton } from "../utils/global.interface";
import { Auth } from "../models/auth.model";
import { UserOrder } from "../models/user.order.model";
import { Sequelize } from "sequelize-typescript";

/* AuthController Interface */
interface AuthControllerInterface {
  successMsg: ResSkeleton;

  createAuth(
    randomString: string,
    userId: string,
    reciptNumber: number,
    accept: number
  ): Promise<any>;

  updateProceeding(
    randomString: string,
    userId: string,
    reciptNumber: number,
    accept: number
  ): Promise<any>;

  updateDone(
    randomString: string,
    userId: string,
    reciptNumber: number,
    accept: number
  ): Promise<any>;
}

/*
    accept === 1 Accept
    accept === 2 Proceeding
    accept === 3 Done
    accept === 0 Pending
    accept === -1 Reject
*/

class AuthController implements AuthControllerInterface {
  public successMsg;
  constructor() {
    this.successMsg = { status: 200, msg: "success" };
  }

  public createAuth(
    randomString: string,
    userId: string,
    reciptNumber: number,
    accept: number
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      Auth.create({
        randomString,
        userId,
        reciptNumber
      })
        .then(res => {
          return res;
        })
        .done(res => {
          this.updateProceeding(
            randomString,
            userId,
            reciptNumber,
            accept
          ).then(res => {
            res[1] === 1 ? resolve(this.successMsg) : reject("somthing errors");
          });
        });
    });
  }

  public updateProceeding(
    randomString: string,
    userId: string,
    reciptNumber: number,
    accept: number
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let query = `
            UPDATE UserOrder SET UserOrder.statusCode = ${accept}, checkText = "${randomString}" WHERE userId = "${userId}" AND reciptNumber = "${reciptNumber}"
        `;

      resolve(
        UserOrder.sequelize
          .query(query, {
            type: Sequelize.QueryTypes.UPDATE
          })
          .catch(err => {
            reject("UPDATE ERROR");
          })
      );
    });
  }
  public updateDone(
    randomString: string,
    userId: string,
    reciptNumber: number,
    accept: number
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let query = `
            UPDATE UserOrder SET UserOrder.statusCode = ${accept} WHERE userId = "${userId}" AND reciptNumber = "${reciptNumber}" AND checkText = "${randomString}"
        `;

      resolve(
        UserOrder.sequelize
          .query(query, {
            type: Sequelize.QueryTypes.UPDATE
          })
          .catch(err => {
            reject("UPDATE ERROR");
          })
      );
    });
  }
}

export default new AuthController();
