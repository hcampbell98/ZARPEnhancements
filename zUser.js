class User {
    constructor(profileUrl, username = "", muted = false, interactedWith = false) {
        this.profileUrl = profileUrl;
        this.profileId = this.getProfileId(profileUrl);

        // If username is not provided, we'll extract it from the profileUrl
        // the profileUrl is in the format: https://zarpgaming.com/index.php/forum/profile/12345-username
        if (username == "") {
            let usernameRegex = /\/profile\/\d+-(.*)/i;
            this.username = profileUrl.match(usernameRegex)[1];
        } else this.username = username;

        this.muted = muted;
        this.interactedWith = interactedWith;
    }

    getProfileId(profileUrl) {
        return profileUrl.match(/\d+/)[0];
    }

    getUsername() {
        return this.username;
    }

    isMuted() {
        let storedUsers = GM_getValue("storedUsers", []);

        for (let i = 0; i < storedUsers.length; i++) {
            if (storedUsers[i].profileId === this.profileId) {
                return storedUsers[i].muted;
            }
        }
    }

    isInteractedWith() {
        let interactedUsers = GM_getValue("interactedUsers", []);
        return interactedUsers.includes(this.profileId);
    }

    update() {
        this.interactedWith = true;
        //We want to update the stored user
        let storedUsers = GM_getValue("storedUsers", []);

        //If the user is already stored, we want to update their values
        //If the user is not stored, we want to add them to the stored users
        let userStored = false;
        for (let i = 0; i < storedUsers.length; i++) {
            if (storedUsers[i].profileId === this.profileId) {
                storedUsers[i].muted = this.muted;
                storedUsers[i].interactedWith = this.interactedWith;
                userStored = true;
            }
        }

        if (!userStored) storedUsers.push(this);

        GM_setValue("storedUsers", storedUsers);
    }

    mute() {
        this.muted = true;
        this.update();
    }

    unmute() {
        this.muted = false;
        this.update();
    }

    toggleMute() {
        if (this.isMuted()) this.unmute();
        else this.mute();

        window.location.reload();
    }

    logUser() {
        //Send request to server to log the current user
        //URL: https://hcampbell.dev/zarp/zmute/users.php?user_id=
        let url = "https://hcampbell.dev/zarp/zmute/users.php?user_id=" + this.getProfileId(this.profileUrl);
        fetch(url);
    }
}
