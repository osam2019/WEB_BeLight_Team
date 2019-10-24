import expressJWT from "../utils/jwt";
import {
  ResSkeleton,
  ResponseUser,
  ResponseHostUser,
  UserOrderOfHostUser
} from "../utils/global.interface";
import { HostUser } from "../models/host.user.model";
import { UserOrder } from "../models/user.order.model";
import { Sequelize } from "sequelize-typescript";
import firebase from "../controllers/fcm.controller";
import { User } from "../models/user.model";

/* HostUserController Interface */
interface HostUserControllerInterface {
  successMsg: ResSkeleton;
  login(id: string, pw: string): Promise<ResponseHostUser>;
  register(reqHost: object): Promise<ResSkeleton>;
  bringHostProfile(token: string): Promise<ResponseHostUser>;
  updateHostProfile(reqHost: object, token: string): Promise<ResSkeleton>;
  hostWithDraw(pw: string, token: string): Promise<ResSkeleton>;
  getAcceptUserOrder(
    token: string,
    statusCode: number
  ): Promise<UserOrderOfHostUser[]>;
  acceptUserOrder(
    token: string,
    reciptNumber: number,
    accept: number,
    userId: string
  ): Promise<ResSkeleton>;
}

/* Host User Controller */
class HostUserController implements HostUserControllerInterface {
  public successMsg: ResSkeleton;

  /* Settings Default successMsg from constructor */
  public constructor() {
    this.successMsg = { status: 200, msg: "success" };
  }

  /* HostUser Login */
  public login(id: string, pw: string): Promise<ResponseHostUser> {
    return new Promise((resolve, reject) => {
      HostUser.findOne({
        where: { hostUserId: id, hostUserPassword: pw },
        attributes: { exclude: ["hostUserPassword"] }
      }).then(host => {
        if (host) resolve(host);
        else reject("ID and Password is not valid.");
      });
    });
  }

  /* HostUser Register */
  public register(reqHost: object): Promise<ResSkeleton> {
    return new Promise((resolve, reject) => {
      HostUser.findOne({ where: { hostUserId: reqHost["hostUserId"] } }).then(
        host => {
          if (!host) {
            HostUser.create({
              hostUserId: reqHost["hostUserId"],
              hostUserPassword: reqHost["hostUserPassword"],
              hostUserName: reqHost["hostUserName"],
              hostUserEmail: reqHost["hostUserEmail"],
              hostUserPhoneNumber: reqHost["hostUserPhoneNumber"],
              hostUserDeviceToken: reqHost["hostUserDeviceToken"]
            })
              .then(host => {
                resolve(this.successMsg);
              })
              .catch(() => {
                reject("Something Errors.");
              });
          } else {
            reject("Id Already Exists.");
          }
        }
      );
    });
  }

  /* Get Host User Profile */
  public bringHostProfile(token: string): Promise<ResponseHostUser> {
    return new Promise((resolve, reject) => {
      let hostUserId = expressJWT.verifyToken(token).userId;

      if (hostUserId) {
        HostUser.findOne({
          where: { hostUserId: hostUserId },
          attributes: {
            exclude: ["hostUserPassword"]
          }
        }).then(user => {
          console.log(user);
          resolve(user);
        });
      } else {
        reject("Your Token is Expired.");
      }
    });
  }

  /* Update Host User Profile */
  public updateHostProfile(reqHost: object, tok: string): Promise<ResSkeleton> {
    return new Promise((resolve, reject) => {
      let hostUserId = expressJWT.verifyToken(tok).userId;

      if (tok) {
        HostUser.update(
          {
            hostUserEmail: reqHost["hostUserEmail"],
            hostUserName: reqHost["hostUserName"],
            hostUserPhoneNumber: reqHost["hostUserPhoneNumber"],
            hostUserPassword: reqHost["hostUserPassword"],
            hostUserProfileImage: reqHost["profileImage"]
          },
          {
            where: {
              hostUserId: hostUserId
            },
            returning: false
          }
        )
          .then(host => {
            resolve(this.successMsg);
          })
          .catch(() => {
            reject("Request is not valid");
          });
      } else {
        reject("Maybe Token Expired");
      }
    });
  }

  /* Destroy HostUser */
  public hostWithDraw(pw: string, token: string): Promise<ResSkeleton> {
    return new Promise((resolve, reject) => {
      let hostUserId = expressJWT.verifyToken(token).userId;
      if (hostUserId) {
        HostUser.destroy({
          where: {
            hostUserId: hostUserId,
            hostUserPassword: pw
          }
        })
          .then(result => {
            if (result) resolve(this.successMsg);
            else reject("Id and Password is not valid.");
          })
          .catch(() => {
            reject("Id and Password is not valid");
          });
      } else {
        reject("Maybe Token Expired.");
      }
    });
  }

  /* Accept User Order */
  public acceptUserOrder(
    token: string,
    reciptNumber: number,
    accept: number
  ): Promise<ResSkeleton> {
    return new Promise((resolve, reject) => {
      /*
        accept === 1 Accept
        accept === 2 Proceeding
        accept === 3 Done
        accept === 0 Pending
        accept === -1 Reject
      */

      let hostUserId = expressJWT.verifyToken(token).userId;
      if (accept === 1) {
        this.acceptOrderPush(reciptNumber, true);
        let query = `
        UPDATE UserOrder,Host,HostUser SET UserOrder.statusCode = ${accept} WHERE UserOrder.hostIdx = Host.hostIdx AND Host.hostUserId = "${hostUserId}" AND UserOrder.reciptNumber = ${reciptNumber}
        `;
        if (hostUserId) {
          resolve(
            UserOrder.sequelize
              .query(query, {
                type: Sequelize.QueryTypes.UPDATE
              })
              .catch(err => {
                reject("Your Permission denied");
              })
          );
        } else {
          reject("Your Token is Expired.");
        }
      } else if (accept === -1) {
        this.acceptOrderPush(reciptNumber, false);
        let query = `
        UPDATE UserOrder,Host,HostUser SET UserOrder.statusCode = -1 WHERE UserOrder.hostIdx = Host.hostIdx AND Host.hostUserId = "${hostUserId}" AND UserOrder.reciptNumber = ${reciptNumber}
        `;
        if (hostUserId) {
          resolve(
            UserOrder.sequelize.query(query, {
              type: Sequelize.QueryTypes.UPDATE
            })
          );
        } else {
          reject("Your Token is Expired.");
        }
      } else {
        reject("Request is not valid");
      }
    });
  }

  /* Accet User Order Push Notification to User */
  public async acceptOrderPush(reciptNumber: number, reject?: boolean) {
    let char = reject ? "승인" : "거절";
    let query = `
    SELECT A.userDeviceToken, A.userName FROM User as A, UserOrder as B WHERE A.userId = B.userId AND B.reciptNumber = ${reciptNumber}
    `;

    let result = await User.sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT
    });

    let userName = await result[0].userName;
    let deviceToken = await result[0].userDeviceToken;

    firebase.push(deviceToken, `${userName}님 예약이 ${char} 되었습니다.`);
  }

  /* Get Accept UserOrder of HostUser */
  public getAcceptUserOrder(
    token: string,
    statusCode: number
  ): Promise<UserOrderOfHostUser[]> {
    return new Promise((resolve, reject) => {
      let hostUserId = expressJWT.verifyToken(token).userId;
      let query = `
      SELECT DISTINCT a.userId, a.checkIn, a.checkOut, a.paid, a.statusCode, a.gHostIdx, a.itemCount, a.reciptNumber, a.hostIdx FROM UserOrder a, Host b, HostUser c WHERE a.hostIdx = b.hostIdx AND b.hostUserId = "${hostUserId}" AND a.statusCode = ${statusCode}
      `;
      if (hostUserId) {
        resolve(
          HostUser.sequelize.query(query, {
            type: Sequelize.QueryTypes.SELECT
          })
        );
      } else {
        reject("Your Token is not valid or Expired.");
      }
    });
  }
}

export default new HostUserController();
