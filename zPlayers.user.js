// ==UserScript==
// @name         zPlayers
// @namespace    zEnhancements
// @version      0.2
// @description  Removes Discord user count from the "Players Online" statistic
// @author       hcampbell.dev
// @match        https://zarpgaming.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zarpgaming.com
// ==/UserScript==

(function () {
    "use strict";

    let userCounter = document.querySelector("#rt-sidebar-a > div.rt-block.title4.box4.visible-desktop > div > div.module-title > h2");
    let originalCount = parseInt(userCounter.innerText.replace(" PLAYERS ONLINE", ""));

    let discordCounter = document.querySelector(
        "#rt-sidebar-a > div.rt-block.title4.box4.visible-desktop > div > div.module-content > div > div > div:nth-child(8) > div.divTableCell.divTablePlayerCount"
    );
    let discordCount = parseInt(discordCounter.innerText.split("/")[0]);

    userCounter.innerText = originalCount - discordCount + " PLAYERS ONLINE";
})();
