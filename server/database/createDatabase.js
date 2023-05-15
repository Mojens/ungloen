import db from "./connection.js";
import dotenv from 'dotenv/config';

const isDeleteMode = process.argv.findIndex((argument) => argument === "delete_mode") === -1 ? false : true;

if (isDeleteMode) {
  db.exec(`DROP TABLE IF EXISTS users;`);
  db.exec(`DROP TABLE IF EXISTS forum_posts;`);
  db.exec(`DROP TABLE IF EXISTS forum_comments;`);
  db.exec(`DROP TABLE IF EXISTS posts_likes;`);
  db.exec(`DROP TABLE IF EXISTS comments_likes;`);
  db.exec(`DROP TABLE IF EXISTS users_tax_data;`);
  db.exec(`DROP TABLE IF EXISTS share_dollar_teams;`);
  db.exec(`DROP TABLE IF EXISTS share_dollar_teams_users;`);
  db.exec(`DROP TABLE IF EXISTS share_dollar_teams_money_requests;`);
  db.exec(`DROP TABLE IF EXISTS share_dollar_teams_messages;`);
  db.exec(`DROP TABLE IF EXISTS share_dollar_teams_invites;`);
}

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    verified BOOLEAN NOT NULL DEFAULT 0,
    verification_code TEXT,
    verification_code_expiration TEXT,
    token TEXT,
    token_expiration TEXT
  );
`);

db.exec(` 
  CREATE TABLE IF NOT EXISTS forum_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    is_published BOOLEAN NOT NULL DEFAULT 0,
    content TEXT NOT NULL,
    date TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

db.exec(` 
  CREATE TABLE IF NOT EXISTS forum_comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    post_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    date TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (post_id) REFERENCES forum_posts(id)
  );
`);
db.exec(`
  CREATE TABLE IF NOT EXISTS posts_likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    post_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (post_id) REFERENCES forum_posts(id)
  );
`);
db.exec(`
  CREATE TABLE IF NOT EXISTS comments_likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    comment_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (comment_id) REFERENCES forum_comments(id)
  );
`);
db.exec(`
    CREATE TABLE IF NOT EXISTS users_tax_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL UNIQUE,
      zip_code INTEGER NOT NULL DEFAULT 0,
      tax_rate INTEGER NOT NULL DEFAULT 0,
      monthly_deduction INTEGER NOT NULL DEFAULT 0,
      city TEXT NOT NULL DEFAULT '',
      address TEXT NOT NULL DEFAULT '',
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
`);
db.exec(`
   CREATE TABLE IF NOT EXISTS share_dollar_teams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      team_name TEXT NOT NULL,
      team_creator_id INTEGER NOT NULL,
      FOREIGN KEY (team_creator_id) REFERENCES users(id)
   ); 
`);
db.exec(`
    CREATE TABLE IF NOT EXISTS share_dollar_teams_invites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      team_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      token TEXT,
      token_expiration TEXT,
      accepted BOOLEAN NOT NULL DEFAULT 0,
      FOREIGN KEY (team_id) REFERENCES share_dollar_teams(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
`);
db.exec(`
    CREATE TABLE IF NOT EXISTS share_dollar_teams_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      team_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      FOREIGN KEY (team_id) REFERENCES share_dollar_teams(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
`);
db.exec(`
      CREATE TABLE IF NOT EXISTS share_dollar_teams_money_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        requestor_id INTEGER NOT NULL,
        receiver_id INTEGER NOT NULL,
        amount INTEGER NOT NULL,
        date TEXT NOT NULL,
        paid BOOLEAN NOT NULL DEFAULT 0,
        FOREIGN KEY (requestor_id) REFERENCES share_dollar_teams_users(id),
        FOREIGN KEY (receiver_id) REFERENCES share_dollar_teams_users(id)
      );
`);
db.exec(`
      CREATE TABLE IF NOT EXISTS share_dollar_teams_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        team_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        date TEXT NOT NULL,
        FOREIGN KEY (team_id) REFERENCES share_dollar_teams(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
`);
if (isDeleteMode) {
  db.exec(`INSERT INTO users (first_name, last_name, email, password, phone, verified) VALUES ('John', 'Doe', 'john_doe@emailprovider.com', '$2a$12$hxhnvxSh0THAcHji9Ac2k.9UWma2HzwviezFENVcmsHhWNod3bdmC', '${process.env.TEST_PHONE}', 1);`);
  db.exec(`INSERT INTO users_tax_data (user_id) VALUES (1)`);
}
