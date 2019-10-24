import expressJWT from "../utils/jwt";
import {
  ResSkeleton,
  ReviewList,
  ReviewObject
} from "../utils/global.interface";
import { UserReview } from "../models/user.review.model";
import { Sequelize } from "sequelize-typescript";
import * as dateFormat from "dateformat";

/* Define UserReviewController Interface */
interface UserReviewControllerInterface {
  successMsg: ResSkeleton;
  getAllReviews(hostIdx: number): Promise<ReviewList[]>;
  getLastReviews(count: number): Promise<ReviewList[]>;
  createReview(token: string, revObj: object): Promise<ResSkeleton>;
  updateReview(
    token: string,
    reviewNumber,
    revObj: object
  ): Promise<ResSkeleton>;
  deleteReview(
    token: string,
    reviewNumber,
    hostIdx: number
  ): Promise<ResSkeleton>;
}

class UserReviewController implements UserReviewControllerInterface {
  public successMsg: ResSkeleton;

  /* Setting Default successMsg from constructor */
  public constructor() {
    this.successMsg = { status: 200, msg: "success" };
  }

  /* Get All Reviews */
  public getAllReviews(hostIdx: number): Promise<ReviewList[]> {
    /* Get userId, review, reviewScore, reviewNumber, hostIdx */
    return new Promise((resolve, reject) => {
      UserReview.findAll({
        where: {
          hostIdx
        }
      }).then(reviews => {
        resolve(reviews);
      });
    });
  }

  /* Get Last Reviews */
  public getLastReviews(count: number): Promise<ReviewList[]> {
    return new Promise((resolve, reject) => {
      UserReview.findAll({
        limit: count,
        order: [["reviewNumber", "DESC"]]
      }).then(lastReview => {
        resolve(lastReview);
      });
    });
  }

  /* Get User Reviews */
  public getUserReviews(token: string): Promise<ReviewList[]> {
    let userId = expressJWT.verifyToken(token).userId;

    return new Promise((resolve, reject) => {
      if (userId) {
        UserReview.findAll({
          where: { userId }
        }).then(result => {
          resolve(result);
        });
      } else {
        reject("Your Token is not valid or Expired.");
      }
    });
  }

  /* Create New Review */
  public createReview(
    token: string,
    revObj: ReviewObject
  ): Promise<ResSkeleton> {
    return new Promise((resolve, reject) => {
      let userId: string = expressJWT.verifyToken(token).userId;
      const now: string = dateFormat(new Date(), "yyyy-mm-dd");
      if (userId) {
        UserReview.create({
          userId,
          review: revObj["review"],
          reviewScore: revObj["reviewScore"],
          hostIdx: revObj["hostIdx"],
          reviewDate: now
        }).then(result => {
          resolve(this.successMsg);
        });
      } else {
        reject("Your Token is not valid. or Expired.");
      }
    });
  }

  /* Update Review */
  public updateReview(
    token: string,
    reviewNumber: number,
    revObj: ReviewObject
  ): Promise<ResSkeleton> {
    return new Promise((resolve, reject) => {
      let userId = expressJWT.verifyToken(token).userId;
      const now: string = dateFormat(new Date(), "yyyy-mm-dd HH:MM");
      if (userId) {
        UserReview.update(
          {
            review: revObj["review"],
            reviewScore: revObj["reviewScore"],
            reviewDate: now
          },
          {
            where: {
              hostIdx: revObj["hostIdx"],
              userId,
              reviewNumber
            },
            returning: false
          }
        )
          .then(msg => {
            if (msg.toString() !== "0") resolve(this.successMsg);
            else reject("Request is not valid");
          })
          .catch(() => {
            reject("Request is not valid.");
          });
      } else {
        reject("Your Token is not valid. or Expired.");
      }
    });
  }

  /* Delete Review */
  public deleteReview(
    token: string,
    reviewNumber: number,
    hostIdx: number
  ): Promise<ResSkeleton> {
    return new Promise((resolve, reject) => {
      let userId = expressJWT.verifyToken(token).userId;
      if (userId) {
        UserReview.destroy({
          where: {
            hostIdx,
            userId,
            reviewNumber
          }
        }).then(result => {
          if (result) resolve(this.successMsg);
          else reject("Your Request is not valid.");
        });
      } else {
        reject("Your Token is not valid. or Expired.");
      }
    });
  }
}

export default new UserReviewController();
