const express = require("express");
const app = express();
app.use(express.json());
const sqlite3 = require("sqlite3");

const db = new sqlite3.Database("./database/library.sqlite");

db.run(
  "CREATE TABLE  IF NOT EXISTS Books(id INTEGER PRIMARY KEY,title TEXT NOT NULL, author TEXT NOT NULL,shelf_id INTEGER NOT NULL )"
);

db.run(
  "CREATE TABLE  IF NOT EXISTS Shelves(shelf_id INTEGER PRIMARY KEY,category TEXT NOT NULL, total_books INTEGER NOT NULL)"
);

module.exports = db;
