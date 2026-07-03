"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  max-width: 900px;
  margin: 2rem auto;
  padding: 1rem;
`;

const BalanceCard = styled.div`
  background: #000;
  color: white;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  margin-bottom: 1rem;
`;

const Balance = styled.h2`
  font-size: 2.5rem;
`;

const SectionTitle = styled.h2`
  margin-bottom: 1rem;
`;

const TransactionCard = styled.div`
  background: white;
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,.08);

  display:flex;
  justify-content:space-between;
  align-items:center;
`;

const Left = styled.div`
  display:flex;
  flex-direction:column;
  gap:5px;
`;

const Purpose = styled.h3`
  margin:0;
`;

const DateText = styled.p`
  color:#777;
  margin:0;
`;

const Amount = styled.h3<{type:string}>`
  color:${({type})=>type==="Credit" ? "green" : "red"};
`;

export default function WalletPage() {

    const [wallet, setWallet] = useState<any>(null);

    useEffect(() => {
        fetchWallet();
    }, []);

    async function fetchWallet() {

        try {

            const res = await fetch("/api/user/wallet");

            console.log("Status:", res.status);

            const data = await res.json();

            console.log("Wallet API Response:", data);

            if (data.success) {
                setWallet(data.wallet);
            }

        } catch (error) {
            console.log(error);
        }

    }

    if (!wallet) {
        return <h2>Loading...</h2>;
    }

    return (

        <Container>

            <BalanceCard>

                <Title>
                    My Wallet
                </Title>

                <Balance>
                    ₹{wallet.balance}
                </Balance>

            </BalanceCard>

            <SectionTitle>
                Transaction History
            </SectionTitle>

            {
                wallet.transactions.length === 0 ? (

                    <p>No Transactions Yet.</p>

                ) : (

                 [...wallet.transactions].reverse().map((transaction:any,index:number)=>(

                        <TransactionCard
                            key={index}
                        >

                            <Left>

                                <Purpose>
                                    {transaction.purpose}
                                </Purpose>

                                <DateText>
                                    {
                                        new Date(transaction.createdAt)
                                        .toLocaleDateString()
                                    }
                                </DateText>

                            </Left>

                            <Amount
                                type={transaction.type}
                            >

                                {
                                    transaction.type==="Credit"
                                    ? "+"
                                    : "-"
                                }

                                ₹{transaction.amount}

                            </Amount>

                        </TransactionCard>

                    ))

                )
            }

        </Container>

    );

}