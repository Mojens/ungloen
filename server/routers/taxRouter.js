import db from '../database/connection.js';
import { Router } from 'express';
import { calculateMonthlyPayout, calculateHolidayPayment, calculateDrivingDeduction } from '../util/taxCalculator.js';
const router = Router();


router.get('/api/private/users/tax/data', async (req, res) => {
  
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

router.post('/api/private/tax/monthly-payout', async (req, res) => {
  
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

router.post('/api/private/tax/holiday-payment', async (req, res) => {
  
    const { monthlyIncome } = req.body;
    const holidayPaymentData = calculateHolidayPayment(Number(monthlyIncome));
    return res.status(200).send({
        message: 'Udregning af feriepenge gennemført',
        holidayPaymentData: holidayPaymentData,
        status: 200,
    });
});

router.post('/api/private/tax/driving-deduction', async (req, res) => {
  
    const { drivingData } = req.body;
    if (drivingData.payForBridge && (!drivingData.isStorebaelt && !drivingData.isOeresund) || drivingData.payForBridge && drivingData.vehicleType === "") {
        return res.status(400).send({
            message: 'Hvis du kører over en betalingsbro, skal du fuldføre formen',
            status: 400
        });
    }
    const drivingDeductionData = calculateDrivingDeduction(drivingData);
    return res.status(200).send({
        message: 'Udregning af feriepenge gennemført',
        drivingDeductionData: drivingDeductionData,
        status: 200,
    });
});

router.put('/api/private/tax/data/users/:id', async (req, res) => {
    if (req.session.user.id !== Number(req.params.id)) {
        return res.status(401).send({
            message: 'Ingen adgang',
            status: 401
        });
    }
    const { zip_code, city, address, tax_rate, monthly_deduction } = req.body;
    if (!zip_code || !city || !address || !tax_rate || !monthly_deduction) {
        return res.status(400).send({
            message: 'Venligst udfyld De felter der mangler',
            status: 400
        });
    }
    await db.run('UPDATE users_tax_data SET zip_code = ?, city = ?, address = ?, tax_rate = ?, monthly_deduction = ? WHERE user_id = ?',
        [zip_code, city, address, tax_rate, monthly_deduction, req.session.user.id]);
    return res.status(200).send({
        message: 'Bruger personoplysninger opdateret',
        status: 200
    });
});

export default router;