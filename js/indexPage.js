(async function () {
  await nearInit();
  MicroModal.init({});
})(jQuery);

function renderMessages() {
  userCounters();
  const tr = messages.map((m, i) => {
    const index = i + lastIndex + 1;
    const logDate = new Date(m.date);
    const nowDate = new Date();
    const diffTime = Math.abs(nowDate.getTime() - logDate.getTime());
    const diffSecond = Math.ceil(diffTime / 1000);
    const diffDays = Math.ceil(diffTime / MS_IN_ONE_DAY);
    runTimer(diffSecond, index);
    return `
<tr>
  <td><div class="avatar"><img src="${m.photo}" alt="img" /></div></td>
  <td><span><a class="user-num" href="/user#${index}">#${index}</a>${m.name} is boycotting Facebook because ${m.text}</span></td>
  <td><span class="u-pull-right"><label class="user-num">${diffDays}</label>Days</span></td>
  <td><span class="u-pull-right"><label class="user-sum" id="earning-${index}">$${Math.round(diffSecond * EARNING_PER_SECOND * 1000) / 1000}</label>Boycott Value</span></td>
</tr>`;
  });
  $("#near-tbody").html(tr);
}

function facebookInit() {
  FB.getLoginStatus(({ status, authResponse }) => {
    if (status === "connected" && authResponse.userID) {
      contract
        .getProfile({ id: authResponse.userID })
        .then((p) => {
          profile = p;
          changeLogoutBtn();
          $("#joinBtn").attr("onClick", `location.href = "user"`);
          $("#joinBtn").text("Your Boycott");
          changeLogoutBtn();
        })
        .catch(() => {
          MicroModal.show('intro-modal');
        });
    } else {
      MicroModal.show('intro-modal');
    }
  });
}
