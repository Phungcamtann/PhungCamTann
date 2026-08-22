(() => {
  function initLoader(onReady) {
    const loadingScreen = document.getElementById("loading-screen");
    const complete = () => {
      if (typeof onReady === "function") onReady();
    };

    if (!loadingScreen) {
      complete();
      return;
    }

    let hasVisited = false;
    try {
      hasVisited = Boolean(sessionStorage.getItem("hasVisited"));
    } catch {
      hasVisited = false;
    }

    if (!hasVisited) {
      setTimeout(() => {
        loadingScreen.style.opacity = "0";
        loadingScreen.style.visibility = "hidden";

        setTimeout(() => {
          loadingScreen.style.display = "none";
          try {
            sessionStorage.setItem("hasVisited", "true");
          } catch {
            // Storage can be unavailable in privacy-restricted contexts.
          }
          complete();
        }, 500);
      }, 2000);
      return;
    }

    loadingScreen.style.display = "none";
    complete();
  }

  window.DamianApp = window.DamianApp || {};
  window.DamianApp.initLoader = initLoader;
})();
