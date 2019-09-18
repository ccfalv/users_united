async function nearInit() {
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
  // contract = new nearlib.Contract(
  //   walletAccount.getAccountId(),
  //   nearConfig.contractName,
  //   {
  //     viewMethods: ["getMessages", "getRangeMessages"],
  //     changeMethods: ["addMessage"]
  //   }
  // );
  window.contract = await near.loadContract(nearConfig.contractName, {
    viewMethods: ["getRangeMessages", "hasCommented", "monthCounters", "getProfile"],
    changeMethods: ["addMessage"],
    sender: walletAccount.getAccountId()
  });
}
