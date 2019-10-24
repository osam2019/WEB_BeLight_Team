class BeLightHeader {
  public LOGO: HTMLImageElement;
  public searchButton: HTMLButtonElement;
  public startDate: HTMLInputElement;
  public endDate: HTMLInputElement;
  public spanBagCount: HTMLSpanElement;
  public bagCount: HTMLInputElement;
  public plusButton: HTMLImageElement;
  public minusButton: HTMLImageElement;
  public inputPlace: HTMLInputElement;

  constructor() {
    this.LOGO = document.querySelector(".header__left--logo");
    this.searchButton = document.querySelector(".global__searchBtn");
    this.inputPlace = document.querySelector(".input__place");
    this.startDate = document.querySelector(".startDate");
    this.endDate = document.querySelector(".endDate");
    this.spanBagCount = document.querySelector(".intro__searchform--bagcount");
    this.bagCount = document.querySelector("input[name=bagCount]");
    this.plusButton = document.querySelector(".plusButton");
    this.minusButton = document.querySelector(".minusButton");

    /* Add All EventListeners */
    this.addEvents();
  }

  public addEvents = () => {
    /* Click Move Event */
    this.LOGO.addEventListener("click", () => {
      location.href = "/";
    });

    /* Key Press Event */
    if (this.inputPlace) {
      this.inputPlace.addEventListener("keydown", evt => {
        if (evt.keyCode === 13) {
          this.searchButton.click();
          this.inputPlace.value = "";
        }
      });
    }

    /* Click PlusButton & Minus ButtonEvent */
    if (this.plusButton && this.minusButton) {
      this.plusButton.addEventListener("click", () => {
        this.bagCount.value = (
          Number.parseInt(this.bagCount.value) + 1
        ).toString();

        this.spanBagCount.innerText = this.bagCount.value;
      });

      this.minusButton.addEventListener("click", () => {
        let temp = Number.parseInt(this.bagCount.value);

        if (temp - 1 <= 0) {
          alert("최소 1개를 선택해야 합니다.");
        } else {
          this.bagCount.value = (temp - 1).toString();
          this.spanBagCount.innerText = this.bagCount.value;
        }
      });
    }
  };
}

export default new BeLightHeader();
