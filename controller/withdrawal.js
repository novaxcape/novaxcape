const { Withdrawal, Tourist, Wallet, Vendor, Kyc } = require('../models')
const axios = require('axios')
const otpGenerator = require('otp-generator')


exports.payoutFunds = async (req, res, next) => {
    
    try {
        const vendorId = req.user.id;
        const touristId = req.params.id;
        const { amount } = req.body;

        const vendor = await Vendor.findByPk(vendorId);
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        const tourist = await Tourist.findOne({ where: { id: touristId, vendorId } });


        if (!tourist) {
            return res.status(404).json({ message: "Tourist center not found" });
        }

        const wallet = await Wallet.findOne({ where: { touristId: tourist.id } });
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

        if (Number(wallet.balance) < withdrawalAmount) {
            return res.status(400).json({ message: "Insufficient balance" });
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
                        name: tourist.centreName || `${vendor.centerName}`,
                        email: vendor.email
                    },
                    bank_account: {
                        bank: '033',
                        account: '0000000000'
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

        if (response.data.status === false) {
            return res.status(400).json({
                success: false,
                message: response.data.message || "Payout initiation failed"
            });
        }


        // Save payout record
        const payout = await Withdrawal.create({
            touristId: tourist.id,
            walletId: wallet.id,
            amount: withdrawalAmount,
            reference,
            bankName: 'Access Bank',
            bankCode: '033',
            accountNumber: '0000000000',
            status: "successful"
        });
console.log(payout);
        // Deduct from wallet balance
        wallet.balance = Number(wallet.balance) - withdrawalAmount;
        wallet.withdrawal = Number(wallet.withdrawal) + withdrawalAmount;
        await wallet.save();

        return res.status(200).json({
            success: true,
            message: "Withdrawal initiated successfully",
            payout,
            walletBalance: wallet.balance
        });

    } catch (error) {
        console.log("Payout Error:", error.response?.data || error.message);
       next(error);
    }
};


exports.getTouristWithdrawals = async (req, res, next) => {
    try {
        const vendorId = req.user.id;
        const touristId = req.params.id;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { count, rows: withdrawals } = await Withdrawal.findAndCountAll({
            where: {
                touristId,
                status: "successful"
            },
            order: [["createdAt", "DESC"]],
            limit,
            offset
        });

        return res.status(200).json({
            success: true,
            totalWithdrawals: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            withdrawals
        });

    } catch (error) {
        console.error("Error fetching withdrawals:", error.message);
        next(error);
    }
};
