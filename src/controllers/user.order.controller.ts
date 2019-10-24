import expressJWT from "../utils/jwt";
import { ResSkeleton, UserOrderList } from "../utils/global.interface";
import { UserOrder } from "../models/user.order.model";
import { Host } from "../models/host.model";
import { HostUser } from "../models/host.user.model";
import { Sequelize } from "sequelize-typescript";
import firebase from "../controllers/fcm.controller";

/* Define UserOrder Controller Interface */
interface UserOrderControllerInterface {
  successMsg: ResSkeleton;
  getOrderList(token: string): Promise<UserOrderList[]>;
  requestNewOrder(reqOrder: object, token: string): Promise<ResSkeleton>;
  updateOrder(reqOrder: object, token: string): Promise<ResSkeleton>;
  withDrawOrder(token: string, reciptNumber: number): Promise<ResSkeleton>;
}

/* UserOrderController */
class UserOrderController implements UserOrderControllerInterface {
  public successMsg: ResSkeleton;

  /* Setting Default successMsg from constructor */
  public constructor() {
    this.successMsg = { status: 200, msg: "success" };
  }

  /* Get UserOrder */
  public getOrderList(token: string): Promise<UserOrderList[]> {
    /* Get UserName, Check-In, Check-Out, 
       Recepit Number, Paid, HostIdx, statusCode
       Host Postal-Code, HostAddress, HostUserPhoneNumber, HostName
    */
    return new Promise((resolve, reject) => {
      let userId = expressJWT.verifyToken(token).userId;
      let query = `   
SELECT
a.userId as userId,
a.checkIn as checkin,
a.checkOut as checkOut,
a.paid as paid,
a.reciptNumber as reciptNumber,
a.HostIdx as hostIdx,
a.statusCode as statusCode,
a.gHostIdx as gHostIdx,
a.itemCount as itemCount,

b.hostAddress as hostaddress,
b.hostPostalCode as hostPostalCode,
b.hostName as hostName,
(select hostUserPhoneNumber from HostUser where hostuserId = b.hostUserId) as hostUserPhoneNumber,

c.hostAddress as gHostAddress,
c.hostPostalCode as gHostPostalCode,
c.hostName as gHostName,
(select hostUserPhoneNumber from HostUser where hostUserId = c.hostUserId) as gHostUserPhoneNumber

FROM
UserOrder as a

LEFT OUTER JOIN Host as b
ON a.hostIdx = b.hostIdx

LEFT OUTER join Host as c
ON a.gHostIdx = c.hostIdx

WHERE a.userId = "${userId}"`;

      if (userId) {
        resolve(
          UserOrder.sequelize.query(query, {
            type: Sequelize.QueryTypes.SELECT
          })
        );
      } else {
        reject("Your Token is not valid. or Expired.");
      }
    });
  }

  /* Request New Order */

  /*
      statusCode Default Value = 0,
      0 = Wating
      1 = Accept
      -1 = Refuse
  */
  public requestNewOrder(
    reqOrder: object,
    token: string
  ): Promise<ResSkeleton> {
    return new Promise((resolve, reject) => {
      let userId = expressJWT.verifyToken(token).userId;

      if (userId) {
        UserOrder.create({
          userId: userId,
          checkIn: reqOrder["checkIn"],
          checkOut: reqOrder["checkOut"],
          paid: reqOrder["paid"],
          hostIdx: reqOrder["hostIdx"],
          gHostIdx: Number.parseInt(reqOrder["gHostIdx"]),
          itemCount: reqOrder["itemCount"]
          // TODO: Calculate Paid, Host Mapping Code
        })
          .then(order => {
            this.requestNewOrderPush(reqOrder["hostIdx"]);
            resolve(this.successMsg);
          })
          .catch(() => {
            reject("Request New Order Faild.");
          });
      } else {
        reject("Your Token is Expired.");
      }
    });
  }

  /* Send Accept Order Push Notifications to host, ghost*/

  public async requestNewOrderPush(hostIdx: number) {
    let query = `
    SELECT B.hostUserDeviceToken, B.hostUserName FROM Host as A, HostUser as B WHERE hostIdx = ${hostIdx} AND A.hostUserId = B.hostUserId
    `;

    let result = await Host.sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT
    });

    let deviceToken = result[0].hostUserDeviceToken;
    let hostUserName = result[0].hostUserName;

    firebase.push(
      deviceToken,
      `${hostUserName}님 새로운 예약이 신청 되었습니다.`
    );
  }

  /* Update Order*/
  public updateOrder(reqOrder: object, token: string): Promise<ResSkeleton> {
    return new Promise((resolve, reject) => {
      let userId: string = expressJWT.verifyToken(token).userId;

      if (userId) {
        UserOrder.update(
          {
            checkIn: reqOrder["checkIn"],
            checkOut: reqOrder["checkOut"],
            itemCount: reqOrder["itemCount"]
          },
          {
            where: {
              userId: userId,
              reciptNumber: reqOrder["reciptNumber"]
            }
          }
        )
          .then(update => {
            if (update.toString() !== "0") resolve(this.successMsg);
            else reject("Your Request is not valid.");
          })
          .catch(() => {
            reject("Your Request Faild.");
          });
      } else {
        reject("Your Token is not valid. or Expired.");
      }
    });
  }

  /* withDraw Order */
  public withDrawOrder(
    token: string,
    reciptNumber: number
  ): Promise<ResSkeleton> {
    return new Promise((resolve, reject) => {
      let userId: string = expressJWT.verifyToken(token).userId;
      if (userId) {
        UserOrder.destroy({
          where: {
            reciptNumber,
            userId
          }
        })
          .then(result => {
            if (result) resolve(this.successMsg);
            else reject("Your Request is not valid.");
          })
          .catch(msg => {
            reject("Your Permission Denied.");
          });
      } else {
        reject("Your Token is not valid. or Expired.");
      }
    });
  }
}

export default new UserOrderController();
