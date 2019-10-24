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
export class UserOrder extends Model<UserOrder> {
  @Column(DataType.TEXT)
  public userId!: string;

  @Column(DataType.TEXT)
  public checkIn!: Date;

  @Column(DataType.DATE)
  public checkOut!: Date;

  @Column(DataType.INTEGER)
  public paid!: number;

  @Column(DataType.TEXT)
  public hostIdx!: string;

  @Column(DataType.INTEGER)
  public gHostIdx!: number;

  @Column(DataType.INTEGER)
  public itemCount!: number;

  @Column(DataType.INTEGER)
  public statusCode!: number;

  @Column(DataType.TEXT)
  public checkText!: string;

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  public reciptNumber!: number;
}
