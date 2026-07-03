import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
                price: {
                    type: Number,
                    required: true,
                },
                status: {
                    type: String,
                    enum: [
                        "Pending",
                        "Confirmed",
                        "Shipped",
                        "Delivered",
                        "Return Requested",
                        "Returned",
                        "Cancelled",

                    ],
                    default: "Pending",
                    required: true,
                },

                returnReason: {
                    type: String,
                },
            }
        ],

        totalAmount: {
            type: Number,
            required: true,
        },
        paymentMethod: {
            type: String,
            enum: ["COD", "RAZORPAY", "WALLET"],
            default: "COD",
        },
        paymentStatus: {
            type: String,
            enum: ["Pending", "Paid", "Failed"],
            default: "Pending",
        },
        razorpayOrderId: {
            type: String,
        },
        razorpayPaymentId: {
            type: String,
        },

        shippingAddress: {
            fullName: {
                type: String,
                required: true,
            },

            phone: {
                type: String,
                required: true,
            },

            addressLine: {
                type: String,
                required: true,
            },

            city: {
                type: String,
                required: true,
            },

            state: {
                type: String,
                required: true,
            },

            pinCode: {
                type: String,
                required: true,
            },
        },

    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Order || mongoose.model("Order", orderSchema);