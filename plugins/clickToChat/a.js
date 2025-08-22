/**
* @name ClickToChat
* @version 1.1.5
* @description Click to open direct message
* @author hobbica, nicola02nb
* @authorId 83806103388815360
* @authorLink https://github.com/hobbica98
* @website https://github.com/hobbica98/ClickToChat-BetterDiscord-Plugin
* @source https://github.com/hobbica98/ClickToChat-BetterDiscord-Plugin/blob/master/ClickToChat.plugin.js
* @updateUrl https://raw.githubusercontent.com/hobbica98/ClickToChat-BetterDiscord-Plugin/master/ClickToChat.plugin.js
*/
const { Webpack, Patcher, React } = BdApi;
const getConnectedUser = Webpack.getByKeys("getCurrentUser");
const openPrivateChannel = Webpack.getByKeys("openPrivateChannel");
const VoiceUser = Object.values(Webpack.getBySource("avatarContainerClass", "userNameClassName")).find((value) => {
    if (value.render) return value;
});;

var console = {};

module.exports = class ClickToChat {
    constructor(meta) {
        this.meta = meta;
        this.BdApi = new BdApi(this.meta.name);
        console = this.BdApi.Logger;
    }

    start() {
        this.BdApi.DOM.addStyle(this.meta.name, `div[class^='list_'][class*='collapsed_'] .click-to-chat-btn{display:none;}`);
        this.patchConnectedUser();
        this.userId = getConnectedUser.getCurrentUser().id; // Loading current user ID
    }

    stop() {
        Patcher.unpatchAll(this.meta.name);
        this.BdApi.DOM.removeStyle();
    }

    getChatButton(userId) {
        // Checking if patching user is current user ID
        let disabledButtonClass = "";
        let disabledStatus = false;
        if (userId === this.userId) {
            disabledButtonClass = " bd-button-disabled";
            disabledStatus = true;
        }

        return React.createElement('div', {
            className: "bd-controls bd-addon-controls"
        }, React.createElement('button', {
            onClick: () => {
                openPrivateChannel.openPrivateChannel({ recipientIds: userId });
            },
            className: "click-to-chat-btn bd-button bd-button-blank bd-button-color-brand bd-button-grow" + disabledButtonClass,
            disabled: disabledStatus
        }, React.createElement('svg',
            {
                'xmlns': "http://www.w3.org/2000/svg",
                style: { width: '20px', color: 'var(--channels-default)' },
                'viewBox': "0 0 24 24",
            }, React.createElement('path',
                {
                    fill: "currentColor",
                    d: "M12 22a10 10 0 1 0-8.45-4.64c.13.19.11.44-.04.61l-2.06 2.37A1 1 0 0 0 2.2 22H12Z"
                }, null)
        )));
    }

    async patchConnectedUser() {
        Patcher.after(this.meta.name, VoiceUser, "render", (thisObject, [props], returnValue) => {
            const user = props.user.id;
            if (!user) return returnValue;

            const chatButton = this.getChatButton(user);

            // Insert the chat button at the beginning of the children array
            returnValue.props.children.props.children.unshift(chatButton);
            return returnValue;
        });
    }
};
