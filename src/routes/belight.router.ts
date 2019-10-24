import { Request, Response } from "express";
import * as multer from "multer";
import UserController from "../controllers/user.controller";
import HostUserController from "../controllers/host.user.controller";
import HostController from "../controllers/host.controller";
import UserOrderController from "../controllers/user.order.controller";
import MapController from "../controllers/map.controller";
import UserReviewController from "../controllers/user.review.controller";
import AuthController from "../controllers/auth.controller";
import firebase from "../controllers/fcm.controller";
import expressJWT from "../utils/jwt";
import upload from "../utils/file";
import validate from "../utils/validate";

export class Routes {
  public routes(app): void {
    /* Main Page Routing */
    app.route("/").get((req: Request, res: Response) => {
      UserReviewController.getLastReviews(3).then(result => {
        res.render("index", {
          title: "BeLight",
          message: "Express.js + Pug + Webpack + Typescript + SaSS",
          reviews: result
        });
      });
    });

    /* Place Page Routing */
    app.route("/place").get(multer().none(), (req: Request, res: Response) => {
      const dropPlace = req.query.dropPlace;
      const latitude = req.query.latitude;
      const longitude = req.query.longitude;

      MapController.getSearchHosts({ latitude, longitude }).then(list => {
        res.render("place", {
          title: "BeLight Search Places",
          hostList: list
        });
      });
    });

    /* Reserve Pending Routing */
    app.route("/pending").get((req: Request, res: Response) => {
      res.render("reserve_pending", {
        title: "BeLight",
        bagCount: req.query.bagCount
      });
    });

    /* API test */
    app.route("/tests").post((req: Request, res: Response) => {
      /*firebase.push("test").then(result => {
        console.log("---");
        console.log(result);
        res.send(result);
      });*/
    });

    /* change test page routing */
    app.route("/test").get((req: Request, res: Response) => {
      res.render("test", {
        title: "BeLight",
        message: "Express.js + Pug + Webpack + Typescript + SaSS"
      });
    });

    // User =====
    /* User Login */
    app
      .route("/api/auth/login")
      .post(multer().none(), (req: Request, res: Response) => {
        let id: string = validate.replaceSpace(req.body.userId);
        let pw: string = validate.replaceSpace(req.body.userPassword);
        if (req.cookies.user) {
          res.redirect("/");
          return;
        }

        UserController.login(id, pw)
          .then(user => {
            let token: string = expressJWT.getToken(user);
            let public_info = {
              userName: user.userName,
              userEmail: user.userEmail
            };

            res.cookie("public_user", public_info);
            res.cookie("user", token); // token save - req.cookies.user
            res.json({ status: 200, token: token }); // return token
          })
          .catch(msg => {
            res.json({ status: 400, msg: msg });
          });
      });

    /* User Register */
    app
      .route("/api/auth/register")
      .post(multer().none(), (req: Request, res: Response) => {
        if (req.cookies.user) {
          res.redirect("/");
          return;
        }

        let reqUser: object = {
          id: validate.replaceSpace(req.body.userId),
          pw: validate.replaceSpace(req.body.userPassword),
          name: validate.replaceSpace(req.body.userName),
          email: validate.replaceSpace(req.body.userEmail),
          phone: validate.replaceSpace(req.body.userPhoneNumber),
          address: validate.replaceSpace(req.body.userAddress),
          deviceToken: validate.replaceSpace(
            req.body.userDeviceToken ? req.body.userDeviceToken : ""
          )
        };

        UserController.register(reqUser)
          .then(user => {
            res.json(user);
          })
          .catch(msg => {
            res.json({ status: 400, msg: msg });
          });
      });

    /* Bring User Profile */
    app.route("/api/user").get((req: Request, res: Response) => {
      UserController.bringMyProfile(req.cookies.user)
        .then(user => {
          res.json({ status: 200, msg: "Get Your Profile..", user: user });
        })
        .catch(msg => {
          res.clearCookie("user");
          res.status(403).json({ status: 403, msg: msg });
        });
    });

    /* Update My Profile */
    app
      .route("/api/user")
      .put(upload.option.single("profile"), (req: Request, res: Response) => {
        let profileImage: string = req.file
          ? "/upload/" + req.file.filename
          : "";

        let reqUser: object = {
          email: req.body.userEmail,
          phone: req.body.userPhoneNumber,
          address: req.body.userAddress,
          password: req.body.userPassword,
          profileImage
        };

        UserController.updateMyProfile(reqUser, req.cookies.user)
          .then(user => {
            res.json(user);
          })
          .catch(msg => {
            res.clearCookie("user");
            res.status(403).json({ status: 403, msg: msg });
          });
      });

    /* Destory User */
    app.route("/api/user").delete((req: Request, res: Response) => {
      let userPassword: string = req.body.userPassword;

      UserController.withDraw(userPassword, req.cookies.user)
        .then(user => {
          res.clearCookie("user");
          res.json(user);
        })
        .catch(msg => {
          res.status(400).json({ status: 400, msg: msg });
        });
    });

    // HostUser ---
    /* HostUser Login */
    app.route("/api/auth/hoster/login").post((req: Request, res: Response) => {
      let id: string = validate.replaceSpace(req.body.hostUserId);
      let pw: string = validate.replaceSpace(req.body.hostUserPassword);
      if (req.cookies.host) {
        res.redirect("/");
        return;
      }

      HostUserController.login(id, pw)
        .then(user => {
          let token: string = expressJWT.getToken(user);
          let public_info = {
            hostUserName: user.hostUserName,
            hostUserEmail: user.hostUserEmail
          };
          res.cookie("public_hostuser", public_info);
          res.cookie("host", token); // token save - req.cookies.host
          res.json({ status: 200, token: token }); // return token
        })
        .catch(msg => {
          res.json({ status: 400, msg: msg });
        });
    });

    /* HostUser Register */
    app.route("/api/hoster/register").post((req: Request, res: Response) => {
      if (req.cookies.host) {
        res.redirect("/");
        return;
      }

      let reqHost: object = {
        hostUserId: validate.replaceSpace(req.body.hostUserId),
        hostUserPassword: validate.replaceSpace(req.body.hostUserPassword),
        hostUserName: validate.replaceSpace(req.body.hostUserName),
        hostUserEmail: validate.replaceSpace(req.body.hostUserEmail),
        hostUserPhoneNumber: validate.replaceSpace(
          req.body.hostUserPhoneNumber
        ),
        hostUserDeviceToken: req.body.hostUserDeviceToken
          ? validate.replaceSpace(req.body.hostUserDeviceToken)
          : ""
      };

      HostUserController.register(reqHost)
        .then(host => {
          res.json(host);
        })
        .catch(msg => {
          res.json({ status: 400, msg: msg });
        });
    });

    /* HostUser Get Profile */
    app.route("/api/hoster").get((req: Request, res: Response) => {
      HostUserController.bringHostProfile(req.cookies.host)
        .then(host => {
          res.json({ status: 200, msg: "Get Your Profile..", user: host });
        })
        .catch(msg => {
          res.clearCookie("host");
          res.status(403).json({ status: 403, msg: msg });
        });
    });

    /* HostUser Profile Update */
    app
      .route("/api/hoster")
      .put(upload.option.single("profile"), (req: Request, res: Response) => {
        let profileImage: string = req.file
          ? "/upload/" + req.file.filename
          : "";

        let reqUser: object = {
          hostUserEmail: req.body.hostUserEmail,
          hostUserPhoneNumber: req.body.hostUserPhoneNumber,
          hostUserName: req.body.hostUserName,
          hostUserPassword: req.body.hostUserPassword,
          profileImage
        };

        HostUserController.updateHostProfile(reqUser, req.cookies.host)
          .then(host => {
            res.json(host);
          })
          .catch(msg => {
            res.clearCookie("host");
            res.status(403).json({ status: 403, msg: msg });
          });
      });

    /* HostUser Destroy */
    app.route("/api/hoster").delete((req: Request, res: Response) => {
      let hostUserPassword: string = req.body.hostUserPassword;

      HostUserController.hostWithDraw(hostUserPassword, req.cookies.host)
        .then(host => {
          res.clearCookie("host");
          res.json(host);
        })
        .catch(msg => {
          res.status(400).json({ status: 400, msg: msg });
        });
    });

    /* HostUser get Accept UserOrder */
    app.route("/api/hoster/order/all").get((req: Request, res: Response) => {
      HostUserController.getAcceptUserOrder(req.cookies.host, 1)
        .then(result => {
          res.json(result);
        })
        .catch(msg => {
          res.status(400).json({ status: 400, msg });
        });
    });

    /* HostUser Accept/Non-Accept UserOrder */
    app.route("/api/hoster/order").put((req: Request, res: Response) => {
      let reciptNumber = req.body.reciptNumber;
      let accept: number = Number.parseInt(req.body.accept);

      HostUserController.acceptUserOrder(req.cookies.host, reciptNumber, accept)
        .then(result => {
          res
            .status(200)
            .json({ status: 200, msg: "success", changeValue: result[1] });
        })
        .catch(msg => {
          res.status(400).json({ status: 400, msg });
        });
    });

    /* Hostuser get Pending UserOrder */
    app
      .route("/api/hoster/order/pending")
      .get((req: Request, res: Response) => {
        HostUserController.getAcceptUserOrder(req.cookies.host, 0)
          .then(result => {
            res.json(result);
          })
          .catch(msg => {
            res.status(400).json({ status: 400, msg });
          });
      });

    /* HostUser Get User Item Process */
    app
      .route("/api/hoster/order/status")
      .post((req: Request, res: Response) => {
        let randomString: string = req.body.randomString;
        let userId: string = req.body.userId;
        let reciptNumber: number = req.body.reciptNumber;

        AuthController.createAuth(randomString, userId, reciptNumber, 2).then(
          result => {
            res.json(result);
          }
        );
      });

    /* Update UserOrder StatusCode Process */
    app.route("/api/user/order/status").post((req: Request, res: Response) => {
      let randomString: string = req.body.randomString;
      let userId: string = req.body.userId;
      let reciptNumber: number = req.body.reciptNumber;

      AuthController.updateDone(randomString, userId, reciptNumber, 3).then(
        result => {
          result[1] === 1
            ? res.json({ status: 200, msg: "success" })
            : res.json({ status: 400, msg: "bad request" });
        }
      );
    });

    // Host =====
    /* Get all Host */
    app.route("/api/host").get((req: Request, res: Response) => {
      HostController.getAllHost(req.cookies.host)
        .then(host => {
          res.json(host);
        })
        .catch(msg => {
          res.status(400).json({ status: 400, msg });
        });
    });

    /* Add New Host */
    app
      .route("/api/host")
      .post(
        upload.option.single("hostImage"),
        (req: Request, res: Response) => {
          let hostImage: string = req.file
            ? "/upload/" + req.file.filename
            : "";

          let hostObj: object = {
            hostName: req.body.hostName,
            hostTel: req.body.hostTel,
            hostAddress: req.body.hostAddress,
            hostPostalCode: req.body.hostPostalCode,
            hostLatitude: req.body.hostLatitude,
            hostLongitude: req.body.hostLongitude,
            hostIntro: req.body.hostIntro,
            hostOpenTime: req.body.hostOpenTime,
            hostCloseTime: req.body.hostCloseTime,
            hostImage
          };

          HostController.addNewHost(req.cookies.host, hostObj)
            .then(msg => {
              res.json(msg);
            })
            .catch(msg => {
              res.status(400).json({ status: 400, msg });
            });
        }
      );

    /* update Host */
    app
      .route("/api/host")
      .put(upload.option.single("hostImage"), (req: Request, res: Response) => {
        let hostImage: string = req.file ? "/upload/" + req.file.filename : "";

        let hostObj: object = {
          hostName: req.body.hostName,
          hostTel: req.body.hostTel,
          hostAddress: req.body.hostAddress,
          hostPostalCode: req.body.hostPostalCode,
          hostLatitude: req.body.hostLatitude,
          hostLongitude: req.body.hostLongitude,
          hostIntro: req.body.hostIntro,
          hostOpenTime: req.body.hostOpenTime,
          hostCloseTime: req.body.hostCloseTime,
          hostImage
        };

        HostController.updateHost(req.cookies.host, req.body.idx, hostObj)
          .then(msg => {
            res.json(msg);
          })
          .catch(msg => {
            res.status(400).json({ status: 400, msg });
          });
      });

    /* Destroy Host */
    app.route("/api/host").delete((req: Request, res: Response) => {
      HostController.withDrawHost(req.body.hostIdx, req.cookies.host)
        .then(msg => {
          res.json(msg);
        })
        .catch(msg => {
          res.status(400).json({ status: 400, msg });
        });
    });

    // UserOrder =====
    /* Get User Order List */
    app.route("/api/user/order").get((req: Request, res: Response) => {
      if (!req.cookies.user) {
        res.redirect("/");
        return;
      }
      UserOrderController.getOrderList(req.cookies.user)
        .then(order => {
          res.json(order);
        })
        .catch(msg => {
          res.status(400).json({ status: 400, msg });
        });
    });

    /* Request New User Order */
    app
      .route("/api/user/order")
      .post(multer().none(), (req: Request, res: Response) => {
        if (!req.cookies.user) {
          res.redirect("/");
          return;
        }

        let reqOrder: object = {
          checkIn: req.body.checkIn,
          checkOut: req.body.checkOut,
          paid: req.body.paid,
          hostIdx: req.body.hostIdx,
          gHostIdx: req.body.gHostIdx,
          itemCount: req.body.itemCount
        };

        UserOrderController.requestNewOrder(reqOrder, req.cookies.user)
          .then(order => {
            res.json(order);
          })
          .catch(msg => {
            res.json({ status: 400, msg: msg });
          });
      });

    /* Update User Order */
    app.route("/api/user/order").put((req: Request, res: Response) => {
      if (!req.cookies.user) {
        res.redirect("/");
        return;
      }

      let reqOrder: object = {
        checkIn: req.body.checkIn,
        checkOut: req.body.checkOut,
        reciptNumber: req.body.reciptNumber,
        itemCount: req.body.itemCount
      };

      UserOrderController.updateOrder(reqOrder, req.cookies.user)
        .then(result => {
          res.json(result);
        })
        .catch(msg => {
          res.json({ status: 400, msg });
        });
    });

    /* Destroy UserOrder */
    app.route("/api/user/order").delete((req: Request, res: Response) => {
      if (!req.cookies.user) {
        res.redirect("/");
        return;
      }
      const reciptNumber = req.body.reciptNumber;
      UserOrderController.withDrawOrder(req.cookies.user, reciptNumber)
        .then(cancel => {
          res.json(cancel);
        })
        .catch(msg => {
          res.json({ status: 400, msg });
        });
    });

    //Map =====
    /* Get Hosts for Google Maps */
    app.route("/api/map/hosts").get((req: Request, res: Response) => {
      const pos = {
        latitude: req.query.latitude,
        longitude: req.query.longitude
      };

      MapController.getSearchHosts(pos)
        .then(hosts => {
          console.log(hosts);
          res.json(hosts);
        })
        .catch(msg => {
          res.json({ status: 400, msg });
        });
    });

    // Review =====
    /* Get All Reviews */
    app.route("/api/reviews").get((req: Request, res: Response) => {
      const hostIdx = req.query.hostIdx;

      UserReviewController.getAllReviews(hostIdx)
        .then(reviews => {
          res.json(reviews);
        })
        .catch(msg => {
          res.json({ status: 400, msg });
        });
    });

    /* Get 5 Reviews */
    app.route("/api/reviews/:count").get((req: Request, res: Response) => {
      const count: number = Number.parseInt(req.params.count);
      UserReviewController.getLastReviews(count)
        .then(reviews => {
          res.json(reviews);
        })
        .catch(msg => {
          res.json({ status: 400, msg });
        });
    });

    /* Get User Reviews */
    app.route("/api/review").get((req: Request, res: Response) => {
      UserReviewController.getUserReviews(req.cookies.user)
        .then(reviews => {
          res.json(reviews);
        })
        .catch(msg => {
          res.json({ status: 400, msg });
        });
    });

    /* Create New Review */
    app.route("/api/review").post((req: Request, res: Response) => {
      if (!req.cookies.user) {
        res.redirect("/");
        return;
      }

      const revObj = {
        review: req.body.review,
        reviewScore: req.body.reviewScore,
        hostIdx: req.body.hostIdx
      };

      UserReviewController.createReview(req.cookies.user, revObj)
        .then(result => {
          res.json(result);
        })
        .catch(msg => {
          res.json({ status: 400, msg });
        });
    });

    /* Update Review */
    app.route("/api/review").put((req: Request, res: Response) => {
      if (!req.cookies.user) {
        res.redirect("/");
        return;
      }
      const reviewNumber = req.body.reviewNumber;
      const revObj = {
        review: req.body.review,
        reviewScore: req.body.reviewScore,
        hostIdx: req.body.hostIdx
      };

      UserReviewController.updateReview(req.cookies.user, reviewNumber, revObj)
        .then(result => {
          res.json(result);
        })
        .catch(msg => {
          res.json({ status: 400, msg });
        });
    });

    /* Delete Review */
    app.route("/api/review/").delete((req: Request, res: Response) => {
      if (!req.cookies.user) {
        res.redirect("/");
        return;
      }

      const reviewNumber = req.body.reviewNumber;
      const hostIdx = req.body.hostIdx;

      UserReviewController.deleteReview(req.cookies.user, reviewNumber, hostIdx)
        .then(result => {
          res.json(result);
        })
        .catch(msg => {
          res.json({ status: 400, msg });
        });
    });
  }
}
