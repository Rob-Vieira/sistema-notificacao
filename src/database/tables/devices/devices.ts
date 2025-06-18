export const devices = `
  CREATE TABLE IF NOT EXISTS devices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_customer INTEGER NOT NULL,
    token TEXT UNIQUE NOT NULL,
    last_success DATETIME
  )
`;