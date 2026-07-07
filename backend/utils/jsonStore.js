/**
 * JSON File Storage Utility
 * -------------------------
 * Replaces MongoDB/Mongoose with local JSON file persistence.
 * All data files live in  backend/data/<filename>.json.
 *
 * Every public helper is async and uses fs/promises.
 */

const fs = require('fs/promises');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

/* ── Data directory ─────────────────────────────────────────── */

const DATA_DIR = path.join(__dirname, '..', 'data');

/**
 * Ensure the data/ directory exists.  Called once at server startup.
 */
const initDataDir = async () => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    console.log('📂 Data directory ready:', DATA_DIR);
  } catch (err) {
    console.error('❌ Failed to create data directory:', err.message);
    throw err;
  }
};

/* ── Low-level read / write ─────────────────────────────────── */

/**
 * Read and parse a JSON data file.
 * Returns an empty array if the file doesn't exist or contains invalid JSON.
 *
 * @param {string} filename  e.g. 'users.json'
 * @returns {Promise<Array>}
 */
const readJSON = async (filename) => {
  const filePath = path.join(DATA_DIR, filename);
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    if (err.code === 'ENOENT') {
      /* File doesn't exist yet — create it with an empty array */
      await writeJSON(filename, []);
      return [];
    }
    if (err instanceof SyntaxError) {
      console.warn(`⚠️  Invalid JSON in ${filename}, resetting to []`);
      await writeJSON(filename, []);
      return [];
    }
    throw err;
  }
};

/**
 * Write data to a JSON file (overwrites entire file).
 *
 * @param {string} filename
 * @param {Array}  data
 */
const writeJSON = async (filename, data) => {
  const filePath = path.join(DATA_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
};

/* ── CRUD helpers ───────────────────────────────────────────── */

/**
 * Return all records, optionally filtered.
 *
 * @param {string}   filename
 * @param {Object}   [filter]  key-value pairs that must ALL match
 * @returns {Promise<Array>}
 */
const findAll = async (filename, filter = null) => {
  const data = await readJSON(filename);
  if (!filter) return data;
  return data.filter((item) =>
    Object.entries(filter).every(([key, val]) => item[key] === val)
  );
};

/**
 * Return the first record that matches every key-value pair in `filter`.
 *
 * @param {string} filename
 * @param {Object} filter
 * @returns {Promise<Object|null>}
 */
const findOne = async (filename, filter) => {
  const data = await readJSON(filename);
  return (
    data.find((item) =>
      Object.entries(filter).every(([key, val]) => item[key] === val)
    ) || null
  );
};

/**
 * Find a single record by its `id` field (UUID).
 *
 * @param {string} filename
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
const findById = async (filename, id) => {
  const data = await readJSON(filename);
  return data.find((item) => item.id === id) || null;
};

/**
 * Create a new record with auto-generated `id`, `createdAt`, `updatedAt`.
 *
 * @param {string} filename
 * @param {Object} record   Fields to store (id/createdAt/updatedAt are added)
 * @returns {Promise<Object>} The created record
 */
const create = async (filename, record) => {
  const data = await readJSON(filename);
  const now = new Date().toISOString();
  const newRecord = {
    id: uuidv4(),
    ...record,
    createdAt: now,
    updatedAt: now,
  };
  data.push(newRecord);
  await writeJSON(filename, data);
  return newRecord;
};

/**
 * Update a record found by its `id`.
 *
 * @param {string} filename
 * @param {string} id
 * @param {Object} updates  Fields to merge
 * @returns {Promise<Object|null>} Updated record, or null if not found
 */
const updateById = async (filename, id, updates) => {
  const data = await readJSON(filename);
  const index = data.findIndex((item) => item.id === id);
  if (index === -1) return null;

  data[index] = {
    ...data[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  await writeJSON(filename, data);
  return data[index];
};

/**
 * Delete a single record by its `id`.
 *
 * @param {string} filename
 * @param {string} id
 * @returns {Promise<Object|null>} Deleted record, or null if not found
 */
const deleteById = async (filename, id) => {
  const data = await readJSON(filename);
  const index = data.findIndex((item) => item.id === id);
  if (index === -1) return null;

  const [removed] = data.splice(index, 1);
  await writeJSON(filename, data);
  return removed;
};

/**
 * Delete every record that matches the filter.
 *
 * @param {string} filename
 * @param {Object} filter   key-value pairs that must ALL match
 * @returns {Promise<number>} Count of deleted records
 */
const deleteMany = async (filename, filter) => {
  const data = await readJSON(filename);
  const remaining = data.filter(
    (item) =>
      !Object.entries(filter).every(([key, val]) => item[key] === val)
  );
  const deletedCount = data.length - remaining.length;
  if (deletedCount > 0) {
    await writeJSON(filename, remaining);
  }
  return deletedCount;
};

/* ── Exports ────────────────────────────────────────────────── */

module.exports = {
  initDataDir,
  readJSON,
  writeJSON,
  findAll,
  findOne,
  findById,
  create,
  updateById,
  deleteById,
  deleteMany,
};
