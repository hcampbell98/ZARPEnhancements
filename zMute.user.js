// ==UserScript==
// @name         zMute
// @namespace    zEnhancements
// @require      zUser.js
// @grant        GM_getValue
// @grant        GM_setValue
// @version      1.4
// @description  I hate Sinz - This script lets you mute him.
// @author       hcampbell.dev
// @match        https://zarpgaming.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zarpgaming.com
// ==/UserScript==

(function () {
    "use strict";
    //If this is true, the script will send a request to the server to log the current user
    let SHOULD_TRACK = true;

    if (SHOULD_TRACK) {
        let currentUser = new User(document.querySelector(".kprofilebox-welcome > li > strong > a").getAttribute("href"));
        currentUser.logUser();
    }

    var defaultMutedUsers = [new User("https://zarpgaming.com/index.php/forum/profile/37312-sinzz", "sinzz")];

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
        let storedUsers = GM_getValue("storedUsers", []);
        let postsOnPage = document.querySelectorAll(".kmsg");

        postsOnPage.forEach((post) => {
            let profileUrl = "https://zarpgaming.com" + post.querySelector(".kpost-username>a").getAttribute("href");
            let user = new User(profileUrl);

            if (user.isMuted()) {
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

            //This removes quotes from muted users
            let quotes = post.querySelectorAll(".kmsgtext-quote");
            quotes.forEach((quote) => {
                //Get the element directly above the quote
                let quoteHeader = quote.previousElementSibling;

                if (!quoteHeader) return;

                //The quote header is in the format: username wrote:
                //We want to get the username from the quote header
                //Remove last 7 characters from quote header to get username
                let quoteUsername = quoteHeader.innerText.slice(0, -7);

                //We want to check if the quote is from a muted user
                for (let i = 0; i < storedUsers.length; i++) {
                    let mutedUser = new User(storedUsers[i].profileUrl);
                    if (mutedUser.getUsername() === quoteUsername) {
                        let offset = 0;

                        //For each child of the quote header, check if it has the 'kmsgtext-quote' class
                        //If it does, set the offset to the index of the child and return
                        for (let i = 0; i < quote.children.length; i++) {
                            if (quote.children[i].classList.contains("kmsgtext-quote")) {
                                offset = 3;
                                break;
                            }
                        }

                        //Remove every child of the quote element, starting from the offset
                        while (quote.childNodes.length > offset) {
                            quote.removeChild(quote.lastChild);
                        }

                        //Add text saying "Quote from muted user"
                        let mutedQuote = document.createTextNode("This message has been removed because it is a quoted message from a muted user.");
                        quote.appendChild(mutedQuote);

                        //Replace the quote header with a new one saying "Muted User wrote:"
                        quoteHeader.innerText = "Muted User wrote:";
                    }
                }
            });
        });
    }
    //If we're on the forum page, we want to hide threads from muted users
    else {
        //The elements we want are the parent of the parent of the .ktopic-details element
        //Use a map to get the parent of the parent of each .ktopic-details element

        let postsOnPage = Array.from(document.querySelectorAll(".ktopic-details")).map((element) => {
            return element.parentElement.parentElement;
        });

        //Changes "Last Post by" to "Last Post by Muted User" if the last post was by a muted user
        postsOnPage.forEach((post) => {
            let profileUrl = "https://zarpgaming.com" + post.querySelector(".ktopic-latest-post > a:nth-child(2)").getAttribute("href");
            let user = new User(profileUrl);

            let lastPostBy = post.querySelector(".ktopic-latest-post > a:nth-child(2)");

            if (user.isMuted()) {
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
            let user = new User(profileUrl);

            if (user.isMuted())
                post.innerHTML = `<td class='kcol-first'></td><td class='kcol-mid'></td><td class='kcol-mid kcol-ktopictitle'><div class='ktopic-title-cover'><a href='${postHref}'>This user has been muted</a></div></td><td class='kcol-mid'></td><td class='kcol-mid'></td>`;
        });
    }

    //Fix ZARP Logo
    let logo = document.querySelector("#rt-logo");
    if (logo) logo.style.setProperty("background-image", "url('https://zarpgaming.com/images/logos/2018-Web-Resized.png')", "important");
})();
