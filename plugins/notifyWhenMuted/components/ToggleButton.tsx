import "./ToggleButton.css";

import { Button, Tooltip, useState } from "@webpack/common";
import { settings } from "../settings";
import { Icon } from "./Icon";
import { findByPropsLazy } from "@webpack";

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
