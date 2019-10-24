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
export class HostUser extends Model<HostUser> {
  @PrimaryKey
  @Column(DataType.TEXT)
  public hostUserId!: string;

  @Column(DataType.TEXT)
  public hostUserPassword!: string;

  @Column(DataType.TEXT)
  public hostUserName!: string;

  @Column(DataType.TEXT)
  public hostUserEmail!: string;

  @Column(DataType.TEXT)
  public hostUserPhoneNumber!: string;

  @Column(DataType.TEXT)
  public hostUserProfileImage!: string;

  @Column(DataType.TEXT)
  public hostUserDeviceToken?: string;
}
