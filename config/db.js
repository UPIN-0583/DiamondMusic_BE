const { neon } = require("@neondatabase/serverless");
const dotenv = require("dotenv");

dotenv.config();
const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

// connect
const db = neon(
  `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`
);

const initDB = async () => {
  try {
    const result = await db`SELECT NOW()`;
    console.log("Connected to DB at:", result[0]);
  } catch (error) {
    console.log("Error initDB", error);
  }
};

module.exports = { db, initDB };
