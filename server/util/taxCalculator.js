export function calculateMonthlyPayout(taxData) {
    const monthlyPayout = {};
    monthlyPayout.monthlyIncome = taxData.monthlyIncome;
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