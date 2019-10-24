import Axios from "axios";
import * as Cookies from "js-cookie";

class LoginWithRegister {
  public PUBLIC_USER: any;
  public body: HTMLBodyElement;
  public headerMenu: HTMLMenuElement;
  public headerLoginButton: HTMLButtonElement;
  public modal: HTMLElement;
  public modalBtn: HTMLUListElement;
  public closeBtn: HTMLImageElement;
  public contents: HTMLElement;
  public loginForm: HTMLFormElement;
  public loginFooter: HTMLDivElement;
  public loginLink: HTMLSpanElement;
  public loginButton: HTMLButtonElement;
  public registerFooter: HTMLElement;
  public registerForm: HTMLFormElement;
  public registerLink: HTMLSpanElement;
  public registerButton: HTMLButtonElement;
  public navTitle: HTMLParagraphElement;

  constructor() {
    /* User Cookies Check */
    this.PUBLIC_USER = Cookies.get("public_user")
      ? JSON.parse(Cookies.get("public_user").slice(2))
      : null;

    this.body = document.querySelector("body");
    this.headerMenu = document.querySelector(".header__menu");
    this.headerLoginButton = document.querySelector(".header__menu--login");

    this.modal = document.getElementById("loginModal");
    this.modalBtn = document.querySelector(".header__menu--login");
    this.closeBtn = document.querySelector(".closeBtn");
    this.contents = document.querySelector("#contents");

    this.loginForm = document.querySelector(".loginForm");
    this.loginFooter = document.querySelector(".login__footer");
    this.loginLink = document.querySelector(".login--link");
    this.loginButton = document.querySelector(".loginButton");

    this.registerFooter = document.querySelector(".register__footer");
    this.registerForm = document.querySelector(".registerForm");
    this.registerLink = document.querySelector(".register--link");
    this.registerButton = document.querySelector(".registerButton");

    this.navTitle = document.querySelector(".modal__nav__header--title");

    /* Hide Register Form */
    this.registerForm.style.display = "none";
    this.registerFooter.style.display = "none";

    this.setRegisterLinkEventListener();
    this.setLoginLinkEventListener();
    this.setModalBtnEventListener();
    this.setModalBtnEventListener();
    this.setOutsideEventListener();
    this.setCloseBtnEventListener();
    this.setSubmitEventListener();
    this.loginCheck();
  }

  public loginCheck = () => {
    try {
      if (this.PUBLIC_USER) {
        const newMenu: HTMLElement = document.createElement("li");
        newMenu.className = "header__menu--logout";
        newMenu.innerText = "로그아웃";

        newMenu.addEventListener("click", () => {
          if (confirm("로그아웃 하시겠습니까?")) {
            Cookies.remove("user");
            Cookies.remove("public_user");
            location.href = "/";
          }
        });

        this.headerLoginButton
          ? (this.headerLoginButton.style.display = "none")
          : "";
        this.headerMenu.appendChild(newMenu);
      } else {
        const oldMenu: HTMLUListElement = document.querySelector(
          ".header__menu--logout"
        );

        this.headerLoginButton
          ? (this.headerLoginButton.style.display = "inline")
          : "";
        oldMenu ? this.headerMenu.removeChild(oldMenu) : "";
      }
    } catch (e) {}
  };

  /* Open Register Form Event */
  public setRegisterLinkEventListener = () => {
    this.registerLink.addEventListener("click", () => {
      this.loginForm.style.display = "none";
      this.registerForm.style.display = "block";
      this.registerLink.innerText = "Login";
      this.navTitle.innerText = "Register";
      this.loginFooter.style.display = "none";
      this.registerFooter.style.display = "block";
    });
  };

  /* Open Login Event */
  public setLoginLinkEventListener = () => {
    this.loginLink.addEventListener("click", () => {
      this.initializeModal();
    });
  };

  /* Initialize Modal Function */
  public initializeModal = () => {
    this.contents ? (this.contents.style.opacity = "1.0") : "";
    this.registerForm.style.display = "none";
    this.registerLink.innerText = "Register now";
    this.navTitle.innerText = "Login";
    this.loginForm.style.display = "block";
    this.registerFooter.style.display = "none";
    this.loginFooter.style.display = "block";
  };

  /* Open Modal Event */
  public setModalBtnEventListener = () => {
    if (!this.modalBtn) return;
    this.modalBtn.addEventListener("click", () => {
      this.modal.style.display = "block";
      this.contents ? (this.contents.style.opacity = "0.5") : "";
    });
  };

  /* Set Outside Click EventListener */
  public setOutsideEventListener = () => {
    window.addEventListener("click", evt => {
      if (evt.target === this.body) {
        this.closeModalEvent();
        this.initializeModal();
      }
    });
  };

  /* Set Close Modal EventListener */
  public setCloseBtnEventListener = () => {
    this.closeBtn.addEventListener("click", () => {
      this.closeModalEvent();
      this.initializeModal();
    });
  };

  /* Close Modal Event Function */
  public closeModalEvent = () => {
    this.modal.style.display = "none";
  };

  /* Set Submit EventListeners */
  public setSubmitEventListener = () => {
    this.loginButton.addEventListener("click", () => {
      const form = new FormData(this.loginForm);
      Axios({
        method: "POST",
        url: "/api/auth/login",
        data: form,
        headers: { "Content-Type": "multipart/form-data" }
      })
        .then(response => {
          return response.data;
        })
        .then(result => {
          if (result.status === 200) {
            location.href = "/";
          } else {
            alert("ID or Password is not valid.");
          }
        });
    });

    this.registerButton.addEventListener("click", () => {
      const form = new FormData(this.registerForm);
      Axios({
        method: "POST",
        url: "/api/auth/register",
        data: form,
        headers: { "Content-Type": "multipart/form-data" }
      })
        .then(response => {
          return response.data;
        })

        .then(result => {
          if (result.status === 200) {
            alert("환영합니다!");
            location.href = "/";
          } else {
            alert("Something Error.");
          }
        });
    });
  };
}

export default new LoginWithRegister();
