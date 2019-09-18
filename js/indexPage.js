let lastIndex = 0;
(async function () {
  await nearInit();
  // console.log(window.contract);
  MicroModal.init({});
  window.contract
    .getRangeMessages({ start: lastIndex })
    .then(renderMessages)
    .catch(console.error);
  const theMonth = new Date();
  const months = [];
  for (let i = 0; i < 6; i++) {
    months.unshift(theMonth.toISOString().substr(0, 7));
    theMonth.setMonth(theMonth.getMonth() - 1);
  }
  window.contract
    .monthCounters({ yearMonth6: months.join(",") })
    .then(monthCounters)
    .catch(console.error);
})(jQuery);

function renderMessages(messages) {
  console.log(messages);
  const tr = messages.map((m, i) => {
    const index = i + lastIndex + 1;
    const logDate = new Date(m.date);
    const nowDate = new Date();
    const diffTime = Math.abs(nowDate.getTime() - logDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `
<tr>
  <td><div class="avatar"><img src="${m.photo}" alt="img" /></div></td>
  <td><span><label class="user-num">#${index}</label>${m.name} is boycotting Facebook until ${m.text}</span></td>
  <td><span class="u-pull-right"><label class="user-num">${diffDays}</label>Days</span></td>
  <td><span class="u-pull-right"><label class="user-sum">$${Math.round(diffDays * 68) / 1000}</label>Boycott Value</span></td>
</tr>`;
  });
  $("#near-tbody").html(tr);
  if (messages.length) {
    lastIndex = Number(messages[messages.length - 1].index) + 1;
  }
  const totalUser = messages.length;
  const totalCost = messages.reduce((acc, cur) => {
    const logDate = new Date(cur.date);
    const nowDate = new Date();
    const diffTime = Math.abs(nowDate.getTime() - logDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return acc + diffDays * 0.068;
  }, 0)
  $("#totalUser").text(totalUser);
  $("#totalCost").text("$" + totalCost);
}

function monthCounters(monthCounters) {
  console.log(monthCounters);
  const formatter = new Intl.DateTimeFormat("en", { month: 'short' });
  const theMonth = new Date();
  const monthLabels = [];
  for (let i = 0; i < 6; i++) {
    monthLabels.unshift(formatter.format(theMonth));
    theMonth.setMonth(theMonth.getMonth() - 1);
  }
  var ctx = document.getElementById('myChart').getContext('2d');
  var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
      labels: monthLabels,
      datasets: [{
        backgroundColor: 'rgba(24, 119, 242,.2)',
        borderColor: 'rgba(24, 119, 242)',
        data: monthCounters,
        pointBackgroundColor: "#000",
        pointRadius: 4,
        lineTension: 0

      }]
    },

    // Configuration options go here
    options: {
      legend: {
        display: false,
        fontColor: 'rgb(255, 99, 132)'
      },
      scales: {
        yAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          }
        }],
      },
    },
  });
}

function facebookInit() {
  FB.getLoginStatus(({ status, authResponse }) => {
    if (status === "connected" && authResponse.userID) {
      contract
        .hasCommented({ id: authResponse.userID })
        .then(bool => {
          if (bool) {
            changeLogoutBtn();
            $("#joinBtn").attr("onClick", `location.href = "profile"`);
            $("#joinBtn").text("My Profile");
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

function changeLogoutBtn() {
  $("#loginBtn").html(`<a href="#" onClick="logoutHandler()"><span>Logout</span><i class="fa fa-lock"></i></a>`)
}

function logoutHandler() {
  FB.logout();
  walletAccount.signOut();
}