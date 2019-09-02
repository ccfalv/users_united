(function() {
  const CONTRACT_NAME = "usersunited"; /* TODO: fill this in! */
  const DEFAULT_ENV = "development";

  function getConfig(env) {
    switch (env) {
      case "production":
      case "development":
        return {
          networkId: "default",
          nodeUrl: "https://rpc.nearprotocol.com",
          contractName: CONTRACT_NAME,
          walletUrl: "https://wallet.nearprotocol.com",
          initialBalance: 100000000
        };
      case "local":
        return {
          networkId: "local",
          nodeUrl: "http://localhost:3030",
          keyPath: `${process.env.HOME}/.near/validator_key.json`,
          walletUrl: "http://localhost:4000/wallet",
          contractName: CONTRACT_NAME,
          initialBalance: 100000000
        };
      case "test":
        return {
          networkId: "local",
          nodeUrl: "http://localhost:3030",
          contractName: CONTRACT_NAME,
          masterAccount: "test.near",
          initialBalance: 100000000
        };
      case "test-remote":
      case "ci":
        return {
          networkId: "shared-test",
          nodeUrl: "http://shared-test.nearprotocol.com:3030",
          contractName: CONTRACT_NAME,
          masterAccount: "test.near",
          initialBalance: 100000000
        };
      default:
        throw Error(
          `Unconfigured environment '${env}'. Can be configured in src/config.js.`
        );
    }
  }

  const cookieConfig =
    typeof Cookies != "undefined" && Cookies.getJSON("fiddleConfig");
  if (typeof module !== "undefined" && module.exports) {
    module.exports = getConfig;
  } else {
    window.nearConfig =
      cookieConfig && cookieConfig.nearPages
        ? cookieConfig
        : getConfig(DEFAULT_ENV);
  }
})();

function renderMessages(messages) {
  console.log(messages);
  const tr = messages.map(
    m => `
  <tr>
    <td><div class="avatar"><img src="${m.img}" alt="img" /></div></td>
    <td><span><label class="user-num">#${m.index}</label><strong>${m.name}</strong> is boycotting Facebook until ${m.text}</span></td>
    <td><span class="u-pull-right"><label class="user-num">13</label><strong>Days</strong> </span></td>
    <td><span class="u-pull-right"><label class="user-sum">$4.35</label><strong>Boycott Value</strong> </span></td>
  </tr>`
  );
  $("#near-tbody").html(tr);
  if (messages.length) {
    lastIndex = Number(messages[messages.length - 1].index) + 1;
  }
}

async function init() {
  console.log("nearConfig", nearConfig);

  // Initializing connection to the NEAR DevNet.
  window.near = await nearlib.connect(
    Object.assign(
      {
        deps: { keyStore: new nearlib.keyStores.BrowserLocalStorageKeyStore() }
      },
      nearConfig
    )
  );
  window.walletAccount = new nearlib.WalletAccount(window.near);
  contract = await near.loadContract(nearConfig.contractName, {
    viewMethods: ["getMessages", "getRangeMessages"],
    changeMethods: ["addMessage"],
    sender: walletAccount.getAccountId()
  });

  lastIndex = 0;
  contract
    .getRangeMessages({ start: lastIndex })
    .then(renderMessages)
    .catch(console.error);
}

init();
