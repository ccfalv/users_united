let profile = null, messages = null, lastIndex = 0;
const MS_IN_ONE_DAY = 24 * 60 * 60 * 1000;
const MS_IN_ONE_WEEK = 7 * 24 * 60 * 60 * 1000;
const MS_IN_30_DAYS = 30 * 24 * 60 * 60 * 1000;
const EARNING_PER_SECOND = .068 / 24 / 60 / 60;
const ROUNDING = 1000000;
(function ($) {
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
  window.contract
    .getRangeMessages({ start: lastIndex })
    .then(m => {
      messages = m;
      renderMessages(m);
    })
    .catch(console.error);
})(jQuery);


function userCounters() {
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


function changeLogoutBtn() {
  $("#loginBtn").html(`<a href="#" onClick="logoutHandler(event)"><span>Logout</span><i class="fa fa-lock"></i></a>`);
  $("#fbAvatar").html(`<img src="${profile.photo}" alt="img" style="width:inherit" />`);
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

function fbShare() {
  FB.ui({
    method: 'share',
    href: 'https://usersunited.org',
    quote: `I'm boycotting facebook because...`
  }, function (response) {
    console.log(response);
  });
}
