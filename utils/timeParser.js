function parseDuration(value, defaultUnit = 's') {
    if (!value) return null;

    const match = value.toLowerCase().trim().match(/^(\d+)(s|seg|m|min|h|d)?$/);
    if (!match) return null;

    const amount = Number(match[1]);
    if (!Number.isInteger(amount) || amount < 0) return null;

    const unit = match[2] || defaultUnit;
    const multipliers = {
        s: 1000,
        seg: 1000,
        m: 60 * 1000,
        min: 60 * 1000,
        h: 60 * 60 * 1000,
        d: 24 * 60 * 60 * 1000
    };

    return amount * multipliers[unit];
}

function formatDuration(ms) {
    if (ms % (24 * 60 * 60 * 1000) === 0) return `${ms / (24 * 60 * 60 * 1000)} día(s)`;
    if (ms % (60 * 60 * 1000) === 0) return `${ms / (60 * 60 * 1000)} hora(s)`;
    if (ms % (60 * 1000) === 0) return `${ms / (60 * 1000)} minuto(s)`;
    return `${Math.ceil(ms / 1000)} segundo(s)`;
}

module.exports = { parseDuration, formatDuration };
