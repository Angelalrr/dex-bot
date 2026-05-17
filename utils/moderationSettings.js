const DEFAULT_ANTISPAM_TIMEOUT_MS = 60 * 60 * 1000;

function getGuildSettings(guildId) {
    if (!global.moderationSettingsDB) global.moderationSettingsDB = {};
    if (!global.moderationSettingsDB[guildId]) {
        global.moderationSettingsDB[guildId] = {
            antilink: false,
            antispam: {
                enabled: false,
                timeoutMs: DEFAULT_ANTISPAM_TIMEOUT_MS
            }
        };
    }

    const settings = global.moderationSettingsDB[guildId];
    settings.antispam = {
        enabled: false,
        timeoutMs: DEFAULT_ANTISPAM_TIMEOUT_MS,
        ...(settings.antispam || {})
    };

    return settings;
}

module.exports = { DEFAULT_ANTISPAM_TIMEOUT_MS, getGuildSettings };
