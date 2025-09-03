/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./QuestButton.css";

import { Icon } from "@vencord/discord-types";
import { findByCodeLazy, findByPropsLazy, findComponentByCodeLazy } from "@webpack";
import { useEffect, useState } from "@webpack/common";

import { QuestsStore } from "../stores";

const QuestIcon: Icon = findByCodeLazy("\"M7.5 21.7a8.95");
const { navigateToQuestHome } = findByPropsLazy("navigateToQuestHome");
const TopBarButton = findComponentByCodeLazy("badgePosition");

function questsStatus() {
    const availableQuests = [...QuestsStore.quests.values()];
    return availableQuests.reduce((acc, x) => {
        if (x.id === "1248385850622869556") return acc;
        else if (new Date(x.config.expiresAt).getTime() < Date.now()) {
            acc.expired++;
        } else if (x.userStatus?.claimedAt) {
            acc.claimed++;
        } else if (x.userStatus?.completedAt) {
            acc.claimable++;
        } else if (x.userStatus?.enrolledAt) {
            acc.enrolled++;
        } else {
            acc.enrollable++;
        }
        return acc;
    }, { enrollable: 0, enrolled: 0, claimable: 0, claimed: 0, expired: 0 });
}

export function QuestButton() {
    const [state, setState] = useState({ enrollable: 0, enrolled: 0, claimable: 0, claimed: 0, expired: 0 });

    const checkForNewQuests = () => {
        setState(questsStatus());
    };

    useEffect(() => {
        QuestsStore.addChangeListener(checkForNewQuests);
        return () => {
            QuestsStore.removeChangeListener(checkForNewQuests);
        };
    }, []);


    return (
        <TopBarButton
            className={state.enrollable ? "quest-button-enrollable" : state.enrolled ? "quest-button-enrolled" : state.claimable ? "quest-button-claimable" : ""}
            iconClassName={undefined}
            /* children={undefined} */
            selected={undefined}
            disabled={navigateToQuestHome === undefined}
            showBadge={state.enrollable > 0 || state.enrolled > 0 || state.claimable > 0}
            badgePosition={"bottom"}
            icon={QuestIcon}
            iconSize={20}
            onClick={navigateToQuestHome}
            onContextMenu={undefined}
            tooltip={state.enrollable ? `${state.enrollable} Enrollable Quests` : state.enrolled ? `${state.enrolled} Enrolled Quests` : state.claimable ? `${state.claimable} Claimable Quests` : "Quests"}
            tooltipPosition={"bottom"}
            hideOnClick={false}
        />
    );
}
