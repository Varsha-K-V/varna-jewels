import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({

    page: {
        padding: 40,
        fontSize: 12,
        fontFamily: "Helvetica",
    },

    title: {
        fontSize: 24,
        textAlign: "center",
        marginBottom: 5,
        fontWeight: "bold",
    },

    subtitle: {
        textAlign: "center",
        marginBottom: 25,
        color: "gray",
    },

    section: {
        marginBottom: 20,
    },

    heading: {
        fontSize: 16,
        marginBottom: 10,
        fontWeight: "bold",
    },

    row: {
        flexDirection: "row",

        marginBottom: 6,
    },

    tableHeader: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#000",
        borderBottomStyle: "solid",
        paddingBottom: 6,
        marginBottom: 8,
        fontWeight: "bold",
    },

    tableRow: {
        flexDirection: "row",
        paddingVertical: 6,
        borderBottomWidth: 0.5,
        borderBottomColor: "#ddd",
        borderBottomStyle: "solid",
    },

    product: {
        width: "40%",
    },

    qty: {
        width: "15%",
        textAlign: "center",
    },

    price: {
        width: "20%",
        textAlign: "right",
    },

    total: {
        width: "25%",
        textAlign: "right",
    },

    grandTotal: {
        marginTop: 20,
        textAlign: "right",
        fontSize: 16,
        fontWeight: "bold",
    },

    footer: {
        marginTop: 40,
        textAlign: "center",
        color: "gray",
        fontSize: 11,
    },

});

type InvoiceDocumentProps = {
    order: any;
};

export default function InvoiceDocument({
    order,
}: InvoiceDocumentProps) {
    return (

        <Document>

            <Page
                size="A4"
                style={styles.page}
            >

                <Text style={styles.title}>
                    VARNA JEWELS
                </Text>

                <Text style={styles.subtitle}>
                    Invoice
                </Text>

                <View style={styles.section}>

                    <View style={styles.row}>
                        <Text>Order ID</Text>
                        <Text>
                            :
                        </Text>
                        <Text>{order._id}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text>Date</Text>
                        <Text>
                            :
                        </Text>
                        <Text>
                            {new Date(order.createdAt).toLocaleDateString("en-IN")}
                        </Text>
                    </View>

                </View>

                <View style={styles.section}>

                    <Text style={styles.heading}>
                        Customer Details
                    </Text>

                    <Text>{order.shippingAddress.fullName}</Text>

                    <Text>{order.shippingAddress.addressLine}</Text>

                    <Text>
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state}
                    </Text>

                    <Text>
                        PIN : {order.shippingAddress.pinCode}
                    </Text>

                    <Text>
                        Phone : {order.shippingAddress.phone}
                    </Text>

                </View>

                <View style={styles.section}>

                    <View style={styles.tableHeader}>

                        <Text style={styles.product}>
                            Product
                        </Text>

                        <Text style={styles.qty}>
                            Qty
                        </Text>

                        <Text style={styles.price}>
                            Price
                        </Text>

                        <Text style={styles.total}>
                            Total
                        </Text>

                    </View>

                    {order.items.map((item: any) => (

                        <View
                            key={item._id}
                            style={styles.tableRow}
                        >

                            <Text style={styles.product}>
                                {item.productId.name}
                            </Text>

                            <Text style={styles.qty}>
                                {item.quantity}
                            </Text>

                            <Text style={styles.price}>
                                ₹{item.price}
                            </Text>

                            <Text style={styles.total}>
                                ₹{item.price * item.quantity}
                            </Text>

                        </View>

                    ))}

                </View>

                <View style={styles.section}>

                    <View style={styles.row}>
                        <Text>Payment Method</Text>
                        <Text>
                            :
                        </Text>
                        <Text>{order.paymentMethod}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text>Payment Status</Text>
                        <Text>
                            :
                        </Text>
                        <Text>{order.paymentStatus}</Text>
                    </View>

                </View>

                <Text style={styles.grandTotal}>
                    Grand Total : ₹{order.totalAmount}
                </Text>

                <Text style={styles.footer}>
                    Thank you for shopping with Varna Jewels
                </Text>

            </Page>

        </Document>

    );







}