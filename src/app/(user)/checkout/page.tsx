"use client";

import styled from "styled-components";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

import {
  faMoneyBillWave,
  faCreditCard,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faWallet } from "@fortawesome/free-solid-svg-icons";


const PageWrapper = styled.div`
  display: flex;
  gap: 30px;

  padding: 40px;

  align-items: flex-start;
`;

const AddressSection = styled.div`
  flex: 2;
`;

const SummarySection = styled.div`
  flex: 1;
`;

const Card = styled.div`
  background: white;

  padding: 25px;

  border-radius: 12px;

  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;




const SummaryCard = styled(Card)``;

const SummaryRow = styled.div`
  display: flex;

  justify-content: space-between;

  margin-bottom: 12px;
`;

const Divider = styled.hr`
  margin: 20px 0;
`;

const Total = styled.div`
  display: flex;

  justify-content: space-between;

  font-size: 20px;

  font-weight: bold;
`;

const PlaceOrderButton = styled.button`
  width: 100%;

  margin-top: 20px;

  padding: 14px;

  border: none;

  border-radius: 8px;

  background: #272727;

  color: white;

  font-size: 16px;

  cursor: pointer;

  transition: 0.3s;

  &:hover {
    background: #d4af37;
    color: #272727;
  }
`;

const AddressCard = styled.div<{ $selected: boolean }>`
  border: ${({ $selected }) =>
    $selected
      ? "2px solid #D4AF37"
      : "1px solid #ddd"};

  border-radius: 12px;

  padding: 20px;

  margin-bottom: 20px;

  cursor: pointer;

  transition: .3s;

  &:hover{
    border-color:#D4AF37;
  }
`;

const AddressName = styled.h3`
  font-size:18px;
  color:#272727;
`;

const AddressPhone = styled.p`
  color:#555;
  margin:6px 0;
`;

const AddressText = styled.p`
  color:#777;
  line-height:1.6;
`;

const ChangeAddressButton = styled.button`
  margin-top:20px;

  padding:10px 22px;

  border:none;

  border-radius:30px;

  background:#272727;

  color:white;

  cursor:pointer;

  transition:.3s;

  &:hover{
    background:#000;
  }
`;

const DefaultBadge = styled.span`
  display: inline-block;
  margin-top: 8px;
  padding: 4px 10px;
  border-radius: 20px;
  background: #D4AF37;
  color: white;
  font-size: 12px;
  font-weight: 600;
`;

const Subtitle = styled.p`
  color: #777;
  margin-bottom: 25px;
`;


const EmptyAddressContainer = styled.div`
  text-align: center;
  padding: 60px 30px;
  border: 2px dashed #ddd;
  border-radius: 12px;
`;

const EmptyTitle = styled.h3`
  margin-top: 15px;
  color: #272727;
`;

const EmptyText = styled.p`
  color: #777;
  margin: 15px 0 30px;
`;

const AddAddressButton = styled.button`
  padding: 14px 30px;

  border: none;

  border-radius: 30px;

  background: #D4AF37;

  color: white;

  font-size: 16px;

  cursor: pointer;

  transition: .3s;

  &:hover {
    background: #c79d24;
  }
`;

const PaymentSection = styled.div`
  margin-top: 40px;
`;

const PaymentCard = styled.div<{
  $selected: boolean;
}>`
  border: ${({ $selected }) =>
    $selected
      ? "2px solid #D4AF37"
      : "1px solid #ddd"};

  border-radius: 12px;

  padding: 20px;

  margin-bottom: 20px;

  cursor: pointer;

  transition: .3s;

  &:hover{
    border-color:#D4AF37;
  }
`;

const PaymentTitle = styled.h3`
  color:#272727;
  font-size:18px;
`;

const PaymentDescription = styled.p`
  color:#777;
  margin-top:8px;
  line-height:1.6;
`;

const PaymentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const PaymentIcon = styled.div`
  width: 45px;
  height: 45px;

  border-radius: 50%;

  background: #f8f8f8;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 20px;

  color: #D4AF37;
`;

export default function CheckoutPage() {

  type CartItem = {
    productId: {
      _id: string;
      name: string;
      price: number;
      image: string;
    };

    quantity: number;
  };

  type Address = {
    _id: string;
    fullName: string;
    phone: string;
    addressLine: string;
    city: string;
    state: string;
    pinCode: string;
    isDefault: boolean;
  };

  const [addresses, setAddresses] =
    useState<Address[]>([]);

  const [selectedAddress, setSelectedAddress] =
    useState<Address | null>(null);



  const PAYMENT_METHODS = {
    COD: "COD",
    RAZORPAY: "RAZORPAY",
    WALLET: "WALLET",
  } as const;

  type PaymentMethod = typeof PAYMENT_METHODS[keyof typeof PAYMENT_METHODS];

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>(PAYMENT_METHODS.COD);

  const [walletBalance, setWalletBalance] = useState(0);

  const router = useRouter();
  const { cartItems, fetchCart } = useCart();


  useEffect(() => {
    fetchAddresses();
    fetchCart();
    fetchWallet();
  }, []);



  const fetchAddresses = async () => {

    try {

      const res = await fetch(
        "/api/user/address"
      );

      const data = await res.json();

      console.log("Response:", data);

      if (data.success) {
        setAddresses(data.addresses);

        const defaultAddress =
          data.addresses.find(
            (address: Address) =>
              address.isDefault
          );

        if (defaultAddress) {

          setSelectedAddress(
            defaultAddress
          );

        }


      }

    } catch (error) {

      console.log(error);

    }

  };


  const handleRazorpayPayment = async () => {

    try {

      const res = await fetch(
        "/api/user/payment/create-order",
        {
          method: "POST",
        }
      );

      const data = await res.json();

      if (!data.success) {
        alert(data.message);
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,

        amount: data.order.amount,

        currency: data.order.currency,

        name: "Varna Jewels",

        description: "Order Payment",

        order_id: data.order.id,

        modal: {

          ondismiss: function () {

            alert(
              "Payment cancelled."
            );

          },

        },

        handler: async function (response: any) {

          try {

            const verifyRes = await fetch(
              "/api/user/payment/verify",
              {
                method: "POST",

                headers: {
                  "Content-Type": "application/json",
                },

                body: JSON.stringify({

                  razorpay_order_id:
                    response.razorpay_order_id,

                  razorpay_payment_id:
                    response.razorpay_payment_id,

                  razorpay_signature:
                    response.razorpay_signature,

                  addressId:
                    selectedAddress?._id,

                  paymentMethod,

                }),

              }
            );

            const verifyData =
              await verifyRes.json();

            if (verifyData.success) {

              await fetchCart();

              router.push(
                `/order-success/${verifyData.orderId}`
              );

            } else {

              alert(verifyData.message);

            }

          } catch (error) {

            console.log(error);

          }


        },

        theme: {
          color: "#b8860b",
        },
      };

      const paymentObject = new window.Razorpay(options);

      paymentObject.on(
        "payment.failed",
        function (response: any) {

          console.log(response);

          alert(
            "Payment failed. Please try again."
          );

        }
      );

      paymentObject.open();

    } catch (error) {

      console.log(error);

    }

  };




  const placeOrder = async () => {

    if (!selectedAddress) {
      alert("Please add a delivery address.");
      return;
    }

    if (paymentMethod === "RAZORPAY") {

      await handleRazorpayPayment();

      return;

    }


    try {

      console.log("Payment Method:", paymentMethod);

      const res = await fetch("/api/user/order/create",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            addressId: selectedAddress._id,
            paymentMethod,

          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        await fetchCart();
        router.push(`/order-success/${data.orderId}`)
      } else {
        alert(data.message);
      }

    } catch (error) {
      console.log(error);
    }
  }

  const subTotal = cartItems.reduce((acc: number, item: any) =>
    acc + item.productId.price * item.quantity, 0);

  const shipping = subTotal < 1000 ? 100 : 0;

  const total = subTotal + shipping;

  const COD_LIMIT = 1000;

  const isCODAvailable =
    total <= COD_LIMIT;

  useEffect(() => {

    if (
      !isCODAvailable &&
      paymentMethod === "COD"
    ) {

      setPaymentMethod(PAYMENT_METHODS.RAZORPAY);

    }

  }, [isCODAvailable, paymentMethod]);

  const fetchWallet = async () => {

    try {

      const res = await fetch("/api/user/wallet");

      const data = await res.json();

      if (data.success) {

        setWalletBalance(data.wallet.balance);

      }

    } catch (error) {

      console.log(error);

    }

  };

  const isWalletAvailable =
    walletBalance >= total;


  return (
    <PageWrapper>

      <AddressSection>

        <Title>
          Shipping Address
        </Title>

        <Subtitle>
          Select the address where you want your order delivered.
        </Subtitle>

        {
          addresses.length === 0 ? (

            <EmptyAddressContainer>

              <div style={{ fontSize: "60px" }}>
                📍
              </div>

              <EmptyTitle>
                No Saved Addresses
              </EmptyTitle>

              <EmptyText>
                Please add a delivery address before
                placing your order.
              </EmptyText>

              <AddAddressButton
                onClick={() =>
                  router.push("/profile/addresses?from=checkout")
                }
              >
                + Add Address
              </AddAddressButton>

            </EmptyAddressContainer>

          ) : (
            <>

              {addresses.map((address) => (

                <AddressCard
                  key={address._id}

                  $selected={
                    selectedAddress?._id === address._id
                  }

                  onClick={() =>
                    setSelectedAddress(address)
                  }
                >

                  <AddressName>
                    {address.fullName}
                  </AddressName>

                  {address.isDefault && (
                    <DefaultBadge>
                      Default
                    </DefaultBadge>
                  )}

                  <AddressPhone>
                    {address.phone}
                  </AddressPhone>

                  <AddressText>

                    {address.addressLine}

                    <br />

                    {address.city},{" "}
                    {address.state}

                    <br />

                    {address.pinCode}

                  </AddressText>

                </AddressCard>

              ))}

              <ChangeAddressButton
                onClick={() =>
                  router.push("/profile/addresses?from=checkout")
                }
              >
                Change Address
              </ChangeAddressButton>
            </>

          )
        }


        <PaymentSection>

          <Title>
            Payment Method
          </Title>

          <Subtitle>
            Choose how you'd like to pay.
          </Subtitle>

          <PaymentCard
            $selected={paymentMethod === "COD"}
            onClick={() => {

              if (!isCODAvailable) return;

              setPaymentMethod("COD");

            }}

            style={{
              opacity: isCODAvailable ? 1 : 0.5,
              cursor: isCODAvailable
                ? "pointer"
                : "not-allowed",
            }}
          >

            <PaymentHeader>

              <PaymentIcon>
                <FontAwesomeIcon
                  icon={faMoneyBillWave}
                />
              </PaymentIcon>

              <div>

                <PaymentTitle>
                  Cash On Delivery
                </PaymentTitle>

                <PaymentDescription>
                  Pay in cash when your jewellery is
                  delivered.
                </PaymentDescription>

                {!isCODAvailable && (

                  <PaymentDescription
                    style={{
                      color: "red",
                      fontWeight: 600,
                      marginTop: "10px",
                    }}
                  >
                    Cash On Delivery is available only
                    for orders up to ₹1000.
                  </PaymentDescription>

                )}

              </div>

            </PaymentHeader>

          </PaymentCard>

          <PaymentCard
            $selected={paymentMethod === "RAZORPAY"}
            onClick={() => setPaymentMethod("RAZORPAY")}
          >

            <PaymentHeader>

              <PaymentIcon>
                <FontAwesomeIcon
                  icon={faCreditCard}
                />
              </PaymentIcon>

              <div>

                <PaymentTitle>
                  Razorpay
                </PaymentTitle>

                <PaymentDescription>
                  Pay securely using UPI, Cards,
                  Net Banking and Wallet.
                </PaymentDescription>

              </div>

            </PaymentHeader>

          </PaymentCard>

          <PaymentCard
            $selected={paymentMethod === "WALLET"}
            onClick={() => {

              if (!isWalletAvailable) return;

              setPaymentMethod("WALLET");

            }}
            style={{
              opacity: isWalletAvailable ? 1 : 0.5,
              cursor: isWalletAvailable
                ? "pointer"
                : "not-allowed",
            }}
          >

            <PaymentHeader>

              <PaymentIcon>
                <FontAwesomeIcon
                  icon={faWallet}
                />
              </PaymentIcon>

              <div>

                <PaymentTitle>
                  Wallet
                </PaymentTitle>

                <PaymentDescription>
                  Pay instantly using your wallet balance.
                </PaymentDescription>

                <PaymentDescription
                  style={{
                    marginTop: "8px",
                    fontWeight: 600,
                    color: "#b8860b",
                  }}
                >
                  Available Balance: ₹{walletBalance}
                </PaymentDescription>

                {!isWalletAvailable && (

                  <PaymentDescription
                    style={{
                      color: "red",
                      fontWeight: 600,
                      marginTop: "10px",
                    }}
                  >
                    Insufficient wallet balance.
                  </PaymentDescription>

                )}

              </div>

            </PaymentHeader>

          </PaymentCard>

        </PaymentSection>


      </AddressSection>

      <SummarySection>

        <SummaryCard>

          <Title>Order Summary</Title>

          {cartItems.map((item: any) => (
            <SummaryRow
              key={item.productId._id}
            >
              <span style={{ fontSize: "18px", fontWeight: "400" }}>
                {item.productId.name}
                {" "}
                ×
                {item.quantity}
              </span>

              <span style={{ fontSize: "18px", fontWeight: "400" }}>
                ₹
                {item.productId.price * item.quantity}
              </span>
            </SummaryRow>
          ))}

          <SummaryRow>
            <span>Subtotal</span>
            <span>₹{subTotal}</span>
          </SummaryRow>

          <SummaryRow>
            <span>Shipping</span>
            <span>₹{shipping}</span>
          </SummaryRow>

          <Divider />

          <Total>
            <span>Total</span>
            <span>₹{total}</span>
          </Total>

          <PlaceOrderButton
            onClick={placeOrder}
          >
            Place Order
          </PlaceOrderButton>

        </SummaryCard>

      </SummarySection>

    </PageWrapper >
  )
}