import "./Ping.css";

import { Button } from "@webpack/common";
import { openPrivateChannel } from "@utils/discord";

export function ChatButton({ userId, disabled }) {
    return (<Button size={Button.Sizes.SMALL} color={Button.Colors.TRANSPARENT} onClick={() => openPrivateChannel(userId)} disabled={disabled}>A</Button>);
}
