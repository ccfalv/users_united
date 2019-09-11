let tabs;

function facebookLogin() {
  try {
    FB.login();
    if (walletAccount.isSignedIn()) {
      tabs.toggle("#post-reason");
    } else {
      tabs.toggle("#connect-near");
    }
  } catch (error) {
    // window.history.pushState(null, null, "#connect-near");
    // tabs.toggle("#connect-near");
    // console.error(error);
    alert(error);
  }
}

function nearLogin() {
  try {
    walletAccount
      .requestSignIn(
        // The contract name that would be authorized to be called by the user's account.
        window.nearConfig.contractName,
        "Users United"
      )
      .then(() => {
        window.alert("login success");
        tabs.toggle("#post-reason");
      })
      .catch(() => window.alert("login failure"));
  } catch (error) {
    // window.history.pushState(null, null, "#connect-near");
    tabs.toggle("#connect-near");
    console.error(error);
  }
}

function postMessage() {
  MicroModal.show("intro-modal");
}
function sendMessage() {
  const text = $("#message").val();
  FB.api("/me", { fields: ["picture", "name", "email"] }, async function({
    name,
    id,
    email,
    picture
  }) {
    const photo = picture.data.url;
    const date = new Date().toISOString();
    contract
      .addMessage({ text, id, name, email, photo, date })
      .then(res => {
        console.log(res);
        MicroModal.hide("intro-modal");
      })
      .catch(window.alert);
  });
}

function sendMessageMock() {
  const text = $("#message").val();

  const photo = "test";
  const email = "test@test.com";
  const id = "test111";
  const name = "swain";
  const date = new Date().toISOString();
  contract
    .addMessage({ text, id, name, email, photo, date })
    .then(res => {
      window.location.href = "/";
      // MicroModal.close("intro-modal");
    })
    .catch(window.alert);
}

function joinInit() {
  FB.getLoginStatus(({ status }) => {
    if (status === "connected") {
      if (walletAccount.isSignedIn()) {
        tabs.toggle("#post-reason");
      } else {
        tabs.toggle("#connect-near");
      }
    }
  });
}

(async function($) {
  nearInit();
  tabs = new Tabby("[data-tabs]");
  MicroModal.init({});
})(jQuery);
