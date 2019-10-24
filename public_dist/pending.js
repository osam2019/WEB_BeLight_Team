var plusBtn = document.querySelector(".plusImg");
var minusBtn = document.querySelector(".minusImg");
var bgCount = document.querySelector(".pending__contents__sub--bagCount");
var orderBtn = document.querySelector(".completeBtn");
var orderForm = document.querySelector(".orderForm");

plusBtn.addEventListener("click", function() {
  bgCount.value = (Number.parseInt(bgCount.value) + 1).toString();
});

minusBtn.addEventListener("click", function() {
  let temp = Number.parseInt(bgCount.value);

  if (temp - 1 < 0) {
    alert("갯수가 잘못 되었습니다.");
  } else {
    bgCount.value = (temp - 1).toString();
  }
});

orderBtn.addEventListener("click", function() {
  let checkIn = document.querySelector(".hid__checkIn");
  let checkOut = document.querySelector(".hid__checkOut");
  let paid = document.querySelector(".hid__paid");
  let hostIdx = document.querySelector(".hid__hostIdx");
  let gHostIdx = document.querySelector(".hid__gHostIdx");
  let itemCount = document.querySelector(".hid__itemCount");

  checkIn.value = document.querySelector(".f_start").value;
  checkOut.value = document.querySelector(".f_end").value;
  hostIdx.value = getQueryString("hostIdx");
  gHostIdx.value = getQueryString("gHostIdx");
  itemCount.value = getQueryString("bagCount");
  paid.value = 3000;

  try {
    fetch("/api/user/order", {
      method: "POST",
      body: new FormData(orderForm)
    }).then(response => {
      if (response.status === 200) {
        alert("예약이 신청되었습니다");
        location.href = "/";
      }
    });
  } catch (err) {}
});

function getQueryString(key) {
  const url = new URLSearchParams(window.location.search);
  return url.get(key);
}
