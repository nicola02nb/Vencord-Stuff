/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export type ApplicationStreamingStore = any;
export type RunningGameStore = any;
export type QuestsStore = {
    quests: Map<string, QuestValue>;
};
export type ChannelStore = any;
export type GuildChannelStore = {
    getAllGuilds(): Map<string, GuildData>;
};
