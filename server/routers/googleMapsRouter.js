import { Router } from 'express';
import { calculateDistance, autocompletePlaces } from '../util/googleMaps.js';
import db from '../database/connection.js';
import dotenv from 'dotenv/config';

const router = Router();

router.get('/api/googlemaps/autocomplete', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).send({
            message: "Ikke logget ind",
            status: 401
        });
    }
    const input = req.query.input;
    const predictions = await autocompletePlaces(input);
    if (predictions !== null) {
        return res.status(200).send({
            message: 'Forslag fundet',
            predictions,
            status: 200
        });
    } else {
        return res.status(500).send({
            message: 'Kunne ikke hente nogle forslag',
            status: 500
        });
    }
});

router.post('/api/googlemaps/distance', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).send({
            message: "Ikke logget ind",
            status: 401
        });
    }
    const { origin, destination } = req.body;
    console.log(origin, destination)
    const distance = await calculateDistance(origin, destination);
    console.log(distance)
    if (distance !== null) {
        return res.status(200).send({
            message: 'Afstanden fundet',
            distance: distance,
            status: 200
        })
    } else {
        return res.status(500).send({
            message: 'Kunne ikke hente afstanden',
            status: 500
        });
    }
});








export default router;