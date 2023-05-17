// ==UserScript==
// @name         zMute
// @namespace    zEnhancements
// @require 	 zUser.js
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://zarpgaming.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zarpgaming.com
// ==/UserScript==

(function () {
    "use strict";

    if (window.location.href.includes("profile")) {
        //Create User object
        let profileUrl = window.location.href;
        var user = new User(profileUrl);

        let profileList = document.querySelector("#kprofile-stats > ul");

        //Create mute button
        let muteButton = document.createElement("a");
        muteButton.classList.add("kicon-button");
        muteButton.classList.add("kbuttoncomm");
        muteButton.classList.add("btn-left");

        //Set mute button text
        let buttonText = user.isMuted() ? "Unmute" : "Mute";
        muteButton.innerHTML = "<span class='reply'><span>" + buttonText + "</span></span>";

        //Added click handler to mute button
        muteButton.addEventListener("click", function () {
            user.toggleMute();
        });

        //Append mute button to DOM
        profileList.appendChild(muteButton);
    } else {
        let mutedUsers = GM_getValue("mutedUsers", []);
        let postsOnPage = document.querySelectorAll(".kmsg");

        postsOnPage.forEach((post) => {
            let profileUrl = "https://zarpgaming.com" + post.querySelector(".kpost-username>a").getAttribute("href");

            if (mutedUsers.includes(profileUrl)) {
                console.log("Blocked muted user from being displayed");

                let parent = post.parentElement;
                parent.removeChild(post);
            }
        });
    }
})();
