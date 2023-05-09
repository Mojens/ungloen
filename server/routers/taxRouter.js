import db from '../database/connection.js';
import { Router } from 'express';
import { calculateMonthlyPayout, calculateHolidayPayment } from '../util/taxCalculator.js';
const router = Router();


router.get('/api/tax/data', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).send({
            message: "Ikke logget ind",
            status: 401
        });
    }
    const [taxData] = await db.all('SELECT * FROM users_tax_data WHERE user_id = ?', [req.session.user.id]);
    if (!taxData.tax_rate || !taxData.monthly_deduction || !taxData.zip_code || !taxData.city || !taxData.address) {
        return res.status(404).send({
            message: 'Ingen personlige oplysninger fundet',
            status: 404
        });
    }
    return res.status(200).send({
        message: 'Personlige oplysninger fundet',
        taxData: taxData,
        status: 200,
    });
});

router.post('/api/tax/monthly-payout', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).send({
            message: "Ikke logget ind",
            status: 401
        });
    }
    const taxData = req.body;
    if (taxData.incomeType === "Løn" && taxData.payoutTime === "") {
        return res.status(400).send({
            message: 'Vælg venligst din lønperiode',
            status: 400
        });
    }
    const monthlyPayoutData = calculateMonthlyPayout(taxData);
    return res.status(200).send({
        message: 'Udregning af månedlig udbetaling gennemført',
        monthlyPayoutData: monthlyPayoutData,
        status: 200,
    });
});

router.post('/api/tax/holiday-payment', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).send({
            message: "Ikke logget ind",
            status: 401
        });
    }
    const { monthlyIncome } = req.body;
    const holidayPaymentData = calculateHolidayPayment(Number(monthlyIncome));
    return res.status(200).send({
        message: 'Udregning af feriepenge gennemført',
        holidayPaymentData: holidayPaymentData,
        status: 200,
    });
});

export default router;