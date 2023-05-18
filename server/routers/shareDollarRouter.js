import { Router } from 'express';
import { sendInvitationForTeam } from '../util/mailSender.js';
import db from '../database/connection.js';
import crypto from 'crypto';

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
// Acceptere invitation til et team
router.post('/api/private/sharedollar/teams/join', async (req, res) => {
    const { teamId, token, email, userId } = req.body;
    if (!teamId || !token || !email) {
        return res.status(400).send({
            message: "Team id, token eller email mangler",
            status: 400
        });
    };
    const [team] = await db.all('SELECT * FROM share_dollar_teams WHERE id = ?', Number(teamId))
    if (!team) {
        return res.status(404).send({
            message: "Team ikke fundet",
            status: 404
        });
    }
    const [isAlreadyInTeam] = await db.all('SELECT * FROM share_dollar_teams_users WHERE team_id = ? AND user_id = ?', Number(teamId), userId)
    if (isAlreadyInTeam) {
        return res.status(400).send({
            message: "Du er allerede en del af dette team",
            status: 400
        });
    }
    const [invitation] = await db.all('SELECT * FROM share_dollar_teams_invites WHERE team_id = ? AND user_id = ?', Number(teamId), userId)
    if (!invitation) {
        return res.status(400).send({
            message: "Du har ikke modtaget en invitation fra dette team",
            status: 400
        });
    }
    if (token !== invitation.token) {
        return res.status(400).send({
            message: "Token matcher ikke",
            status: 400
        });
    }
    await db.run('DELETE FROM share_dollar_teams_invites WHERE team_id = ? AND user_id = ?', Number(teamId), userId)
    await db.run('INSERT INTO share_dollar_teams_users (team_id, user_id) VALUES (?, ?)', Number(teamId), userId)
    return res.status(200).send({
        message: "Du er nu medlem af dette team",
        status: 200
    });
});
// Leave team
router.delete('/api/private/sharedollar/teams/leave/:id', async (req, res) => {
    const [team] = await db.all('SELECT * FROM share_dollar_teams WHERE id = ?', Number(req.params.id))
    if (!team) {
        return res.status(404).send({
            message: "Team ikke fundet",
            status: 404
        });
    }
    const [isAlreadyInTeam] = await db.all('SELECT * FROM share_dollar_teams_users WHERE team_id = ? AND user_id = ?', Number(req.params.id), req.session.user.id)
    if (!isAlreadyInTeam) {
        return res.status(400).send({
            message: "Du er ikke en del af dette team",
            status: 400
        });
    }
    await db.run('DELETE FROM share_dollar_teams_users WHERE team_id = ? AND user_id = ?', Number(req.params.id), req.session.user.id)
    return res.status(200).send({
        message: "Du har forladt " + team.team_name,
        status: 200
    });
});
// deny invitation til et team
router.delete('/api/private/sharedollar/teams/invite/:id', async (req, res) => {
    const [invitation] = await db.all('SELECT * FROM share_dollar_teams_invites WHERE id = ?', Number(req.params.id))
    if (!invitation) {
        return res.status(404).send({
            message: "Invitation ikke fundet",
            status: 404
        });
    }
    await db.run('DELETE FROM share_dollar_teams_invites WHERE id = ?', Number(req.params.id))
    return res.status(200).send({
        message: "Invitation slettet",
        status: 200
    });
})
// hente alle invitationer til teams (MANGLER)
router.get('/api/private/sharedollar/teams/invite', async (req, res) => {
    let invitationsFromDb = await db.all('SELECT * FROM share_dollar_teams_invites WHERE user_id = ?', req.session.user.id)
    if (invitationsFromDb.length < 1) {
        return res.status(404).send({
            message: "Du har ingen invitationer",
            status: 404
        });
    }
    const invitations = []
    for (const invitation of invitationsFromDb) {
        const [team] = await db.all('SELECT * FROM share_dollar_teams WHERE id = ?', invitation.team_id)
        const [user] = await db.all('SELECT * FROM users WHERE id = ?', invitation.user_id)
        const { password, verified, verification_code, token, token_expiration, phone, verification_code_expiration, ...userWithoutPassword } = user;
        invitations.push({
            id: invitation.id,
            invitedFrom: team,
            inviteTo: userWithoutPassword,
            token: invitation.token
        })
    };
    return res.status(200).send({
        message: "Dine invitationer hentet",
        invitations,
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
    for (const teamUser of teamUsers) {
        await db.run('DELETE FROM share_dollar_teams_users WHERE id = ?', teamUser.id)
    }
    return res.status(200).send({
        message: "Team slettet",
        status: 200
    });
});
// Inviter medlemmer til team
router.post('/api/private/sharedollar/teams/invite', async (req, res) => {
    const { email, team_id } = req.body;
    if (!email || !team_id) {
        return res.status(400).send({
            message: "Email mangler",
            status: 400
        });
    };
    const [isOwnerOfTeam] = await db.all('SELECT * FROM share_dollar_teams WHERE team_creator_id = ? AND id = ?', 1, Number(team_id))
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
    const [userAlreadyInvited] = await db.all('SELECT * FROM share_dollar_teams_invites WHERE user_id = ? AND team_id = ?', userToInvite.id, Number(team_id))
    if (userAlreadyInvited) {
        if (userAlreadyInvited.token_expiration > Date.now()) {
            return res.status(400).send({
                message: "Bruger er allerede inviteret til teamet",
                status: 400
            });
        } else {
            await db.run('DELETE FROM share_dollar_teams_invites WHERE user_id = ? AND team_id = ?', userToInvite.id, Number(team_id))
        }
    }
    const { password, verified, verification_code, token, token_expiration, phone, verification_code_expiration, ...userWithoutPassword } = userToInvite;
    const newToken = crypto.randomBytes(10).toString('hex');
    const tokenExpiration = Date.now() + 7 * (24 * 60 * 60 * 1000);
    await db.run('INSERT INTO share_dollar_teams_invites (team_id, user_id, token, token_expiration) VALUES (?, ?, ?, ?)', Number(team_id), userToInvite.id, newToken, tokenExpiration);
    const name = req.session.user.first_name + " " + req.session.user.last_name;
    const obj = {
        invitedFrom: isOwnerOfTeam,
        inviteTo: userWithoutPassword,
        token: newToken
    }
    return sendInvitationForTeam(userToInvite.email, res, token, isOwnerOfTeam.team_name, name, Number(team_id), obj);
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
// remove team member
router.delete('/api/private/sharedollar/teams/:id/members/:memberId', async (req, res) => {
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
            message: "Denne bruger er ikke en del af teamet",
            status: 400
        });
    }
    let isAdmin = false;
    if (foundTeam.team_creator_id === req.session.user.id) {
        isAdmin = true;
    }
    if (!isAdmin) {
        return res.status(400).send({
            message: "Du er ikke admin af dette team",
            status: 400
        });
    }
    const [isApartOfTeamMember] = await db.all('SELECT * FROM share_dollar_teams_users WHERE user_id = ? AND team_id = ?', Number(req.params.memberId), Number(req.params.id))
    if (!isApartOfTeamMember) {
        return res.status(400).send({
            message: "Denne bruger er ikke en del af teamet",
            status: 400
        });
    }
    const [userToRemove] = await db.all('SELECT * FROM users WHERE id = ?', Number(req.params.memberId))
    await db.run('DELETE FROM share_dollar_teams_users WHERE user_id = ? AND team_id = ?', Number(req.params.memberId), Number(req.params.id))
    return res.status(200).send({
        message: `${userToRemove.first_name} ${userToRemove.last_name} er blevet fjernet fra teamet`,
        status: 200
    });
});

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------

// create request for money
router.post('/api/private/sharedollar/teams/:id/requests', async (req, res) => {
    const { requests, totalAmount } = req.body;
    if (!requests || !totalAmount) {
        return res.status(400).send({
            message: "Udfyld venligst alle felter",
            status: 400
        });
    }
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
    for (const request of requests) {
        const [isReceiverApartOfTeam] = await db.all('SELECT * FROM share_dollar_teams_users WHERE user_id = ? AND team_id = ?', Number(request.memberId), Number(req.params.id))
        if (!isReceiverApartOfTeam) {
            return res.status(400).send({
                message: "En eller flere af modtagerne er ikke en del af teamet",
                status: 400
            });
        }
    }
    const dbRequest = await db.run('INSERT INTO share_dollar_teams_money_requests (requestor_id, team_id, total_amount, paid, date) VALUES (?, ?, ?, ?, ?)', req.session.user.id, Number(req.params.id), totalAmount, false, new Date().toISOString().slice(0, 19).replace('T', ' '))
    for (const request of requests) {
        await db.run('INSERT INTO share_dollar_teams_money_requests_users (receiver_id, amount, paid, request_id) VALUES (?, ?, ?, ?)', request.memberId, request.amount, false, dbRequest.lastID)
    }
    return res.status(200).send({
        message: "Anmodning sendt",
        status: 200
    });
});
// get all requests by user id & team id
router.get('/api/private/sharedollar/requests', async (req, res) => {
    let requests = [];
    const teamId = req.query.team_id;
    if (!teamId) {
        requests = await db.all('SELECT * FROM share_dollar_teams_money_requests WHERE requestor_id = ?', req.session.user.id);
    } else {
        requests = await db.all('SELECT * FROM share_dollar_teams_money_requests WHERE requestor_id = ? AND team_id = ?', req.session.user.id, Number(teamId));
    }

    const allRequests = [];

    if (requests.length > 0) {
        for (const request of requests) {
            const requestUsers = await db.all('SELECT * FROM share_dollar_teams_money_requests_users WHERE request_id = ?', request.id);
            const usersPaid = [];

            for (const requestUser of requestUsers) {
                const [user] = await db.all('SELECT * FROM users WHERE id = ?', requestUser.receiver_id);

                if (requestUser.paid) {
                    usersPaid.push({
                        user: `${user.first_name} ${user.last_name}`,
                        amountPaid: requestUser.amount
                    });
                }
            }

            allRequests.push({
                id: request.id,
                totalAmount: request.total_amount,
                date: request.date,
                paid: request.paid,
                usersPaid: usersPaid
            });
        }
    }

    return res.status(200).send({
        message: "Anmodninger hentet",
        requests: allRequests,
        status: 200
    });
});
// get all recieved requests by user id & team id
router.get('/api/private/sharedollar/requests/recieved', async (req, res) => {
    const teamId = req.query.team_id;
    const requests = await db.all('SELECT * FROM share_dollar_teams_money_requests_users WHERE receiver_id = ?', req.session.user.id);
    const allRequests = [];
    if (requests.length > 0) {
        for (const request of requests) {
            if (!teamId) {
                const [requestInfo] = await db.all('SELECT * FROM share_dollar_teams_money_requests WHERE id = ?', request.request_id);
                const [requestor] = await db.all('SELECT * FROM users WHERE id = ?', requestInfo.requestor_id);
                allRequests.push({
                    id: request.id,
                    requestor: `${requestor.first_name} ${requestor.last_name}`,
                    amount: request.amount,
                    paid: request.paid,
                    date: requestInfo.date
                });
            } else {
                const [requestInfo] = await db.all('SELECT * FROM share_dollar_teams_money_requests WHERE id = ? AND team_id = ?', request.request_id, Number(teamId));
                const [requestor] = await db.all('SELECT * FROM users WHERE id = ?', requestInfo.requestor_id);
                allRequests.push({
                    id: request.id,
                    requestor: `${requestor.first_name} ${requestor.last_name}`,
                    amount: request.amount,
                    paid: request.paid,
                    date: requestInfo.date
                });
            }

        }
    }

    return res.status(200).send({
        message: "Anmodninger hentet",
        requests: allRequests,
        status: 200
    });
});
// pay request recieved
router.patch('/api/private/sharedollar/requests/recieved/:id/pay', async (req, res) => {
    const [request] = await db.all('SELECT * FROM share_dollar_teams_money_requests_users WHERE id = ?', Number(req.params.id))
    if (!request) {
        return res.status(404).send({
            message: "Anmodning ikke fundet",
            status: 404
        });
    }
    const [requestInfo] = await db.all('SELECT * FROM share_dollar_teams_money_requests WHERE id = ?', request.request_id)
    const [requestor] = await db.all('SELECT * FROM users WHERE id = ?', requestInfo.requestor_id)
    if (request.paid) {
        return res.status(400).send({
            message: "Denne anmodning er allerede betalt",
            status: 400
        });
    }
    if (request.receiver_id !== req.session.user.id) {
        return res.status(400).send({
            message: "Du er ikke modtager af denne anmodning",
            status: 400
        });
    }
    await db.run('UPDATE share_dollar_teams_money_requests_users SET paid = ? WHERE id = ?', true, Number(req.params.id))
    let isAllPaid = true;
    const requestUsers = await db.all('SELECT * FROM share_dollar_teams_money_requests_users WHERE request_id = ?', request.request_id)
    for (const requestUser of requestUsers) {
        if (!requestUser.paid) {
            isAllPaid = false;
            break;
        }
    }
    if (isAllPaid) {
        await db.run('UPDATE share_dollar_teams_money_requests SET paid = ? WHERE id = ?', true, request.request_id)
    }
    return res.status(200).send({
        message: `Du har betalt ${request.amount} kr. til ${requestor.first_name} ${requestor.last_name}`,
        status: 200
    });
});



export default router; 