const express = require("express");
const db = require("../config");
const router = express.Router();

router.get("/shelves", (req, res) => {
  db.all(`SELECT * FROM Shelves `, (err, rows) => {
    err ? res.status(500).send(err) : res.status(200).send(rows);
  });
});

router.get("/shelves/:shelf_id", (req, res) => {
  db.all(
    `SELECT * FROM Shelves WHERE shelf_id = ? `,
    req.params.shelf_id,
    (err, rows) => {
      err ? res.status(500).send(err) : res.status(200).send(rows);
    }
  );
});

router.post("/shelves", async (req, res) => {
  let maxId = 1;
  let shelf = req.body;

  await db.all(
    "SELECT * FROM Shelves WHERE category = ?",
    shelf.category,
    (err, row) => {
      if (err) {
        res.status(500).send({ message: err.message, status: false });
      } else {
        if (row.length > 0) {
          res
            .status(200)
            .send({ message: "ชื่อประเภทหนังสือซ้ำ!", status: false });
        } else {
          const addShelves = async () => {
            maxId = await new Promise((resolve, reject) => {
              db.all(
                "SELECT MAX(shelf_id) AS max_id FROM Shelves",
                (err, row) => {
                  !err && resolve(++row[0].max_id);
                }
              );
            });

            db.run(
              "INSERT INTO Shelves (shelf_id,category,total_books) VALUES (?,?,?)",
              maxId,
              shelf.category,
              shelf.total_books,
              (err) => {
                err
                  ? res.status(500).send(err)
                  : res.status(200).send({
                      message: "เพิ่มประเภทหนังสือสำเร็จ!",
                      status: true,
                    });
              }
            );
          };

          addShelves();
        }
      }
    }
  );
});

router.put("/shelves/:shelf_id", async (req, res) => {
  let shelf = req.body;

  db.run(
    "UPDATE Shelves SET category = ? , total_books = ? WHERE shelf_id = ?",
    shelf.category,
    shelf.total_books,
    req.params.shelf_id,
    (err) => {
      err
        ? res.status(500).send({ message: err.message, status: false })
        : res.status(200).send({
            message: "แก้ไขประเภทหนังสือสำเร็จ!",
            status: true,
          });
    }
  );
});

router.delete("/shelves/:shelf_id", async (req, res) => {
  db.all(
    `SELECT * FROM Books WHERE shelf_id = ? `,
    req.params.shelf_id,
    (err, row) => {
      if (err) {
        res.status(500).send({ message: err.message, status: false });
      } else {
        if (row.length > 0) {
          res
            .status(200)
            .send({ message: "มีหนังสือในชั้นวาง", status: false });
        } else {
          db.run(
            "DELETE  FROM Shelves  WHERE shelf_id = ?",
            req.params.shelf_id,
            (err) => {
              err
                ? res.status(500).send({ message: err.message, status: false })
                : res.status(200).send({
                    message: "ลบประเภทหนังสือสำเร็จ!",
                    status: true,
                  });
            }
          );
        }
      }
    }
  );
});

module.exports = router;
