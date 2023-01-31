// 로그인 버튼 누르면 창 열기
function openLogin() {
  let loginModal = document.getElementById("loginModal");
  loginModal.style.visibility = "visible";
}

// 로그인/회원가입 창 닫기
function closeLogin() {
  let loginModal = document.getElementById("loginModal");
  let passCheck = document.getElementById("userRegisterPassword");
  loginModal.style.visibility = "hidden";
  passCheck.style.display = "none";
  let login = document.getElementById("login");
  let phone = document.getElementById("phone");
  login.style.display = "block";
  phone.style.display = "none";

  let timer = document.getElementById("timer");
  let submitNum = document.getElementById("submitNum");
  let submit = document.getElementById("submit");
  let phoneNumAuth = document.getElementById("phoneNumAuth");
  let phoneNum = document.getElementById("phoneNum");
  let phoneHeader = document.getElementById("phoneHeader");
  let phoneHeader2 = document.getElementById("phoneHeader2");
  let checkPW = document.getElementById("checkPW");

  phoneNum.style.display = "block";
  phoneNum.value = "";
  submitNum.style.display = "block";
  phoneHeader.style.display = "block";

  checkPW.remove();
  phoneNumAuth.style.display = "none";
  phoneHeader2.style.display = "none";
  submit.style.display = "none";
  timer.style.display = "none";
  clearInterval();
  clearForm();
  userLogin();
}

// Form 깨끗하게 만들기
function clearForm() {
  let userId = document.getElementById("userId");
  let userPassword = document.getElementById("userPassword");
  let userPasswordCheck = document.getElementById("userPasswordCheck");
  userPassword.style.borderColor = "#efefef";
  userPasswordCheck.style.borderColor = "#efefef";
  userId.value = "";
  userPassword.value = "";
  userPasswordCheck.value = "";
}

// 회원가입 버튼 누르면 화면 띄우기
function openRegister() {
  userRegister();
  let loginModal = document.getElementById("loginModal");
  loginModal.style.visibility = "visible";
}

// 유저 회원가입 화면 띄우기
function userRegister() {
  let loginPopUp = document.getElementById("loginPopUp");
  let loginExplain = document.getElementById("loginExplain");
  let loginHeader = document.getElementById("login_Header");
  let passCheck = document.getElementById("userRegisterPassword");
  let loginBtn = document.getElementById("loginBtn");
  if (document.getElementById("checkPW")) {
    document.getElementById("checkPW").remove();
  }

  loginPopUp.style.height = "500px";
  loginHeader.innerHTML = "회원가입";
  loginExplain.innerHTML =
    "이미 계정이 있으신가요? <a id='loginExplain_a' onclick='userLogin()'>로그인</a></div>";
  passCheck.style.display = "block";
  clearForm();
  loginBtn.innerHTML = "회원가입";
  loginBtn.setAttribute("onClick", "phoneAuth()");
}

// 유저 로그인 화면 띄우기
function userLogin() {
  let loginPopUp = document.getElementById("loginPopUp");
  let loginExplain = document.getElementById("loginExplain");
  let loginHeader = document.getElementById("login_Header");
  let passCheck = document.getElementById("userRegisterPassword");
  let loginBtn = document.getElementById("loginBtn");

  loginPopUp.style.height = "400px";
  loginHeader.innerHTML = "로그인";
  loginExplain.innerHTML =
    "ShowCoin이 처음이신가요? <a id='loginExplain_a' onclick='userRegister()'>회원가입</a></div>";
  passCheck.style.display = "none";
  loginBtn.innerHTML = "로그인";
  clearForm();
  loginBtn.setAttribute("onClick", "login()");
}

function phoneAuth() {
  let loginPopUp = document.getElementById("userRegisterPassword");
  let userPasswordCheck = document.getElementById("userPasswordCheck");
  let userPassword = document.getElementById("userPassword");

  if (userPassword.value != userPasswordCheck.value) {
    userPassword.style.borderColor = "red";
    userPasswordCheck.style.borderColor = "red";
    let html = `<div id='checkPW' style='color:red; font-size:12px; font-weight:bold;'>비밀번호가 일치하지 않습니다.</div>`;
    loginPopUp.insertAdjacentHTML("beforeend", html);
  } else {
    let login = document.getElementById("login");
    let phone = document.getElementById("phone");
    login.style.display = "none";
    phone.style.display = "block";
  }
}

async function phoneNumAuth() {
  let num = document.getElementById("phoneNumAuth").value;

  let params = {
    num,
  };

  fetch("/user/register/smsAuthCheck", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.OK === "success") {
        register();
      } else {
        alert("다시 입력하세요");
      }
    });
}

async function phoneNumSend() {
  let phoneNum = document.getElementById("phoneNum").value;
  let params = {
    phoneNum,
  };

  fetch("/user/register/smsAuth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  })
    .then((res) => res.json())
    .then((data) => {
      phoneNumPopUp();
    });
}

// 타이머
function phoneNumPopUp() {
  let timer = document.getElementById("timer");
  let submitNum = document.getElementById("submitNum");
  let submit = document.getElementById("submit");
  let phoneNumAuth = document.getElementById("phoneNumAuth");
  let phoneNum = document.getElementById("phoneNum");
  let phoneHeader = document.getElementById("phoneHeader");
  let phoneHeader2 = document.getElementById("phoneHeader2");

  phoneNum.style.display = "none";
  submitNum.style.display = "none";
  phoneHeader.style.display = "none";

  phoneNumAuth.style.display = "block";
  phoneHeader2.style.display = "block";
  submit.style.display = "block";
  timer.style.display = "block";

  let time = 180;
  let min = "";
  let sec = "";

  let x = setInterval(() => {
    min = parseInt(time / 60);
    sec = time % 60;
    timer.innerHTML = "남은시간 : " + min + "분" + sec + "초";
    time--;

    if (time < 0) {
      clearInterval(x);
      timer.innerHTML = "시간초과";
    }
  }, 1000);
}

// 유저 등록 처리
async function register() {
  let userId = document.getElementById("userId");
  let userPassword = document.getElementById("userPassword");
  let userPasswordCheck = document.getElementById("userPasswordCheck");
  let loginPopUp = document.getElementById("userRegisterPassword");

  let userIdValue = userId.value;
  let userPasswordValue = userPassword.value;
  let userPasswordCheckValue = userPasswordCheck.value;

  if (userPasswordValue === userPasswordCheckValue) {
    let params = {
      userId: userIdValue,
      userPassword: userPasswordValue,
    };

    fetch("/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("회원가입 완료되었습니다");
        location.href = "/";
      });
  } else {
    userPassword.style.borderColor = "red";
    userPasswordCheck.style.borderColor = "red";
    let html = `<div id='checkPW' style='color:red; font-size:12px; font-weight:bold;'>비밀번호가 일치하지 않습니다.</div>`;
    loginPopUp.insertAdjacentHTML("beforeend", html);
  }
}

function login() {
  let userId = document.getElementById("userId").value;
  let userPassword = document.getElementById("userPassword").value;

  let params = {
    userId,
    userPassword,
  };
  fetch("/user/userLogin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.message === "성공") {
        location.href = "/";
      } else {
        alert("비밀번호가 틀렸습니다");
      }
    });
}

async function getAllCoin() {
  let coinForm = document.getElementById("coinForm");
  let coinAll = await fetch("/coin/getAllCoin");
  coinAll = await coinAll.json();
  coinAll = coinAll.coinAll;

  for (let i = 0; i < coinAll.length; i++) {
    if (coinAll[i].signed_change_rate < 0) {
      coinAll[i].signed_change_rate = `<span style="color:blue;">${(
        coinAll[i].signed_change_rate * 100
      ).toFixed(1)}%</span>`;
    } else {
      coinAll[i].signed_change_rate = `<span style="color:red;">+${(
        coinAll[i].signed_change_rate * 100
      ).toFixed(1)}%</span>`;
    }

    let html = `<tr>
              <td>${i + 1}</td>
               <td>${
                 coinAll[i].market_korean
               } <span style="color:silver">${coinAll[i].market.substring(
      4
    )}</span></td>
               <td style="font-weight:bold;">₩${coinAll[
                 i
               ].trade_price.toLocaleString("ko-KR")}</td>
               <td> ${coinAll[i].signed_change_rate}</td>
              <td>₩${coinAll[i].low_price.toLocaleString("ko-KR")}</td>
              <td>₩${coinAll[i].high_price.toLocaleString("ko-KR")}</td>
              <td>${coinAll[i].acc_trade_volume_24h
                .toFixed(2)
                .toLocaleString("ko-KR")} <span style="color:silver">${coinAll[
      i
    ].market.substring(4)}
    </span></td>
              <td>${coinAll[i].acc_trade_volume
                .toFixed(2)
                .toLocaleString("ko-KR")} <span style="color:silver">${coinAll[
      i
    ].market.substring(4)}</span></td>
            </tr>`;
    coinForm.insertAdjacentHTML("beforeend", html);
  }
}
window.onload = () => {
  getAllCoin();
  setInterval(getAllCoin, 1000 * 300);
};
