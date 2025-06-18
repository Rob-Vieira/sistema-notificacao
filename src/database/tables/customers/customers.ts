export const customers = `
  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    cpf VARCHAR(11) UNIQUE NOT NULL
  )
`;