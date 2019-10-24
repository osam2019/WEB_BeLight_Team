import { Hosts } from "../utils/global.interface";
import { Host } from "../models/host.model";
import { Sequelize } from "sequelize-typescript";

/* Define Map Controller Interface */
interface MapControllerInterface {
  getSearchHosts(pos: object): Promise<Hosts>;
}

/* MapController */
class MapController implements MapControllerInterface {
  /* Setting Default constructor */
  public constructor() {}

  /* Get Search Hosts for GoogleMaps. */
  public getSearchHosts(pos: object): Promise<Hosts> {
    let query = `
    SELECT hostName , hostAddress, hostTel, hostPostalCode, hostIdx, hostLatitude, hostLongitude, hostIntro, hostOpenTime, hostCloseTime, hostImage, (SELECT IFNULL(ROUND(AVG(reviewScore)),0) FROM UserReview WHERE UserReview.hostIdx = Host.hostIdx) AS reviewScoreAvg, ( 6371 * acos( cos( radians( ${pos["latitude"]} ) ) * cos( radians( hostLatitude ) ) * cos( radians( hostLongitude ) - radians( ${pos["longitude"]} ) ) + sin( radians( ${pos["latitude"]} ) ) * sin( radians( hostLatitude ) ) ) ) AS distance FROM Host HAVING distance < 10 ORDER BY  distance  DESC
    `;
    /* Old version
    let query = `
    SELECT hostName , hostAddress, hostTel, hostPostalCode, hostIdx, hostLatitude, hostLongitude, hostIntro, hostOpenTime, hostCloseTime, ( 6371 * acos( cos( radians( ${pos["latitude"]} ) ) * cos( radians( hostLatitude ) ) * cos( radians( hostLongitude ) - radians( ${pos["longitude"]} ) ) + sin( radians( ${pos["latitude"]} ) ) * sin( radians( hostLatitude ) ) ) ) AS distance FROM Host HAVING distance < 10 ORDER BY  distance  DESC LIMIT 0 , 3
    `;*/
    return new Promise((resolve, reject) => {
      resolve(
        Host.sequelize.query(query, {
          type: Sequelize.QueryTypes.SELECT
        })
      );
    });
  }
}

export default new MapController();
