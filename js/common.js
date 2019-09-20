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


function changeLogoutBtn() {
  $("#loginBtn").html(`<a href="#" onClick="logoutHandler()"><span>Logout</span><i class="fa fa-lock"></i></a>`)
}

function logoutHandler() {
  walletAccount.signOut();
  FB.logout(() => window.location.reload());
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
    quote: `good`
  }, function (response) {
    console.log(response);
  });
}
