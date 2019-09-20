(async function () {
  await nearInit();
})(jQuery);

function facebookInit() {
  FB.getLoginStatus(({ status, authResponse }) => {
    if (status === "connected" && authResponse.userID) {
      contract
        .getProfile({ id: authResponse.userID })
        .then((p) => {
          profile = p;
          changeLogoutBtn();
        })
        .catch();
    }
  })
}


function generateUserPage(m, i) {
  if (m === null) {
    m = messages[0];
    m.index = 1;
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

function renderMessages() {
  userCounters();
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
