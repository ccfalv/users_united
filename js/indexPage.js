let lastIndex = 0;
const MS_IN_ONE_DAY = 24 * 60 * 60 * 1000;
const MS_IN_ONE_WEEK = 7 * 24 * 60 * 60 * 1000;
const MS_IN_30_DAYS = 30 * 24 * 60 * 60 * 1000;
const EARNING_PER_SECOND = .068 / 24 / 60 / 60;
const ROUNDING = 1000000;
(async function () {
  await nearInit();
  // console.log(window.contract);
  MicroModal.init({});
  window.contract
    .getRangeMessages({ start: lastIndex })
    .then(renderMessages)
    .catch(console.error);
})(jQuery);

function renderMessages(messages) {
  console.log(messages);
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

  if (messages.length) {
    lastIndex = Number(messages[messages.length - 1].index) + 1;
  }
  const totalUser = messages.length;
  const totalSec = messages.reduce((acc, cur) => {
    const logDate = new Date(cur.date);
    const nowDate = new Date();
    const diffTime = Math.abs(nowDate.getTime() - logDate.getTime());
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



function facebookInit() {
  FB.getLoginStatus(({ status, authResponse }) => {
    if (status === "connected" && authResponse.userID) {
      contract
        .hasCommented({ id: authResponse.userID })
        .then(bool => {
          if (bool) {
            changeLogoutBtn();
            $("#joinBtn").attr("onClick", `location.href = "user"`);
            $("#joinBtn").text("Your Boycott");
          } else {
            MicroModal.show('intro-modal');
            changeLogoutBtn();
          }
        })
        .catch(() => {
          MicroModal.show('intro-modal');
          changeLogoutBtn();
        });
    } else {
      MicroModal.show('intro-modal');
    }
  });
}
