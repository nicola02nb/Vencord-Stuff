/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./ToggleButton.css";

import { findByPropsLazy } from "@webpack";
import { Button, Tooltip, useState } from "@webpack/common";

import { settings } from "../settings";
import { Icon } from "./Icon";

const buttonStates = findByPropsLazy("enabled", "button");

export const ToggleButton = () => {
    const [enabled, setEnabled] = useState(settings.store.notifyEnabled);
    const toggle = () => {
        settings.store.notifyEnabled = !enabled;
        setEnabled(!enabled);
    };

    return <Tooltip text={enabled ? "Disable Notify When Muted" : "Enable Notify When Muted"}>
        {({ onMouseEnter, onMouseLeave }) => (
            <Button size={Button.Sizes.ICON} look={Button.Looks.BLANK} color={Button.Colors.BRAND} className={`toggleNotifyMuted ${buttonStates.button} ${buttonStates.enabled}`} onClick={toggle} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
                <Icon enabled={enabled} />
            </Button>
        )}
    </Tooltip>;
};
