const { db } = require("./config/db");

async function checkTables() {
  const result =
    await db`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
  console.log(result);
  process.exit(0);
}

checkTables();
