# Ungløn

Ungløn er et projekt lavet i forbindelse med min eksame i fullstack med nodeJS

Følg guiden forneden til at komme i gang.

## Installere

1. Klon projetet til din lokale computer

```bash
git clone https://github.com/Mojens/ungloen.git
```
2. Gå ind i projektet

```bash
cd ungloen
```

3. Gå ind i server

```bash
cd server
```
4. Installere nødvendige packages

```bash
npm i
```
5. Åben projektet i din IDE og følg næste trin


## Opsætning af .env-fil og miljøvariabler

Efter at have installeret de nødvendige pakker, skal du oprette en .env-fil i servermappen for at konfigurere miljøvariablerne. 

1. Opret en ny fil med navnet ".env" i servermappen

2. Åbn .env-filen og tilføj disse miljøvariabler:
   
PORT=8080
MAIL_USER=<DinEmail>
MAIL_PASS=<DinEmailAdgangskode>
SESSION_SECRET=<Din_Session_Nøgle>
CORS_SECRET=<Din_CORS_Nøgle>

3. Udfyld variablerne med dine egne værdier:

- `MAIL_USER`: Emailadressen, der skal bruges til at sende emails med NodeMailer.
- `MAIL_PASS`: Adgangskoden til den emailkonto, du bruger til NodeMailer.
- `SESSION_SECRET`: En hemmelig nøgle, der bruges til at signere session cookies. <b>Denne kan være en tilfældig streng</b>.
- `CORS_SECRET`: En hemmelig nøgle, der bruges til at tillade CORS-anmodninger fra bestemte domæner. <b>Denne kan være en tilfældig streng</b>.

4. Gem .env-filen, og fortsæt med at køre programmet ved at følge trin 5 nedenfor.

### Kør programmet

5. Kør programmet

```bash
npm run dev
```
