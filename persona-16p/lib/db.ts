import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

const DB_DIR = path.join(process.cwd(), "db");

async function ensureDir() {
  await mkdir(DB_DIR, { recursive: true });
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await readFile(path.join(DB_DIR, file), "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(file: string, data: T): Promise<void> {
  await ensureDir();
  await writeFile(path.join(DB_DIR, file), JSON.stringify(data, null, 2), "utf-8");
}

// ── Generic array-based collections ──

export async function readAll<T>(file: string): Promise<T[]> {
  return readJson<T[]>(file, []);
}

export async function readById<T extends { id: string }>(file: string, id: string): Promise<T | null> {
  const items = await readAll<T>(file);
  return items.find((item) => item.id === id) ?? null;
}

export async function create<T extends { id: string }>(file: string, item: T): Promise<T> {
  const items = await readAll<T>(file);
  items.push(item);
  await writeJson(file, items);
  return item;
}

export async function update<T extends { id: string }>(file: string, id: string, patch: Partial<T>): Promise<T | null> {
  const items = await readAll<T>(file);
  const idx = items.findIndex((item) => item.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...patch };
  await writeJson(file, items);
  return items[idx];
}

export async function remove<T extends { id: string }>(file: string, id: string): Promise<boolean> {
  const items = await readAll<T>(file);
  const filtered = items.filter((item) => item.id !== id);
  if (filtered.length === items.length) return false;
  await writeJson(file, filtered);
  return true;
}

// ── Structured JSON (non-array) ──

export async function readStructured<T>(file: string, fallback: T): Promise<T> {
  return readJson<T>(file, fallback);
}

export async function writeStructured<T>(file: string, data: T): Promise<void> {
  await writeJson(file, data);
}

// ── Query helpers ──

export async function findMany<T>(file: string, predicate: (item: T) => boolean): Promise<T[]> {
  const items = await readAll<T>(file);
  return items.filter(predicate);
}

export async function findOne<T>(file: string, predicate: (item: T) => boolean): Promise<T | null> {
  const items = await readAll<T>(file);
  return items.find(predicate) ?? null;
}
