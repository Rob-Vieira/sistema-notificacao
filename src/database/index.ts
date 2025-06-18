import Database from "better-sqlite3";
import path from "path";

import { tables } from "./tables";

const dbPath = path.join(__dirname, "../data/database.db");
const db = new Database(dbPath);

function setupBD(){
    tables.forEach((table) => db.prepare(table).run());
}


export default db;
export { setupBD };