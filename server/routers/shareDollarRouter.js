import { Router } from 'express';
import db from '../database/connection.js';

const router = Router();

// hente de teams du en del af
router.get('/api/private/sharedollar/teams/', async (req, res) => {
    let userTeams = await db.all('SELECT * FROM share_dollar_teams_users WHERE user_id = ?', req.session.user.id)
    if (userTeams.length < 1) {
        return res.status(404).send({
            message: "Du er ikke en del af nogen teams",
            status: 404
        });
    }
    let teams = []
    for (const userTeam of userTeams) {
        const [team] = await db.all('SELECT * FROM share_dollar_teams WHERE id = ?', userTeam.team_id)
        teams.push(team)
    }
    return res.status(200).send({
        message: "Teams du er en del af hentet",
        teams,
        status: 200
    });
});

// hente de teams du ejer
router.get('/api/private/sharedollar/teams/own', async (req, res) => {
    let teams = await db.all('SELECT * FROM share_dollar_teams WHERE team_creator_id = ?', req.session.user.id)
    if (teams.length < 1) {
        return res.status(404).send({
            message: "Du ejer ingen teams",
            status: 404
        });
    }
    return res.status(200).send({
        message: "Dine Teams hentet",
        teams,
        status: 200
    });
});

// oprette et team
router.post('/api/private/sharedollar/teams', async (req, res) => {
    const { teamName } = req.body;
    if (!teamName) {
        return res.status(400).send({
            message: "Team navn mangler",
            status: 400
        });
    };
    const [teamAlreadyExists] = await db.all('SELECT * FROM share_dollar_teams WHERE LOWER(team_name) = ?', teamName.toLowerCase())
    if (teamAlreadyExists) {
        return res.status(400).send({
            message: "Team navn eksistere allerede",
            status: 400
        });
    }
    const result = await db.run('INSERT INTO share_dollar_teams (team_name, team_creator_id) VALUES (?, ?)', teamName, req.session.user.id)
    await db.run('INSERT INTO share_dollar_teams_users (team_id, user_id) VALUES (?, ?)', result.lastID, req.session.user.id)
    return res.status(200).send({
        message: "Team oprettet",
        status: 200
    });
});

router.post('/sharedollar/teams/join', async (req, res) => {
    return res.status(200).send({
        message: "Du er joinet til et team",
        status: 200
    });
});

router.post('/sharedollar/teams/leave', async (req, res) => {
    return res.status(200).send({
        message: "Du er forladt et team",
        status: 200
    });
});
// delete team
router.delete('/api/private/sharedollar/teams/delete/:id', async (req, res) => {
    const [team] = await db.all('SELECT * FROM share_dollar_teams WHERE id = ?', Number(req.params.id))
    if (!team) {
        return res.status(404).send({
            message: "Team ikke fundet",
            status: 404
        });
    }
    const [isOwnerOfTeam] = await db.all('SELECT * FROM share_dollar_teams WHERE team_creator_id = ? AND id = ?', req.session.user.id, Number(req.params.id))
    if (!isOwnerOfTeam) {
        return res.status(400).send({
            message: "Du er ikke ejer af teamet",
            status: 400
        });
    }
    await db.run('DELETE FROM share_dollar_teams WHERE id = ?', Number(req.params.id))
    const teamUsers = await db.all('SELECT * FROM share_dollar_teams_users WHERE team_id = ?', Number(req.params.id))
    console.log(teamUsers)
    for (const teamUser of teamUsers) {
        await db.run('DELETE FROM share_dollar_teams_users WHERE id = ?', teamUser.id)
    }
    return res.status(200).send({
        message: "Team slettet",
        status: 200
    });
});
// MANGLER (Inviter medlemmer til team)
router.post('/sharedollar/teams/invite', async (req, res) => {
    const { email, team_id } = req.body;
    if (!email || !team_id) {
        return res.status(400).send({
            message: "Email mangler",
            status: 400
        });
    };
    const [isOwnerOfTeam] = await db.all('SELECT * FROM share_dollar_teams WHERE team_creator_id = ? AND id = ?', req.session.user.id, Number(team_id))
    if (!isOwnerOfTeam) {
        return res.status(400).send({
            message: "Du er ikke ejer af teamet",
            status: 400
        });
    }
    const [userToInvite] = await db.all('SELECT * FROM users WHERE LOWER(email) = ? AND verified = 1', email.toLowerCase())
    if (!userToInvite) {
        return res.status(404).send({
            message: "Bruger ikke fundet",
            status: 404
        });
    }
    const [userAlreadyInTeam] = await db.all('SELECT * FROM share_dollar_teams_users WHERE user_id = ? AND team_id = ?', userToInvite.id, Number(team_id))
    if (userAlreadyInTeam) {
        return res.status(400).send({
            message: "Bruger er allerede en del af teamet",
            status: 400
        });
    }
    await db.run('INSERT INTO share_dollar_teams_invites (team_id, user_id) VALUES (?, ?)', Number(team_id), userToInvite.id);
    return res.status(200).send({
        message: "Invitation sendt",
        status: 200
    });
});

//Update team name
router.patch('/api/private/sharedollar/teams/:id', async (req, res) => {
    const { teamName } = req.body;
    if (!teamName) {
        return res.status(400).send({
            message: "Team navn mangler",
            status: 400
        });
    };
    const [teamAlreadyExists] = await db.all('SELECT * FROM share_dollar_teams WHERE LOWER(team_name) = ?', teamName.toLowerCase())
    if (teamAlreadyExists) {
        return res.status(400).send({
            message: "Team navn eksistere allerede",
            status: 400
        });
    }
    await db.run('UPDATE share_dollar_teams SET team_name = ? WHERE id = ?', teamName, Number(req.params.id))
    return res.status(200).send({
        message: "Team Navn opdateret",
        status: 200
    });
});

// henter en team
router.get('/api/private/sharedollar/teams/:id', async (req, res) => {
    const [foundTeam] = await db.all('SELECT * FROM share_dollar_teams WHERE id = ?', Number(req.params.id))
    if (!foundTeam) {
        return res.status(404).send({
            message: "Team ikke fundet",
            status: 404
        });
    }
    const [isApartOfTeam] = await db.all('SELECT * FROM share_dollar_teams_users WHERE user_id = ? AND team_id = ?', req.session.user.id, Number(req.params.id))
    if (!isApartOfTeam) {
        return res.status(400).send({
            message: "Du er ikke en del af teamet",
            status: 400
        });
    }
    let isAdmin = false;
    if (foundTeam.team_creator_id === req.session.user.id) {
        isAdmin = true;
    }
    const teamUsers = await db.all('SELECT * FROM share_dollar_teams_users WHERE team_id = ?', Number(req.params.id))
    const [teamCreator] = await db.all('SELECT * FROM users WHERE id = ?', foundTeam.team_creator_id)
    const { password, verified, verification_code, token, token_expiration, phone, verification_code_expiration, ...userWithoutPassword } = teamCreator;
    const teamMembers = []
    for (const teamUser of teamUsers) {
        const [user] = await db.all('SELECT * FROM users WHERE id = ?', teamUser.user_id)
        const { password, verified, verification_code, token, token_expiration, phone, verification_code_expiration, ...userWithoutPassword } = user;
        teamMembers.push(userWithoutPassword)
    }
    const team = {
        id: foundTeam.id,
        teamName: foundTeam.team_name,
        teamCreator: userWithoutPassword,
        teamMembers: teamMembers,
        isAdmin: isAdmin
    }
    const [user] = await db.all('SELECT * FROM users WHERE id = ?', req.session.user.id)
    const name = user.first_name + ' ' + user.last_name;
    return res.status(200).send({
        message: "Team hentet",
        team: team,
        status: 200
    });
});
// get team messages
router.get('/api/private/sharedollar/teams/:id/messages', async (req, res) => {
    const [foundTeam] = await db.all('SELECT * FROM share_dollar_teams WHERE id = ?', Number(req.params.id))
    if (!foundTeam) {
        return res.status(404).send({
            message: "Team ikke fundet",
            status: 404
        });
    }
    const [isApartOfTeam] = await db.all('SELECT * FROM share_dollar_teams_users WHERE user_id = ? AND team_id = ?', req.session.user.id, Number(req.params.id))
    if (!isApartOfTeam) {
        return res.status(400).send({
            message: "Du er ikke en del af teamet",
            status: 400
        });
    }
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const dbDateFormat = thirtyDaysAgo.toISOString().slice(0, 19).replace('T', ' ')
    await db.run('DELETE FROM share_dollar_teams_messages WHERE date <= ?', dbDateFormat);
    const rawMessages = await db.all('SELECT * FROM share_dollar_teams_messages WHERE team_id = ?', Number(req.params.id))
    if (rawMessages.length === 0) {
        return res.status(200).send({
            message: "Ingen beskeder",
            messages: [],
            status: 200
        });
    }
    const messages = []
    for (const rawMessage of rawMessages) {
        const [user] = await db.all('SELECT * FROM users WHERE id = ?', rawMessage.user_id)
        messages.push({
            room: rawMessage.team_id,
            name: user.first_name + ' ' + user.last_name,
            userId: user.id,
            message: rawMessage.content,
            date: rawMessage.date
        });
    }
    return res.status(200).send({
        message: "Beskeder hentet",
        messages: messages,
        status: 200
    });
});
// create message
router.post('/api/private/sharedollar/teams/:id/messages', async (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).send({
            message: "Besked må ikke være tom",
            status: 400
        });
    }
    const [isApartOfTeam] = await db.all('SELECT * FROM share_dollar_teams_users WHERE user_id = ? AND team_id = ?', req.session.user.id, Number(req.params.id))
    if (!isApartOfTeam) {
        return res.status(400).send({
            message: "Du er ikke en del af teamet",
            status: 400
        });
    }
    await db.run('INSERT INTO share_dollar_teams_messages (team_id, user_id, content, date) VALUES (?, ?, ?, ?)', Number(req.params.id), req.session.user.id, message, new Date().toISOString().slice(0, 19).replace('T', ' '))
    const sentMessage = {
        team_id: Number(req.params.id),
        user_id: req.session.user.id,
        content: message,
        date: new Date().toISOString().slice(0, 19).replace('T', ' ')
    }
    return res.status(200).send({
        message: "Besked Sendt",
        sentMessage: sentMessage,
        status: 200
    });
});

export default router; 