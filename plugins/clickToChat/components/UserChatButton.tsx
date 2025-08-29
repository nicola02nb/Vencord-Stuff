/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./UserChatButton.css";

import { openPrivateChannel } from "@utils/discord";
import { User } from "@vencord/discord-types";
import { Button, Tooltip, UserStore } from "@webpack/common";

export function UserChatButton({ user }: { user: User; }) {
    return (
        <div className="click-to-chat-btn">
            <Tooltip text={`Open chat with ${user.username}`}>
                {({ onMouseEnter, onMouseLeave }: { onMouseEnter: () => void; onMouseLeave: () => void; }) => (
                    <Button
                        size={Button.Sizes.MIN}
                        color={Button.Colors.TRANSPARENT}
                        look={Button.Looks.BLANK}
                        onClick={() => openPrivateChannel({ recipientIds: user.id })}// TODO: fix types
                        disabled={user.id === UserStore.getCurrentUser().id}
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                    >
                        <svg className="click-to-chat-button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="var(--channels-default)">
                            <path d="M12 22a10 10 0 1 0-8.45-4.64c.13.19.11.44-.04.61l-2.06 2.37A1 1 0 0 0 2.2 22H12Z"></path>
                        </svg>
                    </Button>
                )}
            </Tooltip>
        </div>
    );
}
