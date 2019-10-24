# BeLight

```BeLight(비라이트)와 제휴한 공유오피스에 짐을 보관하고,```
``` 원하는 장소에서 찾을 수 있도록 짐을 이동시켜주는 서비스``` 

[**데모 보러가기**](https://be-light.store)

## WEB

## Installation

**Download Git** [here](https://git-scm.com/).
**Download Node** [here](https://nodejs.org/en/)

## 저장소 클론

git clone 명령어로, BeLight 저장소를 클론한다.

    git clone https://github.com/be-light/be-light.git

## 패키지 설치

서버 시작을할때, nodemon을 사용하므로, 전역 설치한다.

    npm install -g nodemon

설치가 완료되면, package.json 안의 패키지들을 설치한다.

    npm install

## 실행하기 위한 준비
DB정보, JWT 비밀키, Google API Key, 푸쉬를 위한 Firebase Server Key 등을 설정해주어야 한다.

    /* 프로젝트 최상위 경로의 .env 파일 */
         HTTP_PORT=80
         HTTPS_PORT=443
         MYSQL_DATABASE=DB이름
         MYSQL_USERNAME=유저이름
         MYSQL_PASSWORD=비밀번호
         MYSQL_HOST=도메인 (저같은 경우는 remotemysql.com 무료 DB를 사용했습니다)
         MYSQL_DIALECT=DB 종류 (ex - mysql)
         NODE_ENV=development
         FCM_SERVER_KEY=Firebase ServerKey
  
  ---

```javascript 
/* src/utils/jwt.ts */
this.jwtObj.secret  =  "토큰인증시 사용할 비밀키 입력";
```

---

```javascript
/* src/views/*.pug  에서 발급 받은 Google API_KEY 입력 */
script(async  defer  src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places")
```
## 서버 실행

    /* 루트 디렉토리에서 터미널 명령어 실행 */
    npm run dev:start // Webpack으로 번들링한 파일을 실행

---

## Used

![enter image description here](https://i.imgur.com/OgWV5pU.jpg)

## 실행 화면

![enter image description here](https://i.imgur.com/Y2SYZAu.png)

![enter image description here](https://i.imgur.com/LXQyuar.png)

![enter image description here](https://i.imgur.com/4DQOLtA.png)

## APP

## 저장소 클론

git clone 명령어로, BeLight 저장소를 클론한다.

    git clone https://github.com/be-light/be-light.git
    
## Installation

Demo 파일은 아래 링크에서 받을 수 있습니다.

[user.apk](https://be-light.store/upload/user.apk)
[host.apk](https://be-light.store/upload/host.apk)



## 파일 정보 및 목록

```javascript
"/app/src/main/java" //자바소스코드
"/app/src/main/rs" // 실행에 필요한 리소스파일들
"/build.gradle", "/gradle/build.gradle" // 앱의 설정정보
```

## User APP 기능

### 회원가입 및 로그인
![enter image description here](https://i.imgur.com/iONvRgP.png)
**Register**라고 써있는 버튼을 누른다.
![enter image description here](https://i.imgur.com/v94zhqi.png)
이 화면에서 아이디, 비밀번호등 회원가입에 필요한 정보를 입력후 
아래에 있는 **Sign Up**버튼을 눌러서 회원가입을 한다.
회원가입에 성공하면 다시 처음화면으로 돌아오게 된다.
이 처음화면에서 **Sign In**버튼을 누르면 아이디와 비밀번호를 입력할 수 있는 창이 생긴다.
이 창에 회원가입할때 사용한 아이디와 비밀번호를 입력후 **Log In**버튼을 누르면 로그인한다.
### 예약
![enter image description here](https://i.imgur.com/4VWsn2i.png)
로그인을 하면 지도가 보이게 된다. 
지도 위 캐리어가방옆에 **+/-버튼**을 눌러서 맡기는 짐의 개수를 설정할 수 있고
그 위 검색창에 자신이 짐을 맡기거나 찾고자하는 지역을 검색한다.
![enter image description here](https://i.imgur.com/GQsuJCZ.png)
검색결과중에서 마커를 누르면 Host에 대한 간단한 정보가 뜬다.
선택한 Host의 리뷰를 보고 싶으면 리뷰버튼을 누르면 리뷰가 보인다.
선택한 Host 마음에 들면 **예약**버튼을 누른다.
![enter image description here](https://i.imgur.com/VFkJwkG.png)
예약버튼을 누르면 선택한 호스트에 짐을 맡길것인지 짐을 찾는 장소로 사용할지 선택할 수 있다.
짐을 맡기는 장소와 찾는장소가 모두 선택되면 확인버튼이 예약버튼으로 변한다. 
![enter image description here](https://i.imgur.com/zUBUO9m.png)
예약버튼을 누르면 예약의 정보를 확인하고 가격을 확인할 수 있다.
예약정보를 확인했으면 아래에 있는 예약버튼을 눌러서 예약을 신청할 수 있다.

### 짐맡기고 찾기
예약을 호스트가 확인해서 수락을 해주면 사용자에게는 **푸시메시지**가 오게되고
짐을 맡기기로 예약한 시간에 맞춰서 짐을 맡길 Host에 가면 
가게에서 짐에 **QR코드**가 달린 라벨을 달아주고 짐을 받아준다.

짐을 찾아가기로 예약한 시간에 맞춰서 짐을 맡길 Host에 가서
앱을 키고 주문내역에서 맞는 주문을 찾아서 짐 찾기 버튼을 누른후 카메라로 **QR코드**를 찍으면 짐을 찾아올 수 있다.
## HOST APP
### 회원가입 및 로그인
User의 과정과 동일하다.
### 호스트추가
![enter image description here](https://i.imgur.com/4he3K1a.png)
![enter image description here](https://i.imgur.com/H79i6FB.png)
로그인한후 첫화면에서 아래쪽에 **+버튼**을 누르면 다이얼 로그가 뜨고 여기에 Host정보를 넣고 추가 버튼을 누르면 Host가 추가된다.
### 짐맡아주기
![enter image description here](https://i.imgur.com/GKdn4fa.png)
자신이 관리하는 Host로 예약이 등록되었다는 **푸시**가 오면 앱을 켜고 왼쪽의 주문내역을 누른다.
여기서 주문의 내역을 보고 수락을 하거나 거절 할 수있다.
	수락을 하면 예약한 시간에 맞춰 손님이 오게 되고 손님의 짐에 **QR코드**가 달린 라벨을 달아주고
![enter image description here](https://i.imgur.com/3krAorT.png)
주문내역에서 짐맡기기버튼을 눌른후 카메라로 **QR코드**를 찍고 짐을 맡아둔다.
### 짐돌려주기
손님이 예약한 시간에 맞게 오면 짐을 보여주고 손님의 앱으로 짐에 달린 **QR코드**를 찍고
	인증이 되면 그때 짐을 돌려주면 된다.
## 기타

### 업데이트 정보 (Change Log)
2019-10-24 **1.0.0ver.**


###  License
MIT License

### Contact

Design, PM, Publisher:  **정동훈**(donghun4754@gmail.com)
 Backend API:  **박관우**(yeonkevin@naver.com)
Android Native App: **김한빈**(1117plus@gmail.com)
