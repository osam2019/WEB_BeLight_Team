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
export class Host extends Model<Host> {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  public hostIdx!: number;

  @Column(DataType.TEXT)
  public hostUserId!: string;

  @Column(DataType.TEXT)
  public hostName!: string;

  @Column(DataType.TEXT)
  public hostTel!: string;

  @Column(DataType.TEXT)
  public hostAddress!: string;

  @Column(DataType.TEXT)
  public hostPostalCode!: string;

  @Column(DataType.TEXT)
  public hostLatitude!: string;

  @Column(DataType.TEXT)
  public hostLongitude!: string;

  @Column(DataType.TEXT)
  public hostIntro!: string;

  @Column(DataType.TEXT)
  public hostOpenTime!: string;

  @Column(DataType.TEXT)
  public hostCloseTime!: string;

  @Column(DataType.TEXT)
  public hostImage!: string;
}
