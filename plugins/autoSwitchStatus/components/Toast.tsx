/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { findByPropsLazy, findComponentByCodeLazy } from "@webpack";
import { Text } from "@webpack/common";

const StatusIcon = findComponentByCodeLazy(".ONLINE&&", ".mask");
const ToastClasses = findByPropsLazy("toast", "content");

export function Toast({ message, status, size }: { message: string; status: string; size: number; }) {
    return (
        <div className={`${ToastClasses.toast}`}>
            <StatusIcon status={status} size={size} className={`${ToastClasses.icon}`} />
            <Text variant="text-md/normal">{message}</Text>
        </div>
    );
}
