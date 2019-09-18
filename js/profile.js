let lastIndex = 0;
(async function () {
  await nearInit();
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
        .getProfile({ id: authResponse.userID })
        .then(changeLogoutBtn)
        .catch(() => {
          location.href = "join";
        });
    } else {
      // location.href = "join";
      const id = "10162300482295717"
      contract
        .getProfile({ id })
        .then(changeLogoutBtn)
        .catch(() => {
          location.href = "join";
        });
    }
  })

}


function logoutHandler() {
  FB.logout();
  walletAccount.signOut();
}


function changeLogoutBtn(m) {
  console.log(m);
  const logDate = new Date(m.date);
  const nowDate = new Date();
  const diffTime = Math.abs(nowDate.getTime() - logDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const totalCost = Math.round(diffDays * 68) / 1000;
  $("#loginBtn").html(`<a href="#" onClick="logoutHandler()"><span>Logout</span><i class="fa fa-lock"></i></a>`)
  $("#profilePage").html(`
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
      <h3>#${m.index}</h3>
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
`);
  $("#fbAvatar").html(`<img src="${m.photo}" alt="img" style="width:inherit" />`)
}

function renderMessages(messages) {
  console.log(messages);
  const totalUser = messages.length;
  const totalCost = messages.reduce((acc, cur) => {
    const logDate = new Date(cur.date);
    const nowDate = new Date();
    const diffTime = Math.abs(nowDate.getTime() - logDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return acc + diffDays * 0.068;
  }, 0)
  $(".total-boycott-sum").text(totalUser);
  $(".total-value-sum").text("$" + totalCost);
}

function fbShare() {
  FB.ui({
    method: 'share',
    href: 'https://usersunited.org',
  }, function (response) {
    console.log(response);
  });
}