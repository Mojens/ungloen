import db from '../database/connection.js';
import { Router } from 'express';
const router = Router();


router.get('/api/tax/data', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).send({
            message: "Ikke logget ind",
            status: 401
        });
    }
    const [taxData] = await db.all('SELECT * FROM users_tax_data WHERE user_id = ?', req.session.user.id);
    if (!taxData.deduction_rate || !taxData.monthly_deduction || !taxData.zip_code || !taxData.city || !taxData.address) {
        return res.status(404).send({
            message: 'Ingen personlige oplysninger fundet, <br> opdater dem <a href="/profil/personlig">her</a>',
            status: 404
        });
    }
    return res.status(200).send({
        message: 'Personlige oplysninger fundet',
        taxData: taxData,
        status: 200,
    });
});

export default router;