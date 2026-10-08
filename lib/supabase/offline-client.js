/**
 * Offline Supabase stand-in (development fallback).
 *
 * When `NEXT_PUBLIC_SUPABASE_URL` is not configured we cannot talk to a real
 * database, but the whole app still needs to render. This module implements the
 * small slice of the supabase-js query-builder API that this project uses, on
 * top of the in-memory seed data in `./offline-data`.
 *
 * It is intentionally isomorphic (no Node or browser specific APIs) so both
 * `lib/supabase/server.js` and `lib/supabase/client.js` can share it, and it
 * only ever activates when credentials are missing — production behaviour is
 * untouched.
 */

import { cloneOfflineTables } from './offline-data';

// The store lives on globalThis (not module scope) on purpose: `next dev`
// compiles every route into its own bundle and re-evaluates shared modules
// whenever a new route is compiled (or on HMR), which would otherwise wipe
// the in-memory "database" between requests. A global singleton keeps the
// offline data layer behaving like a real database for the worker's lifetime.
const STORE_KEY = '__portfolioOfflineStore__';

function getStore() {
  if (!globalThis[STORE_KEY]) globalThis[STORE_KEY] = cloneOfflineTables();
  return globalThis[STORE_KEY];
}

export function isOfflineMode() {
  return !process.env.NEXT_PUBLIC_SUPABASE_URL;
}

const MISSING_ROW_ERROR = {
  code: 'PGRST116',
  message: 'JSON object requested, multiple (or no) rows returned',
  details: 'Results contain 0 rows, application/vnd.pgrst.object+json requires 1 row',
};

// Unique constraints mirrored from the SQL schema (migrations 001/009/019 etc.)
// so offline behaviour matches Postgres — e.g. skill_categories.name is UNIQUE.
const UNIQUE_COLUMNS = {
  skill_categories: ['name'],
  social_links: ['platform'],
};

function checkUniqueConstraints(tableName, table, rows) {
  for (const column of UNIQUE_COLUMNS[tableName] || []) {
    for (const row of rows) {
      if (row[column] === undefined || row[column] === null) continue;
      const duplicate = table.find((existing) => String(existing[column]) === String(row[column]));
      if (duplicate) {
        const error = new Error(
          `duplicate key value violates unique constraint "${tableName}_${column}_key"`
        );
        error.code = '23505';
        throw error;
      }
    }
  }
}

function compareValues(a, b) {
  if (a === b) return 0;
  if (a === null || a === undefined) return -1;
  if (b === null || b === undefined) return 1;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b));
}

function toNumber(value) {
  const n = Number(value);
  return Number.isNaN(n) ? value : n;
}

function matchesFilter(row, filter) {
  const raw = row[filter.column];
  const value = filter.value;
  switch (filter.op) {
    case 'eq':
      return String(raw) === String(value);
    case 'neq':
      return String(raw) !== String(value);
    case 'gt':
      return compareValues(raw, value) > 0;
    case 'gte':
      return compareValues(raw, value) >= 0;
    case 'lt':
      return compareValues(raw, value) < 0;
    case 'lte':
      return compareValues(raw, value) <= 0;
    case 'is':
      if (value === null) return raw === null || raw === undefined;
      return raw === value;
    case 'in':
      return (value || []).map(String).includes(String(raw));
    case 'like':
    case 'ilike': {
      const pattern = String(value)
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        .replace(/%/g, '.*')
        .replace(/_/g, '.');
      const flags = filter.op === 'ilike' ? 'i' : '';
      return new RegExp(`^${pattern}$`, flags).test(String(raw ?? ''));
    }
    default:
      return true;
  }
}

function applySelect(row, columns) {
  if (!columns || columns === '*' || columns.includes('*')) return { ...row };
  const picked = {};
  columns
    .split(',')
    .map((c) => c.trim())
    .filter(Boolean)
    .forEach((column) => {
      // Support `alias:column` selections.
      const [left, right] = column.includes(':') ? column.split(':') : [column, column];
      const source = right.trim();
      const target = left.trim();
      picked[target === source ? source : target] = row[source];
    });
  return picked;
}

class OfflineQuery {
  constructor(table) {
    this.table = table;
    this.filters = [];
    this.orderBy = [];
    this.limitCount = null;
    this.rangeBounds = null;
    this.mode = 'select';
    this.columns = '*';
    this.countOption = null;
    this.headOption = false;
    this.payload = null;
    this.upsertOptions = null;
    this.singleMode = null;
  }

  /* ------------------------------ reads ------------------------------ */
  select(columns = '*', options = {}) {
    if (this.mode === 'select') {
      this.columns = columns;
    } else {
      // `.insert(...).select()` — return the written rows.
      this.columns = columns;
    }
    this.countOption = options?.count ?? this.countOption;
    this.headOption = options?.head ?? this.headOption;
    return this;
  }

  /* ----------------------------- filters ----------------------------- */
  eq(column, value) {
    this.filters.push({ column, op: 'eq', value });
    return this;
  }

  neq(column, value) {
    this.filters.push({ column, op: 'neq', value });
    return this;
  }

  gt(column, value) {
    this.filters.push({ column, op: 'gt', value: toNumber(value) });
    return this;
  }

  gte(column, value) {
    this.filters.push({ column, op: 'gte', value: toNumber(value) });
    return this;
  }

  lt(column, value) {
    this.filters.push({ column, op: 'lt', value: toNumber(value) });
    return this;
  }

  lte(column, value) {
    this.filters.push({ column, op: 'lte', value: toNumber(value) });
    return this;
  }

  is(column, value) {
    this.filters.push({ column, op: 'is', value });
    return this;
  }

  in(column, value) {
    this.filters.push({ column, op: 'in', value });
    return this;
  }

  like(column, value) {
    this.filters.push({ column, op: 'like', value });
    return this;
  }

  ilike(column, value) {
    this.filters.push({ column, op: 'ilike', value });
    return this;
  }

  not(column, op, value) {
    this.filters.push({ column, op: 'not', notOperator: op, notValue: value });
    return this;
  }

  or(expression) {
    const clauses = String(expression)
      .split(',')
      .map((chunk) => {
        const [column, op, ...rest] = chunk.split('.');
        return { column: column?.trim(), op: op?.trim(), value: rest.join('.') };
      })
      .filter((c) => c.column && c.op);
    if (clauses.length) this.filters.push({ column: '__or__', op: 'or', value: clauses });
    return this;
  }

  match(object) {
    Object.entries(object || {}).forEach(([column, value]) => this.eq(column, value));
    return this;
  }

  filter(column, op, value) {
    this.filters.push({ column, op, value });
    return this;
  }

  contains(column, value) {
    this.filters.push({ column, op: 'contains', value });
    return this;
  }

  /* ------------------------------ shaping ---------------------------- */
  order(column, options = {}) {
    this.orderBy.push({ column, ascending: options.ascending !== false });
    return this;
  }

  limit(count) {
    this.limitCount = count;
    return this;
  }

  range(from, to) {
    this.rangeBounds = [from, to];
    return this;
  }

  single() {
    this.singleMode = 'single';
    return this;
  }

  maybeSingle() {
    this.singleMode = 'maybeSingle';
    return this;
  }

  /* ------------------------------ writes ----------------------------- */
  insert(rows) {
    this.mode = 'insert';
    this.payload = Array.isArray(rows) ? rows : [rows];
    return this;
  }

  update(values) {
    this.mode = 'update';
    this.payload = values;
    return this;
  }

  upsert(rows, options = {}) {
    this.mode = 'upsert';
    this.payload = Array.isArray(rows) ? rows : [rows];
    this.upsertOptions = options;
    return this;
  }

  delete() {
    this.mode = 'delete';
    return this;
  }

  /* ---------------------------- execution ---------------------------- */
  #rows() {
    const tables = getStore();
    if (!tables[this.table]) tables[this.table] = [];
    return tables[this.table];
  }

  #primaryKey(row = {}) {
    if ('key' in row) return 'key';
    if ('platform' in row) return 'platform';
    if ('id' in row) return 'id';
    if (['api_logs', 'csp_reports', 'skills', 'projects', 'education', 'experience'].includes(this.table)) return 'id';
    return 'key';
  }

  #filtered(rows) {
    return rows.filter((row) =>
      this.filters.every((filter) => {
        if (filter.op === 'or') {
          return filter.value.some((clause) => {
            if (clause.op === 'eq' && String(clause.value) === 'null') {
              return matchesFilter(row, { ...clause, value: null, op: 'is' });
            }
            return matchesFilter(row, clause);
          });
        }
        if (filter.op === 'not') {
          const positive = matchesFilter(row, {
            column: filter.column,
            op: filter.notOperator,
            value: toNumber(filter.notValue),
          });
          return !positive;
        }
        if (filter.op === 'contains') {
          const raw = row[filter.column];
          if (Array.isArray(raw)) return raw.includes(filter.value);
          if (typeof raw === 'string') return raw.includes(String(filter.value));
          if (raw && typeof raw === 'object') {
            return Object.entries(filter.value || {}).every(([k, v]) => String(raw[k]) === String(v));
          }
          return false;
        }
        return matchesFilter(row, filter);
      })
    );
  }

  #sorted(rows) {
    if (!this.orderBy.length) return rows;
    return [...rows].sort((a, b) => {
      for (const { column, ascending } of this.orderBy) {
        const result = compareValues(a[column], b[column]);
        if (result !== 0) return ascending ? result : -result;
      }
      return 0;
    });
  }

  #shape(rows) {
    let shaped = this.#sorted(rows);
    if (this.rangeBounds) {
      const [from, to] = this.rangeBounds;
      shaped = shaped.slice(from, to + 1);
    }
    if (typeof this.limitCount === 'number') {
      shaped = shaped.slice(0, this.limitCount);
    }
    return shaped;
  }

  #execute() {
    const table = this.#rows();

    if (this.mode === 'insert') {
      checkUniqueConstraints(this.table, table, this.payload);
      const inserted = this.payload.map((row) => {
        const nextId =
          typeof row.id === 'number'
            ? row.id
            : table.reduce((max, r) => (typeof r.id === 'number' ? Math.max(max, r.id) : max), 0) + 1;
        return { id: nextId, ...row, created_at: new Date().toISOString() };
      });
      table.push(...inserted);
      return { rows: inserted, count: inserted.length };
    }

    if (this.mode === 'upsert') {
      const key = this.#primaryKey(this.payload[0] || {});
      const written = [];
      this.payload.forEach((row) => {
        const existingIndex = table.findIndex((r) => String(r[key]) === String(row[key]));
        if (existingIndex >= 0) {
          table[existingIndex] = { ...table[existingIndex], ...row, updated_at: new Date().toISOString() };
          written.push(table[existingIndex]);
        } else {
          const nextId =
            row.id ??
            table.reduce((max, r) => (typeof r.id === 'number' ? Math.max(max, r.id) : max), 0) + 1;
          const record = { id: nextId, ...row, created_at: new Date().toISOString() };
          table.push(record);
          written.push(record);
        }
      });
      return { rows: written, count: written.length };
    }

    if (this.mode === 'update') {
      const targets = this.#filtered(table);
      targets.forEach((row) => Object.assign(row, this.payload, { updated_at: new Date().toISOString() }));
      return { rows: targets, count: targets.length };
    }

    if (this.mode === 'delete') {
      const victims = this.#filtered(table);
      victims.forEach((row) => {
        const index = table.indexOf(row);
        if (index >= 0) table.splice(index, 1);
      });
      return { rows: victims, count: victims.length };
    }

    const rows = this.#shape(this.#filtered(table));
    return { rows, count: rows.length };
  }

  then(onFulfilled, onRejected) {
    return this.#run().then(onFulfilled, onRejected);
  }

  async #run() {
    try {
      const { rows, count } = this.#execute();
      const totalCount = this.countOption ? count : null;

      if (this.singleMode) {
        if (rows.length !== 1) {
          if (this.singleMode === 'maybeSingle' && rows.length === 0) {
            return { data: null, error: null, count: totalCount, status: 200 };
          }
          return { data: null, error: { ...MISSING_ROW_ERROR }, count: totalCount, status: 406 };
        }
        return {
          data: applySelect(rows[0], this.columns),
          error: null,
          count: totalCount,
          status: 200,
        };
      }

      if (this.headOption) {
        return { data: null, error: null, count: count, status: 200 };
      }

      return {
        data: rows.map((row) => applySelect(row, this.columns)),
        error: null,
        count: totalCount,
        status: 200,
      };
    } catch (error) {
      // Preserve Postgres-style codes (e.g. 23505 unique violations) so callers
      // can map them to HTTP statuses exactly like they do against Supabase.
      return {
        data: null,
        error: { message: error.message, code: error.code || 'OFFLINE_ERROR' },
        count: null,
        status: 500,
      };
    }
  }
}

const offlineStorage = {
  from() {
    return {
      async createSignedUrl() {
        // No object storage offline — callers fall back to local files.
        return { data: null, error: { message: 'Offline mode: storage unavailable' } };
      },
      async upload() {
        return { data: null, error: { message: 'Offline mode: storage unavailable' } };
      },
      async remove() {
        return { data: null, error: { message: 'Offline mode: storage unavailable' } };
      },
      getPublicUrl(path) {
        return { data: { publicUrl: path } };
      },
    };
  },
};

let warned = false;

export function createOfflineClient() {
  if (!warned && typeof console !== 'undefined') {
    warned = true;
    console.warn(
      '[portfolio] Supabase env vars are missing — running with the in-memory offline data layer (lib/supabase/offline-data.js).'
    );
  }

  return {
    from(table) {
      return new OfflineQuery(table);
    },
    storage: offlineStorage,
    async rpc() {
      return { data: null, error: { message: 'Offline mode: RPC unavailable' } };
    },
    auth: {
      async getUser() {
        return { data: { user: null }, error: null };
      },
      async getSession() {
        return { data: { session: null }, error: null };
      },
    },
  };
}
