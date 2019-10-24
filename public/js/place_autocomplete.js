var map;
var input;
var autocomplete;
var geocoder;
var searchBtn;
var hostsColumns;
var prev_infowindow = false;

document.addEventListener("DOMContentLoaded", event => {
  input = document.querySelector(".input__place");
  searchBtn = document.querySelector(".header__contents--searchBtn");
  geocoder = new google.maps.Geocoder();
  autocomplete = new google.maps.places.Autocomplete(input, {
    types: ["geocode"]
  });

  /* SeachBtn Click Event */
  searchBtn.addEventListener("click", event => {
    if (!input.value) {
      alert("장소를 입력해 주세요.");
      event.preventDefault();
      return;
    }

    setLocation(geocoder, input.value).then(res => {
      map = new google.maps.Map(document.getElementById("map"), {
        center: {
          lat: res.lat,
          lng: res.lng
        },
        zoom: 16,
        fullscreenControl: false,
        streetViewControl: false,
        mapTypeControl: false
      });

      const latLng = new google.maps.LatLng(res.lat, res.lng);
      showCurrentPosition(latLng);

      fetch(`/api/map/hosts?latitude=${res.lat}&longitude=${res.lng}`)
        .then(response => {
          return response.json();
        })
        .then(result => {
          createMarker(result);
          addHostList(result);
        });
    });
  });
});

/* Show Current Position with Marker */
showCurrentPosition = latLng => {
  let marker = new google.maps.Marker({
    position: latLng,
    title: "My Position",
    map: map,
    draggable: false,
    icon: "/images/map_pin.png"
  });

  showInfoWindow(marker);
};

/* Open info Window */
showInfoWindow = marker => {
  let infoWindow = new google.maps.InfoWindow({
    content: "My Position"
  });

  infoWindow.open(map, marker);
};

/* Create Marker of Hosts*/
createMarker = hosts => {
  for (let i = 0; i < hosts.length; i++) {
    let latLng = new google.maps.LatLng(
      Number.parseFloat(hosts[i].hostLatitude),
      Number.parseFloat(hosts[i].hostLongitude)
    );

    let marker = new google.maps.Marker({
      map: map,
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

      if (prev_infowindow) prev_infowindow.close();
      prev_infowindow = infoWindow;

      infoWindow.open(map, marker);
    });
  }
};

/* Insert Host Informations from Left Side Menu */
addHostList = hostList => {
  hostsColumns = document.querySelector(".hosts__columns");
  hostsColumns.innerHTML = "";
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

setLocation = (geocoder, address) => {
  return new Promise((resolve, reject) => {
    geocoder.geocode(
      {
        address
      },
      (results, status) => {
        if (status === "ZERO_RESULTS") {
          alert("유효하지 않은 주소입니다.");
          return;
        }

        resolve({
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng()
        });
      }
    );
  });
};
