const express = require("express");
const db = require("../config");
const router = express.Router();

router.get("/books", (req, res) => {
  db.all(
    `SELECT * FROM Books LEFT JOIN Shelves ON Books.shelf_id = Shelves.shelf_id `,
    (err, rows) => {
      err ? res.status(500).send(err) : res.status(200).send(rows);
    }
  );
});

router.get("/books/:id", (req, res) => {
  db.all(`SELECT * FROM Books WHERE id = ? `, req.params.id, (err, rows) => {
    err ? res.status(500).send(err) : res.status(200).send(rows);
  });
});

router.post("/books", async (req, res) => {
  let maxId = 1;
  let book = req.body;

  maxId = await new Promise((resolve, reject) => {
    db.all("SELECT MAX(id) AS max_id FROM Books", (err, row) => {
      !err && resolve(++row[0].max_id);
    });
  });

  db.run(
    "INSERT INTO Books (id,title,author,shelf_id) VALUES (?,?,?,?)",
    maxId,
    book.title,
    book.author,
    book.shelf_id,
    (err) => {
      if (err) {
        res.status(500).send({ status: false, message: err.message });
      } else {
        db.run(
          "UPDATE Shelves SET total_books = total_books + 1 WHERE shelf_id = ?",
          book.shelf_id,
          (err) => {
            if (err) {
              res.status(500).send({ status: false, message: err.message });
            } else {
              res
                .status(200)
                .send({ message: "เพิ่มหนังสือสำเร็จ!", status: true });
            }
          }
        );
      }
    }
  );
});

router.put("/books/:id/:oldId", async (req, res) => {
  let book = req.body;

  await db.run(
    "UPDATE Shelves SET total_books = total_books - 1 WHERE shelf_id = ?",
    req.params.oldId,
    (err) => {
      if (err) {
        res.status(500).send({ status: false, message: err.message });
      } else {
        db.run(
          "UPDATE Shelves SET total_books = total_books + 1 WHERE shelf_id = ?",
          book.shelf_id,
          (err) => {
            if (err) {
              res.status(500).send({ status: false, message: err.message });
            } else {
              db.run(
                "UPDATE Books SET title = ? , author = ? , shelf_id = ? WHERE id = ?",
                book.title,
                book.author,
                book.shelf_id,
                req.params.id,
                (err) => {
                  err
                    ? res
                        .status(500)
                        .send({ status: false, message: err.message })
                    : res
                        .status(200)
                        .send({ message: "แก้ไขข้อมูลสำเร็จ", status: true });
                }
              );
            }
          }
        );
      }
    }
  );
});

router.delete("/books/:id", async (req, res) => {
  db.run("DELETE  FROM Books  WHERE id = ?", req.params.id, (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      db.run(
        "UPDATE Shelves SET total_books = total_books - 1 WHERE shelf_id = ?",
        req.query.shelf_id,
        (err) => {
          if (err) {
            res.status(500).send({
              message: err.message,
              status: false,
            });
          } else {
            res.status(200).send({ message: "ลบหนังสือสำเร็จ!", status: true });
          }
        }
      );
    }
  });
});

module.exports = router;
