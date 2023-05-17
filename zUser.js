class User {
    constructor(profileUrl) {
        this.profileUrl = profileUrl;
        this.muted = this.isMuted();
    }

    toggleMute() {
        if (this.muted) {
            this.unmute();
        } else {
            this.mute();
        }
    }

    isMuted() {
        let mutedUsers = GM_getValue("mutedUsers", []);
        return mutedUsers.includes(this.profileUrl);
    }

    mute() {
        this.muted = true;
        let mutedUsers = GM_getValue("mutedUsers", []);

        if (!mutedUsers.includes(this.profileUrl)) {
            mutedUsers.push(this.profileUrl);
            GM_setValue("mutedUsers", mutedUsers);
            console.log(GM_getValue("mutedUsers", []));
        }

        window.location.reload();
    }

    unmute() {
        this.muted = false;
        let mutedUsers = GM_getValue("mutedUsers", []);

        if (mutedUsers.includes(this.profileUrl)) {
            mutedUsers.splice(mutedUsers.indexOf(this.profileUrl), 1);
            GM_setValue("mutedUsers", mutedUsers);
        }

        window.location.reload();
    }
}
