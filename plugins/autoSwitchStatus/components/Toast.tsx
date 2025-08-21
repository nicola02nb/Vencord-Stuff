import { Text } from "@webpack/common";
import { findByPropsLazy, findComponentByCodeLazy } from "@webpack";

const StatusIcon = findComponentByCodeLazy(".ONLINE&&", ".mask");
const ToastClasses = findByPropsLazy("toast", "content");

export function Toast({ message, status, size }: { message: string; status: string; size: number; }) {
    return (
        <div className={`${ToastClasses.toast}`}>
            <StatusIcon status={status} size={size} className={`${ToastClasses.icon}`} />
            <Text variant="text-md/normal" children={message} />
        </div>
    );
}
