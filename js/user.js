let lastIndex = 0;
const MS_IN_ONE_DAY = 24 * 60 * 60 * 1000;
const MS_IN_ONE_WEEK = 7 * 24 * 60 * 60 * 1000;
const MS_IN_30_DAYS = 30 * 24 * 60 * 60 * 1000;
const EARNING_PER_SECOND = .068 / 24 / 60 / 60;
const ROUNDING = 1000000;
let profile = null, messages = null;
(async function () {
  await nearInit();
})(jQuery);

function facebookInit() {
  function changeLogoutBtn(m) {
    profile = m;
    // console.log(profile);
    $("#loginBtn").html(`<a href="#" onClick="logoutHandler()"><span>Logout</span><i class="fa fa-lock"></i></a>`)
    $("#fbAvatar").html(`<img src="${m.photo}" alt="img" style="width:inherit" />`)
  }

  function renderMessages(m) {
    messages = m;
    renderProfile();
    const totalUser = messages.length;
    const totalSec = messages.reduce((acc, cur) => {
      const logDate = new Date(cur.date);
      const nowDate = new Date();
      const diffTime = Math.abs(nowDate.getTime() - logDate.getTime());
      const diffDays = Math.ceil(diffTime / MS_IN_ONE_DAY);
      const diffSecond = Math.ceil(diffTime / 1000);
      return acc + diffSecond;
    }, 0)
    const timeNow = new Date().getTime();

    const last24hours = messages.filter(m => (timeNow - new Date(m.date).getTime() <= MS_IN_ONE_DAY))
    const last7days = messages.filter(m => (timeNow - new Date(m.date).getTime() <= MS_IN_ONE_WEEK))
    const last30days = messages.filter(m => (timeNow - new Date(m.date).getTime() <= MS_IN_30_DAYS))
    $(".total-boycott-sum").text(totalUser);
    $(".total-value-sum").text("$" + Math.round((totalSec * EARNING_PER_SECOND * ROUNDING) / ROUNDING));
    $("#last24hours").text(last24hours.length);
    $("#last7days").text(last7days.length);
    $("#last30days").text(last30days.length);
    runTimer(totalSec, "total", totalUser);
  }

  function renderProfile() {
    const { hash } = window.location;
    const userIndex = Number(hash.substring(1));
    // console.log(messages, profile, hash, userIndex);
    if (userIndex > 0 && userIndex <= messages.length) {
      const realIndex = userIndex - 1;
      console.log(realIndex);
      $("#profile").html(generateUserPage(messages[realIndex], realIndex));
    } else {
      $("#profile").html(generateUserPage(profile));
    }
  }

  FB.getLoginStatus(({ status, authResponse }) => {
    if (status === "connected" && authResponse.userID) {
      contract
        .getProfile({ id: authResponse.userID })
        .then(changeLogoutBtn)
        .catch();
    }

    window.contract
      .getRangeMessages({ start: lastIndex })
      .then(renderMessages)
      .catch(console.error);
  })


}

function generateUserPage(m, i) {
  if (m === null) {
    // window.location.replace("/");
  }
  if (m.index === undefined) {
    m.index = i;
  }
  const logDate = new Date(m.date);
  const nowDate = new Date();
  const diffTime = Math.abs(nowDate.getTime() - logDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const totalCost = Math.round(diffDays * 68) / 1000;
  return `
  <div class="profile-content">
    <div class="profile-header">
      <div class="avatar">
        <img src="${m.photo}" alt="img" style="width:inherit" />
      </div>
      <section>
        <h3>${m.name}</h3>
        <a href="https://facebook.com/${m.id}" class="url-address">https://facebook.com/${m.id}</a>
      </section>
    </div>
    <section class="user-stats">
      <div>
        <h3>#${m.index + 1}</h3>
        <span>User Number</span>
      </div>
      <div>
        <h3>${diffDays}</h3>
        <span>Days Boycotting</span>
      </div>
      <div>
        <h3>$${totalCost}</h3>
        <span>Boycott Value</span>
      </div>
    </section>
    <p>I am boycotting Facebook until ${m.text}</p>
  </div>
  `
}

function onhashchangeHandler() {
  const { hash } = window.location;
  const userIndex = Number(hash.substring(1));
  // console.log(messages, profile, hash, userIndex);
  if (userIndex > 0 && userIndex <= messages.length) {
    const realIndex = userIndex - 1;
    console.log(realIndex);
    $("#profile").html(generateUserPage(messages[realIndex], realIndex));
  } else {
    $("#profile").html(generateUserPage(profile));
  }
}

function logoutHandler(event) {
  event.preventDefault();
  walletAccount.signOut();
  FB.logout(() => window.location.replace("/"));
}


function runTimer(diffSecond, index, count = 1) {
  let addSec = 0;
  setInterval(() => {
    addSec = addSec + count;
    const earn = Math.round((diffSecond + addSec) * EARNING_PER_SECOND * ROUNDING) / ROUNDING;
    $("#earning-" + index).text("$" + earn);
    // console.log(addSec);
  }, 1000)
}