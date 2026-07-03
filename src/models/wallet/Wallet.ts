import mongoose from "mongoose";

const walletTransactionSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["Credit", "Debit"],
            required: true,
        },

        amount: {
            type: Number,
            required: true,
        },


        purpose: {
            type: String,
            enum: [
                "Order Cancelled",
                "Return Refund",
                "Wallet Purchase",
                "Order Payment", 
                "Wallet Topup",
                "Admin Refund",
                
            ],
            required: true,
        },
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
        },

        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        _id: false,
    }
);

const walletSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        balance: {
            type: Number,
            default: 0,
        },

        transactions: [walletTransactionSchema],
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Wallet ||
    mongoose.model("Wallet", walletSchema);