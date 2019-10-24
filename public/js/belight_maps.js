class BeLightMaps {
  constructor() {
    if (!navigator.geolocation) {
      alert("위치 서비스를 허용 해주세요.");
      location.href = "/";
    }
    this.prev_infowindow = false;

    this.latitude = Number.parseFloat(this.getQueryString("latitude"));
    this.longitude = Number.parseFloat(this.getQueryString("longitude"));

    fetch(
      `/api/map/hosts?latitude=${this.latitude}&longitude=${this.longitude}`
    )
      .then(response => {
        return response.json();
      })
      .then(result => {
        this.createMarker(result);
        this.addHostList(result);
      });
    window.initMap = this.initMap;
  }

  /* initialize google maps */
  initMap = () => {
    navigator.geolocation.getCurrentPosition(pos => {
      this.map = new google.maps.Map(document.getElementById("map"), {
        center: {
          lat: this.latitude,
          lng: this.longitude
        },
        zoom: 16,
        fullscreenControl: false,
        streetViewControl: false,
        mapTypeControl: false
      });

      const latLng = new google.maps.LatLng(this.latitude, this.longitude);

      this.showCurrentPosition(latLng);
    });
  };

  /* GET  QueryString from URL */
  getQueryString = key => {
    const url = new URLSearchParams(window.location.search);
    return url.get(key);
  };

  /* Show Current Position with Marker */
  showCurrentPosition = latLng => {
    let marker = new google.maps.Marker({
      position: latLng,
      title: "My Position",
      map: this.map,
      draggable: false,
      icon: "/images/map_pin.png"
    });

    this.showInfoWindow(marker);
  };

  /* Open info Window */
  showInfoWindow = marker => {
    let infoWindow = new google.maps.InfoWindow({
      content: "My Position"
    });

    infoWindow.open(this.map, marker);
  };

  /* Create Marker of Hosts*/
  createMarker = hosts => {
    for (let i = 0; i < hosts.length; i++) {
      let latLng = new google.maps.LatLng(
        Number.parseFloat(hosts[i].hostLatitude),
        Number.parseFloat(hosts[i].hostLongitude)
      );

      let marker = new google.maps.Marker({
        map: this.map,
        position: latLng,
        title: "Host",
        draggable: false,
        icon: "/images/map_pin.png"
      });

      google.maps.event.addListener(marker, "click", () => {
        let infoWindow = new google.maps.InfoWindow({
          content: `
            <div class="info__window">
                <p class="info__window--hostName">${hosts[i].hostName}</p>
                <div class="info__window--block">
                    <img src="${hosts[i].hostImage}" alt="hostImage"  class="hostImage" />
                </div>
               <p class="info__window--hostTel">${hosts[i].hostTel}</p>
               <p class="info__window--hostAddress">${hosts[i].hostAddress}</p>
                <div class="info__window--block">
                    Open <span class="info__window--hostOpenTime"> ${hosts[i].hostOpenTime}</span>
                    Close <span class="info__window--hostCloseTime">${hosts[i].hostCloseTime}</span>
              
                </div>

                <div class="info__window--buttons">
                    <input type="button" class="dropBtn info--btn btnShow" value="맡길거에요" idx="${hosts[i].hostIdx}" latitude="${hosts[i].hostLatitude}" longitude="${hosts[i].hostLongitude}" onclick="javascript:setDrop(this)"/>
                    <input type="button" class="getBtn info--btn btnShow" value="찾을거에요" idx="${hosts[i].hostIdx}" latitude="${hosts[i].hostLatitude}" longitude="${hosts[i].hostLongitude}" onclick="javascript:setGet(this)"/>
                </div>
            </div>
          `
        });

        if (this.prev_infowindow) this.prev_infowindow.close();
        this.prev_infowindow = infoWindow;

        infoWindow.open(this.map, marker);
      });
    }
  };

  /* Insert Host Informations from Left Side Menu */
  addHostList = hostList => {
    const hostsColumns = document.querySelector(".hosts__columns");
    for (let i = 0; i < hostList.length; i++) {
      const hostsColumn = document.createElement("div");
      hostsColumn.className = "hosts__column";

      const hostsColumnHeader = document.createElement("div");
      hostsColumnHeader.className = "hosts__column__header";

      const hostsColumnTitle = document.createElement("p");
      hostsColumnTitle.className = "hosts__column--title";
      hostsColumnTitle.innerText = "Tour Information Center";

      const hostsColumnHeaderImages = document.createElement("div");
      hostsColumnHeaderImages.className = "hosts__column__header--images";

      const hostsColumnContents = document.createElement("div");
      hostsColumnContents.className = "hosts__column__contents";

      const hostsColumnContentsBlock = document.createElement("div");
      hostsColumnContentsBlock.className = "hosts__column__contents--block";

      const hostsColumnHostName = document.createElement("p");
      hostsColumnHostName.className = "hosts__column--hostName";
      hostsColumnHostName.innerHTML = hostList[i].hostName;

      const hostsColumnHostTel = document.createElement("p");
      hostsColumnHostTel.className = "hosts__column--hostTel";
      hostsColumnHostTel.innerHTML = hostList[i].hostTel;

      const hostsColumnHostAddress = document.createElement("p");
      hostsColumnHostAddress.className = "hosts__column--hostAddress";
      hostsColumnHostAddress.innerHTML = hostList[i].hostAddress;

      const hostsColumnContentsImage = document.createElement("div");
      hostsColumnContentsImage.className = "hosts__column__contents--image";

      const placeholder = document.createElement("img");
      placeholder.src = `${hostList[i].hostImage}`;
      placeholder.alt = "hostImage";
      placeholder.className = "hostProfileImage";

      const hostsColumnsReview = document.createElement("div");
      hostsColumnsReview.className = "hosts__columns__review";

      const hostsColumnsReviewBtn = document.createElement("input");
      hostsColumnsReviewBtn.className =
        "hosts__columns__review--btn reviewButton";
      hostsColumnsReviewBtn.type = "button";
      hostsColumnsReviewBtn.value = "리뷰";
      hostsColumnsReviewBtn.setAttribute("idx", hostList[i].hostIdx);

      for (let i = 0; i < 5; i++) {
        let starFull = document.createElement("img");
        starFull.src = "images/star_full.png";
        starFull.className = "star_full_image";
        starFull.alt = "star_full";

        hostsColumnHeaderImages.appendChild(starFull);
      }

      hostsColumnHeader.appendChild(hostsColumnTitle);
      hostsColumnHeader.appendChild(hostsColumnHeaderImages);

      hostsColumnContentsBlock.appendChild(hostsColumnHostName);
      hostsColumnContentsBlock.appendChild(hostsColumnHostTel);
      hostsColumnContentsBlock.appendChild(hostsColumnHostAddress);

      hostsColumnContentsImage.appendChild(placeholder);

      hostsColumnContents.appendChild(hostsColumnContentsBlock);
      hostsColumnContents.appendChild(hostsColumnContentsImage);

      hostsColumn.appendChild(hostsColumnHeader);
      hostsColumn.appendChild(hostsColumnContents);

      //hostsColumnsReview.appendChild(hostsColumnsReviewBtn);
      hostsColumns.appendChild(hostsColumn);
      //hostsColumns.appendChild(hostsColumnsReview);
    }
  };
}

export default new BeLightMaps();
