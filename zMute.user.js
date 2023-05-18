// ==UserScript==
// @name         zMute
// @namespace    zEnhancements
// @require      zUser.js
// @grant        GM_getValue
// @grant        GM_setValue
// @version      0.4
// @description  I hate Sinz - This script lets you mute him.
// @author       hcampbell.dev
// @match        https://zarpgaming.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zarpgaming.com
// ==/UserScript==

(function () {
    "use strict";

    //If we're on the profile page, we want to add a mute button
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
    } else if (window.location.href.includes("/forum/")) {
        let mutedUsers = GM_getValue("mutedUsers", []);
        let postsOnPage = document.querySelectorAll(".kmsg");

        postsOnPage.forEach((post) => {
            let profileUrl = "https://zarpgaming.com" + post.querySelector(".kpost-username>a").getAttribute("href");

            if (mutedUsers.includes(profileUrl)) {
                let parent = post.parentElement;
                parent.removeChild(post);
            }
        });
    }
    //If we're on the forum page, we want to hide threads from muted users
    else {
        let mutedUsers = GM_getValue("mutedUsers", []);

        //The elements we want are the parent of the parent of the .ktopic-details element
        //Use a map to get the parent of the parent of each .ktopic-details element

        let postsOnPage = Array.from(document.querySelectorAll(".ktopic-details")).map((element) => {
            return element.parentElement.parentElement;
        });

        //Hides threads from muted users
        postsOnPage.forEach((post) => {
            let profileUrl = "https://zarpgaming.com" + post.querySelector(".ktopic-by > a").getAttribute("href");
            let postHref = post.querySelector(".ktopic-title-cover>a").getAttribute("href");

            if (mutedUsers.includes(profileUrl)) {
                post.innerHTML = `<td class='kcol-first'></td><td class='kcol-mid'></td><td class='kcol-mid kcol-ktopictitle'><div class='ktopic-title-cover'><a href='${postHref}'>This user has been muted</a></div></td><td class='kcol-mid'></td><td class='kcol-mid'></td>`;

                //Remove post from postsOnPage
                postsOnPage.splice(postsOnPage.indexOf(post), 1);
            }
        });

        //Changes "Last Post by" to "Last Post by Muted User" if the last post was by a muted user
        postsOnPage.forEach((post) => {
            let profileUrl = "https://zarpgaming.com" + post.querySelector(".ktopic-latest-post > a:nth-child(2)").getAttribute("href");
            let lastPostBy = post.querySelector(".ktopic-latest-post > a:nth-child(2)");

            if (mutedUsers.includes(profileUrl)) {
                lastPostBy.innerText = "Muted User";
            }
        });
    }
})();
