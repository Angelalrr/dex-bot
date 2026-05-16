const fs = require('fs');
const path = require('path');

const dataFile = process.env.DATA_FILE || path.join(__dirname, '..', 'data', 'bot-data.json');
const dataDir = path.dirname(dataFile);

const defaultData = {
    warningsDB: {},
    afkDB: {},
    timeoutsDB: {},
    bansDB: {}
};

function ensureDataDir() {
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
}

function loadData() {
    ensureDataDir();

    if (!fs.existsSync(dataFile)) {
        saveData(defaultData);
        return { ...defaultData };
    }

    try {
        const parsed = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
        return {
            warningsDB: parsed.warningsDB || {},
            afkDB: parsed.afkDB || {},
            timeoutsDB: parsed.timeoutsDB || {},
            bansDB: parsed.bansDB || {}
        };
    } catch (error) {
        console.error('No se pudo leer la base de datos local:', error);
        return { ...defaultData };
    }
}

function saveData(data) {
    ensureDataDir();
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

function saveCurrentData() {
    saveData({
        warningsDB: global.warningsDB || {},
        afkDB: global.afkDB || {},
        timeoutsDB: global.timeoutsDB || {},
        bansDB: global.bansDB || {}
    });
}

function saveWarningsDB() {
    saveCurrentData();
}

function saveAfkDB() {
    saveCurrentData();
}

function recordTimeout(userId, data) {
    if (!global.timeoutsDB) global.timeoutsDB = {};
    global.timeoutsDB[userId] = data;
    saveCurrentData();
}

function removeTimeout(userId) {
    if (global.timeoutsDB) delete global.timeoutsDB[userId];
    saveCurrentData();
}

function recordBan(userId, data) {
    if (!global.bansDB) global.bansDB = {};
    global.bansDB[userId] = data;
    saveCurrentData();
}

function removeBan(userId) {
    if (global.bansDB) delete global.bansDB[userId];
    saveCurrentData();
}

module.exports = {
    loadData,
    saveWarningsDB,
    saveAfkDB,
    recordTimeout,
    removeTimeout,
    recordBan,
    removeBan
};
