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
export class UserReview extends Model<UserReview> {
  @Column(DataType.TEXT)
  public userId!: string;

  @Column(DataType.TEXT)
  public hostIdx!: string;

  @Column(DataType.TEXT)
  public review!: string;

  @Column(DataType.INTEGER)
  public reviewScore!: number;

  @Column(DataType.DATE)
  public reviewDate!: Date;

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  public reviewNumber!: number;
}
