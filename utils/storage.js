const defaultData = {
    warningsDB: {},
    afkDB: {},
    timeoutsDB: {},
    bansDB: {}
};

const stateId = process.env.SUPABASE_STATE_ID || 'global';
const tableName = process.env.SUPABASE_TABLE || 'bot_state';

function hasSupabaseConfig() {
    return Boolean(process.env.SUPABASE_URL && getSupabaseKey());
}

function getSupabaseKey() {
    return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;
}

function getSupabaseUrl(path) {
    return `${process.env.SUPABASE_URL.replace(/\/$/, '')}/rest/v1/${path}`;
}

function getHeaders(extraHeaders = {}) {
    const key = getSupabaseKey();
    return {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        ...extraHeaders
    };
}

function normalizeData(data = {}) {
    return {
        warningsDB: data.warningsDB || {},
        afkDB: data.afkDB || {},
        timeoutsDB: data.timeoutsDB || {},
        bansDB: data.bansDB || {}
    };
}

async function loadData() {
    if (!hasSupabaseConfig()) {
        console.warn('Supabase no está configurado. El bot guardará datos solo en memoria hasta que configures SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY.');
        return { ...defaultData };
    }

    try {
        const response = await fetch(getSupabaseUrl(`${tableName}?id=eq.${encodeURIComponent(stateId)}&select=data`), {
            headers: getHeaders()
        });

        if (!response.ok) {
            throw new Error(`Supabase respondió ${response.status}: ${await response.text()}`);
        }

        const rows = await response.json();
        if (!rows[0]) {
            await saveData(defaultData);
            return { ...defaultData };
        }

        return normalizeData(rows[0].data);
    } catch (error) {
        console.error('No se pudo cargar la información desde Supabase:', error);
        return { ...defaultData };
    }
}

async function saveData(data) {
    if (!hasSupabaseConfig()) return;

    try {
        const response = await fetch(getSupabaseUrl(`${tableName}?on_conflict=id`), {
            method: 'POST',
            headers: getHeaders({ Prefer: 'resolution=merge-duplicates,return=minimal' }),
            body: JSON.stringify({
                id: stateId,
                data: normalizeData(data),
                updated_at: new Date().toISOString()
            })
        });

        if (!response.ok) {
            throw new Error(`Supabase respondió ${response.status}: ${await response.text()}`);
        }
    } catch (error) {
        console.error('No se pudo guardar la información en Supabase:', error);
    }
}

async function saveCurrentData() {
    await saveData({
        warningsDB: global.warningsDB || {},
        afkDB: global.afkDB || {},
        timeoutsDB: global.timeoutsDB || {},
        bansDB: global.bansDB || {}
    });
}

async function saveWarningsDB() {
    await saveCurrentData();
}

async function saveAfkDB() {
    await saveCurrentData();
}

async function recordTimeout(userId, data) {
    if (!global.timeoutsDB) global.timeoutsDB = {};
    global.timeoutsDB[userId] = data;
    await saveCurrentData();
}

async function removeTimeout(userId) {
    if (global.timeoutsDB) delete global.timeoutsDB[userId];
    await saveCurrentData();
}

async function recordBan(userId, data) {
    if (!global.bansDB) global.bansDB = {};
    global.bansDB[userId] = data;
    await saveCurrentData();
}

async function removeBan(userId) {
    if (global.bansDB) delete global.bansDB[userId];
    await saveCurrentData();
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
