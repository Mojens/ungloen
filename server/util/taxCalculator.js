export function calculateMonthlyPayout(taxData) {
    const monthlyPayout = {};
    monthlyPayout.payoutTime = taxData.payoutTime;
    monthlyPayout.incomeType = taxData.incomeType;
    monthlyPayout.monthlyIncome = taxData.monthlyIncome;
    monthlyPayout.headOrBiCard = taxData.headOrBiCard;
    monthlyPayout.tax_rate = taxData.tax_rate;
    monthlyPayout.laborContributionRate = 8;
    if (taxData.incomeType === "Løn") {
        const laborContribution = taxData.monthlyIncome * 0.08;
        if (taxData.headOrBiCard === "headCard" && taxData.payoutTime === "monthly") {
            const incomeAfterLaborContributionAndDeduction = taxData.monthlyIncome - laborContribution - taxData.monthly_deduction;
            const taxToPay = incomeAfterLaborContributionAndDeduction * (taxData.tax_rate / 100);
            monthlyPayout.monthly_deduction = taxData.monthly_deduction;
            monthlyPayout.laborContribution = laborContribution;
            monthlyPayout.AIncome = incomeAfterLaborContributionAndDeduction;
            monthlyPayout.taxToPay = taxToPay;
            monthlyPayout.payout = incomeAfterLaborContributionAndDeduction - taxToPay + taxData.monthly_deduction;
            return monthlyPayout;
        } else if (taxData.headOrBiCard === "headCard" && taxData.payoutTime === "every2week") {
            const incomeAfterLaborContributionAndDeduction = taxData.monthlyIncome - laborContribution - (taxData.monthly_deduction * 0.46);
            const taxToPay = incomeAfterLaborContributionAndDeduction * (taxData.tax_rate / 100);
            monthlyPayout.monthly_deduction = taxData.monthly_deduction;
            monthlyPayout.laborContribution = laborContribution;
            monthlyPayout.AIncome = incomeAfterLaborContributionAndDeduction;
            monthlyPayout.taxToPay = taxToPay;
            monthlyPayout.payout = incomeAfterLaborContributionAndDeduction - taxToPay + (taxData.monthly_deduction * 0.46);
            return monthlyPayout;
        } else if (taxData.headOrBiCard === "biCard" && taxData.payoutTime === "monthly") {
            const incomeAfterLaborContributionAndDeduction = taxData.monthlyIncome - laborContribution;
            const taxToPay = incomeAfterLaborContributionAndDeduction * (taxData.tax_rate / 100);
            monthlyPayout.monthly_deduction = 0;
            monthlyPayout.laborContribution = laborContribution;
            monthlyPayout.AIncome = incomeAfterLaborContributionAndDeduction;
            monthlyPayout.taxToPay = taxToPay;
            monthlyPayout.payout = incomeAfterLaborContributionAndDeduction - taxToPay;
            return monthlyPayout;
        } else if (taxData.headOrBiCard === "biCard" && taxData.payoutTime === "every2week") {
            const incomeAfterLaborContributionAndDeduction = taxData.monthlyIncome - laborContribution;
            const taxToPay = incomeAfterLaborContributionAndDeduction * (taxData.tax_rate / 100);
            monthlyPayout.monthly_deduction = 0;
            monthlyPayout.laborContribution = laborContribution;
            monthlyPayout.AIncome = incomeAfterLaborContributionAndDeduction;
            monthlyPayout.taxToPay = taxToPay;
            monthlyPayout.payout = incomeAfterLaborContributionAndDeduction - taxToPay;
            return monthlyPayout;
        }
    } else {
        monthlyPayout.laborContribution = 0;
        if (taxData.headOrBiCard === "headCard") {
            const incomeAfterDeduction = taxData.monthlyIncome - taxData.monthly_deduction;
            const taxToPay = incomeAfterDeduction * (taxData.tax_rate / 100);
            monthlyPayout.monthly_deduction = taxData.monthly_deduction;
            monthlyPayout.AIncome = incomeAfterDeduction;
            monthlyPayout.taxToPay = taxToPay;
            monthlyPayout.payout = incomeAfterDeduction - taxToPay + taxData.monthly_deduction;
            return monthlyPayout;
        } else if (taxData.headOrBiCard === "biCard") {
            const taxToPay = taxData.monthlyIncome * (taxData.tax_rate / 100);
            monthlyPayout.monthly_deduction = 0;
            monthlyPayout.AIncome = taxData.monthlyIncome;
            monthlyPayout.taxToPay = taxToPay;
            monthlyPayout.payout = taxData.monthlyIncome - taxToPay;
            return monthlyPayout;
        }
    }
}
export function calculateHolidayPayment(monthlyIncome) {
    const holidayData = {};
    holidayData.holidayPayment = (monthlyIncome * 0.125) * 12;
    holidayData.vacationDays = 2.08 * 12;
    return holidayData;
}

const bridgeAndTaxData = [
    {
        bridge: "Storebælt",
        vehiclePrices: [
            {
                vehicleType: "Bil",
                price: 110,
            },
            {
                vehicleType: "Motorcykel",
                price: 110,
            },
            {
                vehicleType: "Tog/Offentlig transport",
                price: 15,
            }
        ]
    },
    {
        bridge: "Øresund",
        vehiclePrices: [
            {
                vehicleType: "Bil",
                price: 50,
            },
            {
                vehicleType: "Motorcykel",
                price: 50,
            },
            {
                vehicleType: "Tog/Offentlig transport",
                price: 8,
            }
        ]
    },
    {
        deductionPrDay: 2.16,
    }
];
export function calculateDrivingDeduction(drivingData) {
    const drivingDeductionData = {
        first24kmDeduction: 0,
        distanceWithDeduction: {
            distance: `25 - ${drivingData.distance}`,
            pricePrDay: Number(((drivingData.distance - 24) * bridgeAndTaxData[2].deductionPrDay))
        },
        bridgeData: []
    };
    if (drivingData.payForBridge) {
        if (drivingData.vehicleType === "Bil") {
            if (drivingData.isOeresund && drivingData.isStorebaelt) {
                drivingDeductionData.bridgeData.push({ bridge: "Storebælt" }, { bridge: "Øresund" });

                drivingDeductionData.bridgeData[0].pricePrDay = drivingData.payBothWays ? bridgeAndTaxData[0].vehiclePrices[0].price * 2 : bridgeAndTaxData[0].vehiclePrices[0].price;
                drivingDeductionData.bridgeData[1].pricePrDay = drivingData.payBothWays ? bridgeAndTaxData[1].vehiclePrices[0].price * 2 : bridgeAndTaxData[1].vehiclePrices[0].price;

                drivingDeductionData.deductionTotal = drivingData.workDaysInTransport * (drivingDeductionData.distanceWithDeduction.pricePrDay + drivingDeductionData.bridgeData[0].pricePrDay + drivingDeductionData.bridgeData[1].pricePrDay)
            } else if
                (drivingData.isStorebaelt) {
                drivingDeductionData.bridgeData.push({
                    bridge: "Storebælt",
                })
                drivingDeductionData.bridgeData[0].pricePrDay = drivingData.payBothWays ? bridgeAndTaxData[0].vehiclePrices[0].price * 2 : bridgeAndTaxData[0].vehiclePrices[0].price;

                drivingDeductionData.DeductionTotal = drivingData.workDaysInTransport * (drivingDeductionData.distanceWithDeduction.pricePrDay + drivingDeductionData.bridgeData[0].pricePrDay)
            } else if (drivingData.isOeresund) {
                drivingDeductionData.bridgeData.push({
                    bridge: "Øresund",
                })
                drivingDeductionData.bridgeData[0].pricePrDay = drivingData.payBothWays ? bridgeAndTaxData[1].vehiclePrices[0].price * 2 : bridgeAndTaxData[1].vehiclePrices[0].price;

                drivingDeductionData.deductionTotal = drivingData.workDaysInTransport * (drivingDeductionData.distanceWithDeduction.pricePrDay + drivingDeductionData.bridgeData[0].pricePrDay)
            }
            return drivingDeductionData;
        } else if (drivingData.vehicleType === "Motorcykel") {
            if (drivingData.isOeresund && drivingData.isStorebaelt) {
                drivingDeductionData.bridgeData.push({ bridge: "Storebælt" }, { bridge: "Øresund" });

                drivingDeductionData.bridgeData[0].pricePrDay = drivingData.payBothWays ? bridgeAndTaxData[0].vehiclePrices[1].price * 2 : bridgeAndTaxData[0].vehiclePrices[1].price;
                drivingDeductionData.bridgeData[1].pricePrDay = drivingData.payBothWays ? bridgeAndTaxData[1].vehiclePrices[1].price * 2 : bridgeAndTaxData[1].vehiclePrices[1].price;

                drivingDeductionData.deductionTotal = drivingData.workDaysInTransport * (drivingDeductionData.distanceWithDeduction.pricePrDay + drivingDeductionData.bridgeData[0].pricePrDay + drivingDeductionData.bridgeData[1].pricePrDay)
            } else if
                (drivingData.isStorebaelt) {
                drivingDeductionData.bridgeData.push({
                    bridge: "Storebælt",
                })
                drivingDeductionData.bridgeData[0].pricePrDay = drivingData.payBothWays ? bridgeAndTaxData[0].vehiclePrices[1].price * 2 : bridgeAndTaxData[0].vehiclePrices[1].price;

                drivingDeductionData.deductionTotal = drivingData.workDaysInTransport * (drivingDeductionData.distanceWithDeduction.pricePrDay + drivingDeductionData.bridgeData[0].pricePrDay)
            } else if (drivingData.isOeresund) {
                drivingDeductionData.bridgeData.push({
                    bridge: "Øresund",
                })
                drivingDeductionData.bridgeData[0].pricePrDay = bridgeAndTaxData[1].vehiclePrices[1].price * (drivingData.payBothWays ? 2 : 1);

                drivingDeductionData.deductionTotal = drivingData.workDaysInTransport * (drivingDeductionData.distanceWithDeduction.pricePrDay + drivingDeductionData.bridgeData[0].pricePrDay)
            }
            return drivingDeductionData;
        } else if (drivingData.vehicleType === "Tog/Offentlig transport") {
            if (drivingData.isOeresund && drivingData.isStorebaelt) {
                drivingDeductionData.bridgeData.push({ bridge: "Storebælt" }, { bridge: "Øresund" });

                drivingDeductionData.bridgeData[0].pricePrDay = drivingData.payBothWays ? bridgeAndTaxData[0].vehiclePrices[2].price * 2 : bridgeAndTaxData[0].vehiclePrices[2].price;
                drivingDeductionData.bridgeData[1].pricePrDay = drivingData.payBothWays ? bridgeAndTaxData[1].vehiclePrices[2].price * 2 : bridgeAndTaxData[1].vehiclePrices[2].price;

                drivingDeductionData.deductionTotal = drivingData.workDaysInTransport * (drivingDeductionData.distanceWithDeduction.pricePrDay + drivingDeductionData.bridgeData[0].pricePrDay + drivingDeductionData.bridgeData[1].pricePrDay)
            } else if
                (drivingData.isStorebaelt) {
                drivingDeductionData.bridgeData.push({
                    bridge: "Storebælt",
                })
                drivingDeductionData.bridgeData[0].pricePrDay = drivingData.payBothWays ? bridgeAndTaxData[0].vehiclePrices[2].price * 2 : bridgeAndTaxData[0].vehiclePrices[2].price;

                drivingDeductionData.deductionTotal = drivingData.workDaysInTransport * (drivingDeductionData.distanceWithDeduction.pricePrDay + drivingDeductionData.bridgeData[0].pricePrDay)
            } else if (drivingData.isOeresund) {
                drivingDeductionData.bridgeData.push({
                    bridge: "Øresund",
                })
                drivingDeductionData.bridgeData[0].pricePrDay = drivingData.payBothWays ? bridgeAndTaxData[1].vehiclePrices[2].price * 2 : bridgeAndTaxData[1].vehiclePrices[2].price;
                drivingDeductionData.deductionTotal = drivingData.workDaysInTransport * (drivingDeductionData.distanceWithDeduction.pricePrDay + drivingDeductionData.bridgeData[0].pricePrDay)
            }
            return drivingDeductionData;
        }
    } else {
        drivingDeductionData.deductionTotal = drivingData.workDaysInTransport * drivingDeductionData.distanceWithDeduction.pricePrDay;
        return drivingDeductionData;
    }
}
