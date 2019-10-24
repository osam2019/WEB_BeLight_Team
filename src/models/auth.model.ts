import { Model, Column, Table, DataType } from "sequelize-typescript";

@Table
export class Auth extends Model<Auth> {
  @Column(DataType.TEXT)
  public randomString!: string;

  @Column(DataType.TEXT)
  public userId!: string;

  @Column(DataType.INTEGER)
  public reciptNumber!: number;
}
//LEFT(MD5(NOW()), 6)
