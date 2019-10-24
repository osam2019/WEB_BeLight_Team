import expressJWT from "../utils/jwt";
import { ResSkeleton, ResponseUser } from "../utils/global.interface";
import { User } from "../models/user.model";

/* Define User Controller Interface */
interface UserControllerInterface {
  successMsg: ResSkeleton;
  login(id: string, pw: string): Promise<ResponseUser>;
  register(reqUser: object): Promise<ResSkeleton>;
  bringMyProfile(token: string): Promise<ResponseUser>;
  updateMyProfile(reqUser: object, token: string): Promise<ResSkeleton>;
  withDraw(pw: string, token: string): Promise<ResSkeleton>;
}

/* UserController */
class UserController implements UserControllerInterface {
  public successMsg: ResSkeleton;

  /* Setting Default sucessMsg from constructor */
  public constructor() {
    this.successMsg = { status: 200, msg: "success" };
  }

  /* User Login */
  public login(id: string, pw: string): Promise<ResponseUser> {
    return new Promise((resolve, reject) => {
      User.findOne({
        where: { userId: id, userPassword: pw },
        attributes: { exclude: ["userPassword"] }
      }).then(user => {
        if (user) resolve(user);
        else reject("ID and Password is not valid");
      });
    });
  }

  /* User Register */
  public register(reqUser: object): Promise<ResSkeleton> {
    return new Promise((resolve, reject) => {
      User.findOne({ where: { userId: reqUser["id"] } }).then(user => {
        if (!user) {
          User.create({
            userId: reqUser["id"],
            userPassword: reqUser["pw"],
            userName: reqUser["name"],
            userEmail: reqUser["email"],
            userPhoneNumber: reqUser["phone"],
            userAddress: reqUser["address"],
            userDeviceToken: reqUser["deviceToken"]
          }).then(user => {
            resolve(this.successMsg);
          });
        } else {
          reject("ID Already Exists.");
        }
      });
    });
  }

  /* Get User Profile */
  public bringMyProfile(token: string): Promise<ResponseUser> {
    return new Promise((resolve, reject) => {
      let tokens = expressJWT.verifyToken(token);

      if (tokens) {
        User.findOne({
          where: { userId: tokens.userId },
          attributes: {
            exclude: ["userPassword"]
          }
        }).then(user => {
          resolve(user);
        });
      } else {
        reject("Your token is Expired.");
      }
    });
  }

  /* Update User Profile */
  public updateMyProfile(reqUser: object, token: string): Promise<ResSkeleton> {
    return new Promise((resolve, reject) => {
      let tokens = expressJWT.verifyToken(token);

      if (tokens) {
        User.update(
          {
            userEmail: reqUser["email"],
            userPhoneNumber: reqUser["phone"],
            userAddress: reqUser["address"],
            userPassword: reqUser["password"],
            userProfileImage: reqUser["profileImage"]
          },
          {
            where: { userId: tokens.userId },
            returning: false
          }
        )
          .then(user => {
            resolve(this.successMsg);
          })
          .catch(() => {
            reject("Request is not valid");
          });
      } else {
        reject("Maybe Token Expired.");
      }
    });
  }

  /* Destroy User */
  public withDraw(pw: string, token: string): Promise<ResSkeleton> {
    return new Promise((resolve, reject) => {
      let userId = expressJWT.verifyToken(token).userId;
      if (userId) {
        User.destroy({
          where: {
            userId: userId,
            userPassword: pw
          }
        })
          .then(result => {
            if (result) resolve(this.successMsg);
            else reject("Id and Password is not valid");
          })
          .catch(() => {
            reject("ID and Password is not valid");
          });
      } else {
        reject("Maybe Token Expired.");
      }
    });
  }
}

export default new UserController();
