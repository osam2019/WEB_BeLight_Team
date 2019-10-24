var input;
var autocomplete;
var geocoder;

var userLatitude;
var userLongitude;

var searchSubmitBtn;
var searchForm;

document.addEventListener("DOMContentLoaded", event => {
  searchSubmitBtn = document.querySelector(".intro__searchform--submitbtn");
  searchForm = document.querySelector(".intro__searchform");
  input = document.querySelector(".input__place");

  geocoder = new google.maps.Geocoder();
  autocomplete = new google.maps.places.Autocomplete(input, {
    types: ["geocode"]
  });

  /* Set LatLng */
  userLatitude = document.querySelector(".user__latitude");
  userLongitude = document.querySelector(".user__longitude");

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      userLatitude.value = pos.coords.latitude;
      userLongitude.value = pos.coords.longitude;
    });
  }

  /* Search Text */

  searchForm.addEventListener("submit", event => {
    event.preventDefault();
    if (input.value) {
      setLocation(geocoder, input.value).then(res => {
        userLatitude.value = res.lat;
        userLongitude.value = res.lng;
        document.querySelector(".intro__searchform").submit();
      });
    } else {
      document.querySelector(".intro__searchform").submit();
    }
  });
});

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
