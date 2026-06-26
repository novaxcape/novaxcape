const { Withdrawal, Tourist, Wallet, Vendor } = require('../models')
const axios = require('axios')
const otpGenerator = require('otp-generator')


exports.payoutFunds = async (req, res) => {
    console.log("PAYOUT CONTROLLER HIT");
    try {
        const vendorId = req.user.id; // Assuming req.user is set after authentication
        const touristId = req.params.id; // Changed to access tourist ID correctly
        const { amount } = req.body;

        const vendor = await Vendor.findByPk(vendorId);
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        // Fetch the KYC data for the vendor
        const kycData = await KYC.findOne({ where: { touristId: tourist.dataValues.id } });
        if (!kycData.bankName || !kycData.accountNumber || !kycData.bankCode) {
            return res.status(400).json({
                message: "KYC bank details are incomplete. Please update your KYC in Settings."
            });
        }

        const wallet = await Wallet.findOne({ where: { touristId: tourist.dataValues.id } });
        if (!wallet) {
            return res.status(404).json({ message: "Wallet not found" });
        }

        const withdrawalAmount = Number(amount);
        if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
            return res.status(400).json({ message: "Invalid withdrawal amount" });
        }

        if (withdrawalAmount < 100) {
            return res.status(400).json({ message: "Minimum withdrawal amount is ₦100" });
        }

        if (wallet.availableBalance < withdrawalAmount) {
            return res.status(400).json({ message: "Insufficient available balance" });
        }

        if (!/^\d{10}$/.test(kycData.accountNumber)) {
            return res.status(400).json({ message: "Invalid account number" });
        }

        const ref = otpGenerator.generate(12, { specialChars: false, upperCaseAlphabets: false, lowerCaseAlphabets: false });
        const reference = `NOV-PAYOUT-${ref}`;

        const response = await axios.post(
            "https://api.korapay.com/merchant/api/v1/transactions/disburse",
            {
                reference,
                destination: {
                    type: "bank_account",
                    amount: withdrawalAmount,
                    currency: "NGN",
                narration: "NOVAXCAPE Vendor Withdrawal",
                    customer: {
                        name: tourist.dataValues.centreName || `${vendor.firstName} ${vendor.lastName}`,
                        email: tourist.dataValues.email
                    },
                    bank_account: {
                        bank: kycData.bankCode,
                        account: kycData.accountNumber
                    }
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.KORA_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("PAYOUT RESPONSE:", response.data);

        // Verify Kora accepted the payout
        if (response.data.status === false) {
            return res.status(400).json({
                success: false,
                message: response.data.message || "Payout initiation failed"
            });
        }

        // Save payout record
        const payout = await Withdrawal.create({
            walletId: wallet.id,
            vendorId,
            amount: withdrawalAmount,
            reference,
            bankName: kycData.bankName,
            bankCode: kycData.bankCode,
            accountNumber: kycData.accountNumber,
            status: "processing",
            providerReference: response.data?.data?.reference
        });

        // Reserve the funds immediately
        wallet.availableBalance -= withdrawalAmount;
        wallet.pendingWithdrawals = (wallet.pendingWithdrawals || 0) + withdrawalAmount;
        wallet.totalTransactions = (wallet.totalTransactions || 0) + 1;

        await wallet.save();

        return res.status(200).json({
            success: true,
            message: "Withdrawal initiated successfully",
            payout,
            walletBalance: wallet.availableBalance
        });

    } catch (error) {
        console.log("Payout Error:", error.response?.data || error.message);
        return res.status(500).json({
            success: false,
            message: error.response?.data?.message || error.message
        });
    }
};
