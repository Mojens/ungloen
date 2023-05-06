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
}

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
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
    is_published BOOLEAN NOT NULL DEFAULT false,
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
      deduction_rate INTEGER NOT NULL DEFAULT 0,
      monthly_deduction INTEGER NOT NULL DEFAULT 0,
      city TEXT NOT NULL DEFAULT '',
      address TEXT NOT NULL DEFAULT '',
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
`);

if (isDeleteMode) {
  db.exec(`INSERT INTO users (first_name, last_name, email, password, phone) VALUES ('John', 'Doe', 'john_doe@emailprovider.com', '$2a$12$hxhnvxSh0THAcHji9Ac2k.9UWma2HzwviezFENVcmsHhWNod3bdmC', '${process.env.TEST_PHONE}');`);
  db.exec(`INSERT INTO users (first_name, last_name, email, password, phone) VALUES ('Mohammad Adel', 'Murtada', '${process.env.PERSON_MAIL}', '$2a$12$ON71wiIzaBEJfxiN9s1UPuJ5.ThiQtr84XwSGaLDyefmyi7ZRIx0y', '${process.env.PERSONAL_PHONE}');`)
  db.exec(`INSERT INTO forum_posts (user_id, title, subject, is_published, content, date) 
  VALUES (1, 'Min årsopgørelse', 'Årsopgørelse', true, 'Jeg har gennemgået min årsopgørelse grundigt og har konstateret, at alt er korrekt. Jeg har betalt korrekt skat og har ikke nogen restskat eller tilbagebetaling til gode. Det er en god idé at tage sig tid til at gennemgå sin årsopgørelse hvert år for at undgå eventuelle fejl eller mangler.', '2023-05-06 14:30:00');`);
  db.exec(`
INSERT INTO forum_posts (user_id, title, subject, is_published, content, date) 
VALUES (1, 'Hvordan SKAT påvirker din løn', 'Skat', true, 'Skat er en afgift, som bliver trukket fra din løn, før du modtager den. Det er en måde, hvorpå staten sikrer sig, at der bliver betalt skat løbende,
så man undgår at ende med en stor skatteregning i slutningen af året. Det kan dog være svært at forstå, hvordan Skat fungerer, og hvor meget man skal betale. 
Generelt set afhænger Skatten af din løn og dine fradrag. Jo højere din løn er, desto mere skal du betale i Skat. Men hvis du har mange fradrag, som eksempelvis kørselsfradrag, kan du mindske din Skat og dermed øge din udbetaling hver måned.
Det kan være en god idé at tage kontakt til SKAT eller en skatterådgiver, hvis du er i tvivl om, hvordan Skatten påvirker din løn. De kan hjælpe dig med at beregne, hvor meget du skal betale, og give dig råd til, hvordan du kan mindske din Skat. 
Det er vigtigt at huske på, at Skatten har stor betydning for din månedlige udbetaling, så det kan betale sig at sætte sig grundigt ind i det og sikre sig, at man betaler det korrekte beløb.', '2023-05-06 15:00:00');
`);
  db.exec(`
INSERT INTO forum_posts (user_id, title, subject, is_published, content, date) 
VALUES (2, 'Hvad påvirker din løn?', 'Løn', true, 'Din løn kan påvirkes af en række faktorer, herunder din uddannelse, din erfaring, og det marked, du arbejder i. Derudover kan din løn også afhænge af den type job, du har, og den arbejdsgiver, du arbejder for. 
Hvis du ønsker at forhandle din løn eller finde ud af, hvad du kan forvente at tjene i dit felt, kan du undersøge, hvad der er en typisk løn for din stilling. Du kan også tale med dine kolleger eller en professionel organisation inden for dit felt for at få råd og vejledning.
Det er også vigtigt at huske på, at din løn kan påvirkes af faktorer som arbejdstid, arbejdsbyrde og arbejdsvilkår. Det kan være en god idé at tale med din arbejdsgiver om dine forventninger og ønsker for dit job, herunder din løn. 
Det er vigtigt at huske på, at din løn har stor betydning for din økonomi og din livsstil, så det kan betale sig at tage sig tid til at undersøge og forhandle din løn for at sikre dig, at du bliver retfærdigt betalt.', '2023-05-06 15:30:00');
`);
  db.exec(`INSERT INTO forum_comments (user_id, post_id, content, date) 
  VALUES (1, 3, 'Jeg er helt enig i, at det er vigtigt at forhandle sin løn og sikre sig, at man bliver betalt retfærdigt. Jeg har selv haft succes med at undersøge lønstatistikker for mit felt og bruge det som en forhandlingschip i samtaler med min arbejdsgiver. Tak for dette gode indlæg om løn!', '2023-05-06 15:45:00');
  `);
  db.exec(`INSERT INTO forum_comments (user_id, post_id, content, date) 
  VALUES (2, 1, 'Tak for dette gode indlæg om årsopgørelse! Jeg har selv haft problemer med min årsopgørelse i fortiden, så det er virkelig vigtigt at gennemgå den grundigt og sikre sig, at alt er korrekt. Det kan også være en god idé at undersøge, om man kan udnytte nogle af de skattefrie beløb eller fradrag, som er til rådighed. Tak fordi du delte disse nyttige oplysninger!', '2023-05-06 16:00:00');  
  `); db.exec(`INSERT INTO forum_comments (user_id, post_id, content, date) 
  VALUES (2, 2, 'Jeg har altid haft svært ved at forstå SKATs regler og procedurer, så dette indlæg var virkelig nyttigt for mig. Jeg er enig i, at det kan være en god idé at tage kontakt til SKAT eller en skatterådgiver, hvis man er i tvivl om noget. Jeg har selv haft stor gavn af at søge hjælp fra en skatterådgiver, når jeg skulle indberette min moms. Tak for dette informative indlæg om SKAT!', '2023-05-06 16:15:00');    
  `);
  db.exec(`INSERT INTO users_tax_data (user_id, zip_code, deduction_rate, monthly_deduction, city, address) VALUES (1, 2300, 49, 4500, 'København N', 'Guldbergsgade 29N');`);
  db.exec(`INSERT INTO users_tax_data (user_id, zip_code, deduction_rate, monthly_deduction, city, address) VALUES (2, 4000, 35, 6500, 'Roskilde', 'Rønnebærparken 56');`);
}
