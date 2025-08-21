import { findGroupChildrenByChildId, NavContextMenuPatchCallback } from "@api/ContextMenu";
import { Channel, Guild, User } from "@vencord/discord-types";
import { Menu, SelectedGuildStore } from "@webpack/common";
import settings from "../settings";
import { getUserName } from "./utils";
import AudioPlayer from "./AudioPlayer";

function toggleItemInArray(array: string[], item: string) {
    const indexOfItem = array.indexOf(item);
    if (indexOfItem === -1) {
        array.push(item);
    } else {
        array = array.splice(indexOfItem, 1);
    }
}

export const PatchGuildContextMenu: NavContextMenuPatchCallback = (children, { guild }: { guild: Guild; }) => {
    const group = findGroupChildrenByChildId(["mute-guild", "unmute-guild"], children);

    group?.push(
        <Menu.MenuCheckboxItem
            id="bettertts-subscribe-guild"
            label="TTS Subscribe Guild"
            checked={settings.store.subscribedGuilds.includes(guild.id)}
            action={() => toggleItemInArray(settings.store.subscribedGuilds, guild.id)}
        />
    );
};
export const PatchChannelContextMenu: NavContextMenuPatchCallback = (children, { channel }: { channel: Channel; }) => {
    const group = findGroupChildrenByChildId(["mute-channel", "unmute-channel"], children);

    group?.push(
        <Menu.MenuCheckboxItem
            id="bettertts-subscribe-channel"
            label="TTS Subscribe Channel"
            checked={settings.store.subscribedChannels.includes(channel.id)}
            action={() => toggleItemInArray(settings.store.subscribedChannels, channel.id)}
        />
    );
};
export const PatchUserContextMenu: NavContextMenuPatchCallback = (children, { user, channel }: { user: User; channel: Channel; }) => {
    const groupUser = findGroupChildrenByChildId(["mute"], children);
    const groupChannel = findGroupChildrenByChildId(["mute-channel", "unmute-channel"], children);

    groupUser?.push(
        <Menu.MenuCheckboxItem
            id="bettertts-mute-user"
            label="Mute TTS Messages"
            checked={settings.store.ttsMutedUsers.includes(user.id)}
            action={() => toggleItemInArray(settings.store.ttsMutedUsers, user.id)}
        />,
        <Menu.MenuItem
            id="bettertts-speak-announcement"
            label="Speak Announcement"
            action={() => AudioPlayer.startTTS(`${getUserName(user.id, SelectedGuildStore.getGuildId())} joined`, true)}
        />
    );
    groupChannel?.push(
        <Menu.MenuCheckboxItem
            id="bettertts-subscribe-channel"
            label="TTS Subscribe Channel"
            checked={settings.store.subscribedChannels.includes(channel.id)}
            action={() => toggleItemInArray(settings.store.subscribedChannels, channel.id)}
        />
    );
};
