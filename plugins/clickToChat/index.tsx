/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2022 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";
import { React, UserStore } from "@webpack/common";

import { ChatButton } from "./components/Button";

export default definePlugin({
    name: "ShowPing",
    description: "Displays your live ping.",
    authors: [Devs.nicola02nb],
    patches: [

    ],
    start: () => {
    },
    stop: () => {
    },

    renderPing(userId) {
        return <ChatButton userId={userId} disabled={userId !== UserStore.getConnectedUser().id} />;
    }
});


