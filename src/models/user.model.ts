import {
  Model,
  Column,
  Table,
  PrimaryKey,
  Unique,
  AutoIncrement,
  DataType
} from "sequelize-typescript";

@Table
export class User extends Model<User> {
  @PrimaryKey
  @Column(DataType.TEXT)
  public userId!: string;

  @Column(DataType.TEXT)
  public userPassword!: string;

  @Column(DataType.TEXT)
  public userName!: string;

  @Column(DataType.TEXT)
  public userEmail!: string;

  @Column(DataType.TEXT)
  public userPhoneNumber!: string;

  @Column(DataType.TEXT)
  public userAddress!: string;

  @Column(DataType.TEXT)
  public userProfileImage!: string;

  @Column(DataType.TEXT)
  public userDeviceToken?: string;
}
