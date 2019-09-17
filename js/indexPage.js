let lastIndex = 0;
(async function () {
  await nearInit();
  // console.log(window.contract);
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
  <td><span class="u-pull-right"><label class="user-sum">$${diffDays * 0.3}</label>Boycott Value</span></td>
</tr>`;
  });
  $("#near-tbody").html(tr);
  if (messages.length) {
    lastIndex = Number(messages[messages.length - 1].index) + 1;
  }
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