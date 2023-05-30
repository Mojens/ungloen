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
  db.exec(`DROP TABLE IF EXISTS share_dollar_teams_money_requests_users;`);
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
  )
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
  )
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
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS posts_likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    post_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (post_id) REFERENCES forum_posts(id)
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS comments_likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    comment_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (comment_id) REFERENCES forum_comments(id)
  )
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
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS share_dollar_teams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    team_name TEXT NOT NULL,
    team_creator_id INTEGER NOT NULL,
    FOREIGN KEY (team_creator_id) REFERENCES users(id)
  )
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
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS share_dollar_teams_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    team_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (team_id) REFERENCES share_dollar_teams(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
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
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS share_dollar_teams_money_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    requestor_id INTEGER NOT NULL,
    team_id INTEGER NOT NULL,
    total_amount INTEGER NOT NULL,
    paid BOOLEAN NOT NULL DEFAULT 0,
    date TEXT NOT NULL,
    FOREIGN KEY (requestor_id) REFERENCES users(id),
    FOREIGN KEY (team_id) REFERENCES share_dollar_teams(id)
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS share_dollar_teams_money_requests_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    receiver_id INTEGER NOT NULL,
    amount INTEGER NOT NULL,
    paid BOOLEAN NOT NULL DEFAULT 0,
    request_id INTEGER NOT NULL,
    FOREIGN KEY (receiver_id) REFERENCES users(id),
    FOREIGN KEY (request_id) REFERENCES share_dollar_teams_money_requests(id)
  )
`);

if (isDeleteMode) {
  db.exec(`INSERT INTO users (first_name, last_name, email, password, phone, verified) VALUES ('John', 'Doe', 'test1@test.test', '$2a$12$hxhnvxSh0THAcHji9Ac2k.9UWma2HzwviezFENVcmsHhWNod3bdmC', '00000001', 1)`);
  db.exec(`INSERT INTO users (first_name, last_name, email, password, phone, verified) VALUES ('Kasper', 'Møller', 'test2@test.test', '$2a$12$TARIjfqyii2vcpg4NKeF6efIW..wYAmvYupcvMwpL3KCDIOz9MIIa', '00000002', 1)`);
  db.exec(`INSERT INTO users (first_name, last_name, email, password, phone, verified) VALUES ('Mette', 'Jensen', 'test3@test.test', '$2a$12$r/58.0/9uaXlEiQVo06sMe7j77t1N26s0z09PEgSv5x2xE2wbFHxi', '00000003', 1)`);
  db.exec(`INSERT INTO users (first_name, last_name, email, password, phone, verified) VALUES ('Abdi', 'Mohammed', 'test4@test.test', '$2a$12$jfyM7xD1xYPWEBCB2jm09eudBNNl6qkzgY9mApQsC8vMOALzme7Qy', '00000004', 1)`);
  db.exec(`INSERT INTO users (first_name, last_name, email, password, phone, verified) VALUES ('Mira', 'Douglas', 'test5@test.test', '$2a$12$b3xnjU3osHoV.RRgz5EzFOD6wstQscla8ahhAS0P87q2M04ok3PoW', '00000005', 1)`);
  db.exec(`INSERT INTO users (first_name, last_name, email, password, phone, verified) VALUES ('David', 'Starman', 'test6@test.test', '$2a$12$ClPYt1JPWE9JH/sr/TRBsO7wH.9OkQuUhcZKWT2q5Q8cwWpiuOd.6', '00000006', 1)`);
  db.exec(`INSERT INTO users (first_name, last_name, email, password, phone, verified) VALUES ('Henrik', 'Nielsen', 'test7@test.test', '$2a$12$92JYw9LFH29ZiGO5u9qVrOO6sAuyXYjDogsE/l14zByBRPe1ExSV6', '00000007', 1)`);
  db.exec(`INSERT INTO users (first_name, last_name, email, password, phone, verified) VALUES ('Louise', 'Niller', 'test8@test.test', '$2a$12$uL/6hKR6ALmk6JAIxQf1ZOXuTgpcOGh67lYspJufPQQKjUMWuWo02', '00000008', 1)`);
  db.exec(`INSERT INTO users (first_name, last_name, email, password, phone, verified) VALUES ('Sofie', 'Kaspersen', 'test9@test.test', '$2a$12$1z0dYo76h58Y1fD08Ypdqe.MQN4iHD7tzNgViI5e4ShgUmuv9fSkW', '00000009', 1)`);
  db.exec(`INSERT INTO users (first_name, last_name, email, password, phone, verified) VALUES ('Luke', 'Skywalker', 'moha135h@stud.kea.dk', '$2a$12$IzJDFRRioSVM1mKTLPZ6R.UNL333c8a.oyqd3moRnR1IDuu1JceAS', '${process.env.TEST_PHONE}', 1)`);
  db.exec(`INSERT INTO users (first_name, last_name, email, password, phone, verified) VALUES ('Mohammad Adel', 'Murtada', 'Mohammadmurtada@outlook.dk', '$2a$12$2xbbc0BJpvtt0YeeT5nmTOh9RGNtNKovoxlEIwSCYWeJnOcu1CvT2', '${process.env.PERSONAL_PHONE}', 1)`);
  db.exec(`INSERT INTO users_tax_data (user_id) VALUES (1)`);
  db.exec(`INSERT INTO users_tax_data (user_id) VALUES (2)`);
  db.exec(`INSERT INTO users_tax_data (user_id) VALUES (3)`);
  db.exec(`INSERT INTO users_tax_data (user_id) VALUES (4)`);
  db.exec(`INSERT INTO users_tax_data (user_id) VALUES (5)`);
  db.exec(`INSERT INTO users_tax_data (user_id) VALUES (6)`);
  db.exec(`INSERT INTO users_tax_data (user_id) VALUES (7)`);
  db.exec(`INSERT INTO users_tax_data (user_id) VALUES (8)`);
  db.exec(`INSERT INTO users_tax_data (user_id) VALUES (9)`);
  db.exec(`INSERT INTO users_tax_data (user_id) VALUES (10)`);
  db.exec(`INSERT INTO users_tax_data (user_id) VALUES (11)`);
}
