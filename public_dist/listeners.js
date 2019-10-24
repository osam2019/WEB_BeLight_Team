var dropIdx;
var getIdx;
var dropLatitude;
var dropLongitude;

var getLatitude;
var getLongitude;

var nextBtn = document.querySelector(".hosts__nextBtn");

function setDrop(e) {
  dropIdx = e.getAttribute("idx");
  dropLatitude = e.getAttribute("latitude");
  dropLongitude = e.getAttribute("longitude");
  e.style.visibility = "hidden";
}

function setGet(e) {
  getIdx = e.getAttribute("idx");
  getLatitude = e.getAttribute("latitude");
  getLongitude = e.getAttribute("longitude");
  e.style.visibility = "hidden";
}

nextBtn.addEventListener("click", function(e) {
  var urlParams = new URLSearchParams(location.search);
  var bagCount = urlParams.get("bagCount");

  document.querySelector(".bagCount").value = bagCount;
  document.querySelector(".hostLatitude").value = dropLatitude;
  document.querySelector(".hostLongitude").value = dropLongitude;
  document.querySelector(".gHostLatitude").value = getLatitude;
  document.querySelector(".gHostLongitude").value = getLongitude;
  document.querySelector(".hostIdx").value = dropIdx;
  document.querySelector(".gHostIdx").value = getIdx;

  document.querySelector(".hosts__next--Form").submit();
});
