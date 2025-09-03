/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";
import { User } from "@vencord/discord-types";
import { React } from "@webpack/common";

import { UserChatButton } from "./components/UserChatButton";

export default definePlugin({
    name: "ClickToChat",
    description: "Click to open direct message.",
    authors: [Devs.nicola02nb],
    patches: [
        {
            find: "\"avatarContainerClass\",\"userNameClassName\"",
            replacement: {
                match: /(\((\i),\i\){?=.{0,850}\.flipped])(:\i}\),children:\[)/,
                replace: "$1$3$self.renderPing($2?.user),"
            }
        }
    ],
    start: () => {
    },
    stop: () => {
    },

    renderPing(user?: User) {
        if (!user) return null;
        return <UserChatButton user={user} />;
    }
});


