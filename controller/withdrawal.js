const { Withdrawal, Tourist, Wallet, Vendor } = require('../models')
const axios = require('axios')
const otpGenerator = require('otp-generator')



exports.payoutFunds = async (req, res) => {
    try {
        const vendorId = req.user.id;
        const { touristId } = req.params;
        const { amount, bankId } = req.body;

        const vendor = await Vendor.findByPk(vendorId);

        if (!vendor) {
            return res.status(404).json({
                message: "Vendor not found"
            });
        }

        const tourist = await Tourist.findOne({
            where: {
                id: touristId,
                vendorId: vendor.id
            }
        });

        if (!tourist) {
            return res.status(404).json({
                message: "Tourist center not found"
            });
        }

        const wallet = await Wallet.findOne({
            where: {
                touristId: tourist.id
            }
        });

        if (!wallet) {
            return res.status(404).json({
                message: "Wallet not found"
            });
        }

        const bank = await Bank.findByPk(bankId);

        if (!bank) {
            return res.status(404).json({
                message: "Bank account not found"
            });
        }

        const amt = Number(amount);

        if (wallet.balance < amt) {
            return res.status(400).json({
                message: "Insufficient funds."
            });
        }

        const ref = otpGenerator.generate(12, {
            specialChars: false,
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false
        });

        const reference = `NOVAXCAPE-${ref}`;

        const { data } = await axios.post(
            "https://api.korapay.com/merchant/api/v1/transactions/disburse",
            {
                reference,
                destination: {
                    type: "bank_account",
                    amount: amt,
                    currency: "NGN",
                    narration: "Wallet Withdrawal",
                    customer: {
                        name: bank.accountName,
                        email: vendor.email
                    },
                    bank_account: {
                        bank: bank.bankCode,
                        account: bank.accountNumber
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

        wallet.balance -= amt;
        await wallet.save();

        const withdrawal = await Withdrawal.create({
            vendorId,
            touristId: tourist.id,
            amount: amt,
            transactionType: "withdraw",
            reference
        });

        return res.status(200).json({
            message: "Payout initiated successfully",
            data: {
                withdrawal,
                response: data
            }
        });

    } catch (error) {
        console.error(error.response?.data || error.message);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};