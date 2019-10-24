import { Sequelize, DataType, Unique, AllowNull } from "sequelize-typescript";
import "dotenv/config";
import { User } from "./user.model";
import { Host } from "./host.model";
import { HostUser } from "./host.user.model";
import { UserOrder } from "./user.order.model";
import { UserReview } from "./user.review.model";
import { Auth } from "./auth.model";

/* sequelize-typescript config */
const config = {
  database: process.env.MYSQL_DATABASE,
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  host: process.env.MYSQL_HOST,
  dialect: process.env.MYSQL_DIALECT,
  modelPaths: [__dirname + "/models"]
  /*modelMatch: (filename, member) => {
    return (
      filename.substring(0, filename.indexOf(".model")) === member.toLowerCase()
    );
  }*/
};

/* create sequelize instance */
const sequelize: Sequelize = new Sequelize(config);
sequelize.addModels([User, Host, HostUser, UserOrder, UserReview, Auth]);

/* define models */
const user = sequelize.define(
  "User",
  {
    userId: {
      type: DataType.STRING,
      primaryKey: true
    },
    userPassword: {
      type: DataType.STRING
    },
    userName: {
      type: DataType.STRING
    },
    userEmail: {
      type: DataType.STRING
    },
    userPhoneNumber: {
      type: DataType.STRING
    },
    userAddress: {
      type: DataType.STRING
    },
    userProfileImage: {
      type: DataType.STRING
    },
    userDeviceToken: {
      type: DataType.STRING
    }
  },
  { timestamps: false, paranoid: false }
);

const hostUser = sequelize.define("HostUser", {
  hostUserId: {
    type: DataType.STRING,
    primaryKey: true
  },
  hostUserPassword: {
    type: DataType.STRING
  },
  hostUserName: {
    type: DataType.STRING
  },
  hostUserEmail: {
    type: DataType.STRING
  },
  hostUserPhoneNumber: {
    type: DataType.STRING
  },
  hostUserProfileImage: {
    type: DataType.STRING
  },
  hostUserDeviceToken: {
    type: DataType.STRING
  }
});

const host = sequelize.define("Host", {
  hostIdx: {
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  hostUserId: {
    type: DataType.STRING
  },
  hostName: {
    type: DataType.STRING
  },
  hostTel: {
    type: DataType.STRING
  },
  hostAddress: {
    type: DataType.STRING
  },
  hostPostalCode: {
    type: DataType.STRING
  },
  hostLatitude: {
    type: DataType.STRING
  },
  hostLongitude: {
    type: DataType.STRING
  },
  hostIntro: {
    type: DataType.STRING
  },
  hostOpenTime: {
    type: DataType.STRING
  },
  hostCloseTime: {
    type: DataType.STRING
  },
  hostImage: {
    type: DataType.STRING
  }
});

const userOrder = sequelize.define("UserOrder", {
  userId: {
    type: DataType.STRING
  },
  checkIn: {
    type: DataType.DATE
  },
  checkOut: {
    type: DataType.DATE
  },
  paid: {
    type: DataType.INTEGER
  },
  statusCode: {
    type: DataType.INTEGER,
    defaultValue: 0
  },
  gHostIdx: {
    type: DataType.INTEGER
  },
  itemCount: {
    type: DataType.INTEGER
  },
  checkText: {
    type: DataType.STRING
  },
  reciptNumber: {
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  }
});

const userReview = sequelize.define("UserReview", {
  userId: {
    type: DataType.STRING
  },
  review: {
    type: DataType.STRING
  },
  reviewScore: {
    type: DataType.INTEGER
  },
  reviewDate: {
    type: DataType.DATE
  },
  reviewNumber: {
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  }
});

const auth = sequelize.define("Auth", {
  randomString: {
    type: DataType.STRING
  }
});

/* associate settings*/
host.belongsTo(hostUser, {
  foreignKey: "hostUserId"
});

userOrder.belongsTo(user, {
  foreignKey: "userId"
});

userOrder.belongsTo(host, {
  foreignKey: "hostIdx"
});

userReview.belongsTo(user, {
  foreignKey: "userId"
});

userReview.belongsTo(host, {
  foreignKey: "hostIdx"
});

auth.belongsTo(user, {
  foreignKey: "userId"
});

auth.belongsTo(userOrder, {
  foreignKey: "reciptNumber"
});

/* export */

export default sequelize;
