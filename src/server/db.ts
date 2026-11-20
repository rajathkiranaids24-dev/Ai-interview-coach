import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

interface SchemaDB {
  users: any[];
  resumes: any[];
  interviews: any[];
  practice_tests: any[];
  learning_recommendations: any[];
  seedDone?: boolean;
}

const defaultDB: SchemaDB = {
  users: [],
  resumes: [],
  interviews: [],
  practice_tests: [],
  learning_recommendations: [],
  seedDone: false,
};

let memoryCache: SchemaDB | null = null;

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultDB, null, 2), 'utf-8');
  }
}

export function readDB(): SchemaDB {
  if (memoryCache) return memoryCache;
  try {
    ensureDataFile();
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    memoryCache = JSON.parse(raw);
    return memoryCache!;
  } catch (err) {
    console.error('Error reading db.json, falling back to default:', err);
    memoryCache = { ...defaultDB };
    return memoryCache;
  }
}

export function writeDB(data: SchemaDB) {
  try {
    ensureDataFile();
    memoryCache = data;
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to db.json:', err);
  }
}

export function generateId(): string {
  return crypto.randomUUID();
}

export const db = {
  users: {
    find: (filter?: (u: any) => boolean) => {
      const data = readDB();
      return filter ? data.users.filter(filter) : data.users;
    },
    findOne: (filter: (u: any) => boolean) => {
      const data = readDB();
      return data.users.find(filter) || null;
    },
    findById: (id: string) => {
      const data = readDB();
      return data.users.find((u) => u._id === id || u.id === id) || null;
    },
    create: (user: any) => {
      const data = readDB();
      const newUser = {
        _id: generateId(),
        createdAt: new Date().toISOString(),
        ...user,
      };
      data.users.push(newUser);
      writeDB(data);
      return newUser;
    },
    updateOne: (id: string, updates: any) => {
      const data = readDB();
      const idx = data.users.findIndex((u) => u._id === id || u.id === id);
      if (idx === -1) return null;
      data.users[idx] = { ...data.users[idx], ...updates, updatedAt: new Date().toISOString() };
      writeDB(data);
      return data.users[idx];
    },
  },
  resumes: {
    find: (filter?: (r: any) => boolean) => {
      const data = readDB();
      return filter ? data.resumes.filter(filter) : data.resumes;
    },
    findById: (id: string) => {
      const data = readDB();
      return data.resumes.find((r) => r._id === id || r.id === id) || null;
    },
    findOne: (filter: (r: any) => boolean) => {
      const data = readDB();
      return data.resumes.find(filter) || null;
    },
    create: (resume: any) => {
      const data = readDB();
      const newResume = {
        _id: generateId(),
        uploadedAt: new Date().toISOString(),
        ...resume,
      };
      data.resumes.push(newResume);
      writeDB(data);
      return newResume;
    },
    delete: (id: string) => {
      const data = readDB();
      data.resumes = data.resumes.filter((r) => r._id !== id && r.id !== id);
      writeDB(data);
      return true;
    },
  },
  interviews: {
    find: (filter?: (i: any) => boolean) => {
      const data = readDB();
      return filter ? data.interviews.filter(filter) : data.interviews;
    },
    findById: (id: string) => {
      const data = readDB();
      return data.interviews.find((i) => i._id === id || i.id === id) || null;
    },
    create: (interview: any) => {
      const data = readDB();
      const newInterview = {
        _id: generateId(),
        createdAt: new Date().toISOString(),
        ...interview,
      };
      data.interviews.push(newInterview);
      writeDB(data);
      return newInterview;
    },
    updateOne: (id: string, updates: any) => {
      const data = readDB();
      const idx = data.interviews.findIndex((i) => i._id === id || i.id === id);
      if (idx === -1) return null;
      data.interviews[idx] = { ...data.interviews[idx], ...updates };
      writeDB(data);
      return data.interviews[idx];
    },
  },
  practiceTests: {
    find: (filter?: (t: any) => boolean) => {
      const data = readDB();
      return filter ? data.practice_tests.filter(filter) : data.practice_tests;
    },
    findById: (id: string) => {
      const data = readDB();
      return data.practice_tests.find((t) => t._id === id || t.id === id) || null;
    },
    create: (test: any) => {
      const data = readDB();
      const newTest = {
        _id: generateId(),
        completedAt: new Date().toISOString(),
        ...test,
      };
      data.practice_tests.push(newTest);
      writeDB(data);
      return newTest;
    },
  },
  learningRecommendations: {
    find: (filter?: (l: any) => boolean) => {
      const data = readDB();
      return filter ? data.learning_recommendations.filter(filter) : data.learning_recommendations;
    },
    createOrUpdate: (userId: string, videos: any[]) => {
      const data = readDB();
      const idx = data.learning_recommendations.findIndex((l) => l.userId === userId);
      const payload = {
        _id: generateId(),
        userId,
        videos,
        updatedAt: new Date().toISOString(),
      };
      if (idx >= 0) {
        data.learning_recommendations[idx] = payload;
      } else {
        data.learning_recommendations.push(payload);
      }
      writeDB(data);
      return payload;
    },
  },
};
