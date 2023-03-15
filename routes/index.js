const express = require("express");
const router = express.Router();
const db = require("../mysql.config");
const Model = [
  "id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY",
  "title TEXT NOT NULL",
  "category TEXT NOT NULL",
  "body LONGTEXT NULL",
  "user INT NOT NULL",
  "tags JSON NULL",
  "likes INT(6) DEFAULT 0",
  "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
  "updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
];
//** Create table
db.query("SHOW TABLES LIKE 'posts'", (error, results, fields) => {
  if (error) return console.log(error);
  if (!!results.length) return;
  const $sql = `CREATE TABLE posts (${Model.join(",")})`;
  db.query($sql, (err, results, fields) => {
    if (err) return console.log(err);
  });
});

// ** Select All Posts
router.get("", async (req, res) => {
  const skip = parseInt(req.query.skip || "0");
  const limit = parseInt(req.query.limit || "12");
  const sort = req.query.sort || "id";
  try {
    db.query(`SELECT COUNT(id) AS total FROM posts`, (err, results, fields) => {
      if (err) throw err;
      const total = results[0].total;
      db.query(
        `SELECT * FROM posts  ORDER BY ${sort}  LIMIT ${skip}, ${limit}`,
        (err, items, fields) => {
          if (err) throw err;
          res.json({ items, limit, skip, total });
        }
      );
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// ** Select Single Post
router.get("/:id", async (req, res) => {
  try {
    const $sql = `SELECT * FROM posts WHERE id = ${req.params.id} LIMIT 1`;
    db.query($sql, (err, item, fields) => {
      if (err) throw err;
      res.json(item[0] || null);
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Create single post
router.post("", async (req, res) => {
  try {
    const keys = Object.keys(req.body);
    const values = Object.values(req.body).map((el) => JSON.stringify(el));
    const $sql = `INSERT INTO posts (${keys}) VALUES (${values})`;
    db.query($sql, (err, results, fields) => {
      if (err) return console.log(err);
      res.json(results.insertId);
    });
  } catch (error) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Add multiple posts
router.post("/many", async (req, res) => {
  try {
    const $sql = req.body.map((body) => {
      const keys = Object.keys(body);
      const values = Object.values(body).map((el) => JSON.stringify(el));
      return `INSERT INTO posts (${keys}) VALUES (${values})`;
    });
    db.query($sql.join(";"), (err, results, fields) => {
      if (err) return console.log(err);
      res.json(`${$sql.length} posts added!`);
    });
  } catch (error) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Update Post
router.patch("/:id", async (req, res) => {
  try {
    const query = Object.entries(req.body)
      .map(([key, val]) => {
        return `${key}=${JSON.stringify(val)}`;
      })
      .join(";");
    const $sql = `UPDATE posts SET ${query} WHERE id=${req.params.id}`;
    db.query($sql, (err, results, fields) => {
      if (err) return console.log(err);
      console.log(results.affectedRows, "posts updated");
      res.json("Post updated!");
    });
  } catch (error) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Delete Post
router.delete("/:id", async (req, res) => {
  try {
    const $sql = `DELETE FROM posts WHERE id=${req.params.id}`;
    db.query($sql, (err, results, fields) => {
      if (err) return console.log(err);
      console.log(results.affectedRows, "posts deleted");
      res.json(`Post deleted!`);
    });
  } catch (error) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;
