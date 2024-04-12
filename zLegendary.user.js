// ==UserScript==
// @name         zLegendary
// @namespace    zEnhancements
// @require      https://raw.githubusercontent.com/hcampbell98/ZARPEnhancements/main/zUser.js
// @version      0.1
// @description  Adds new Legendary Members to the ZARP forums
// @author       hcampbell.dev
// @match        https://zarpgaming.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zarpgaming.com
// ==/UserScript==

(function () {
    "use strict";

    //If we're on the profile page
    if (window.location.href.includes("profile")) {
    }
    //If we're in a thread
    else if (window.location.href.includes("/forum/")) {
        let postsOnPage = document.querySelectorAll(".kmsg");
        postsOnPage.forEach((post) => {
            let profileUrl = "https://zarpgaming.com" + post.querySelector(".kpost-username>a").getAttribute("href");
            let user = new User(profileUrl);
            if (user.isLegendary()) {
                let rankImage = post.querySelectorAll("kpost-userrank-img > img").slice(-1)[0];
                rankImage.src = "https://zarpgaming.com/media/kunena/ranks/2023-legendarymember.png";
            }
        });
    }
    //If we're on an index page
    else {
    }
})();
