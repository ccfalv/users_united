let lastIndex = 0;
(async function() {
  await nearInit();
  // console.log(window.contract);
  window.contract
    .getRangeMessages({ start: lastIndex })
    .then(renderMessages)
    .catch(console.error);
})(jQuery);

function renderMessages(messages) {
  console.log(messages);
  const tr = messages.map((m, i) => {
    const index = i + lastIndex;
    const logDate = new Date(m.date);
    const nowDate = new Date();
    const diffTime = Math.abs(nowDate.getTime() - logDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `
  <tr>
    <td><div class="avatar"><img src="${m.photo}" alt="img" /></div></td>
    <td><span><label class="user-num">#${index}</label><strong>${
      m.name
    }</strong> is boycotting Facebook until ${m.text}</span></td>
    <td><span class="u-pull-right"><label class="user-num">${diffDays}</label><strong>Days</strong> </span></td>
    <td><span class="u-pull-right"><label class="user-sum">$${diffDays *
      0.3}</label><strong>Boycott Value</strong> </span></td>
  </tr>`;
  });
  $("#near-tbody").html(tr);
  if (messages.length) {
    lastIndex = Number(messages[messages.length - 1].index) + 1;
  }
}
