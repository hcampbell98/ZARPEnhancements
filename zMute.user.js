// ==UserScript==
// @name         zMute
// @namespace    zEnhancements
// @require      zUser.js
// @grant        GM_getValue
// @grant        GM_setValue
// @version      1.0
// @description  I hate Sinz - This script lets you mute him.
// @author       hcampbell.dev
// @match        https://zarpgaming.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zarpgaming.com
// ==/UserScript==

(function () {
    "use strict";

    //Log the current user of the script
    let currentUser = new User(document.querySelector(".kprofilebox-welcome > a").getAttribute("href"));
    //Send request to server to log the current user

    var defaultMutedUsers = [new User("https://zarpgaming.com/index.php/forum/profile/37312-sinzz")];

    //Mute users in defaultMutedUsers if they aren't already muted
    defaultMutedUsers.forEach((user) => {
        if (!user.isMuted() && !user.isInteractedWith()) user.mute();
    });

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
        muteButton.addEventListener("click", () => user.toggleMute());

        //Append mute button to DOM
        profileList.appendChild(muteButton);

        // Replace profile picture for muted user
        if (user.isMuted()) {
            let profileImage = document.querySelector(".kavatar-lg img.kavatar");
            if (profileImage) profileImage.src = "https://zarpgaming.com/media/kunena/avatars/resized/size200/blue_eagle/nophoto.jpg";
        }
    }
    //If we're on a thread, we want to hide posts from muted users
    else if (window.location.href.includes("/forum/")) {
        let mutedUsers = GM_getValue("mutedUsers", []);
        let postsOnPage = document.querySelectorAll(".kmsg");

        postsOnPage.forEach((post) => {
            let profileUrl = "https://zarpgaming.com" + post.querySelector(".kpost-username>a").getAttribute("href");

            if (mutedUsers.includes(profileUrl)) {
                // We want to add a click event handler to the message header, that will toggle the message body
                // The message header is the element directly above the message body
                let messageHeader = post.previousElementSibling;

                // Add click event handler to message header
                messageHeader.addEventListener("click", function () {
                    // Toggle message body
                    // We need to do this by adding the 'hide' attribute to the message body
                    // If the message body is already hidden, we want to remove the 'hide' attribute
                    if (post.hasAttribute("hidden")) post.removeAttribute("hidden");
                    else post.setAttribute("hidden", "");
                });

                // Hide message body
                post.setAttribute("hidden", "");
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

        //Changes "Last Post by" to "Last Post by Muted User" if the last post was by a muted user
        postsOnPage.forEach((post) => {
            let profileUrl = "https://zarpgaming.com" + post.querySelector(".ktopic-latest-post > a:nth-child(2)").getAttribute("href");
            let lastPostBy = post.querySelector(".ktopic-latest-post > a:nth-child(2)");

            if (mutedUsers.includes(profileUrl)) {
                lastPostBy.innerText = "Muted User";

                // Replace avatar for muted user
                let avatar = post.querySelector(".klist-avatar");
                if (avatar) avatar.src = "https://zarpgaming.com/media/kunena/avatars/resized/size200/blue_eagle/nophoto.jpg";
            }
        });

        //Hides threads from muted users
        postsOnPage.forEach((post) => {
            let profileUrl = "https://zarpgaming.com" + post.querySelector(".ktopic-by > a").getAttribute("href");
            let postHref = post.querySelector(".ktopic-title-cover>a").getAttribute("href");

            if (mutedUsers.includes(profileUrl))
                post.innerHTML = `<td class='kcol-first'></td><td class='kcol-mid'></td><td class='kcol-mid kcol-ktopictitle'><div class='ktopic-title-cover'><a href='${postHref}'>This user has been muted</a></div></td><td class='kcol-mid'></td><td class='kcol-mid'></td>`;
        });
    }
})();
