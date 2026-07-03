"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import { useRouter, useSearchParams } from "next/navigation";



const Container = styled.div`
  width: 100%;
`;

const Header = styled.div`
  display: flex;

  justify-content: space-between;

  align-items: center;

  margin-bottom: 30px;

  @media(max-width:768px){
    flex-direction: column;

    gap: 15px;

    align-items: stretch;
  }
`;

const Title = styled.h1`
  font-size: 32px;

  color: #272727;
`;

const AddButton = styled.button`
  padding: 12px 25px;

  border: none;

  border-radius: 50px;

  background: #d4af37;

  color: white;

  cursor: pointer;

  transition: .3s;

  &:hover{
    background: #bf9b30;
  }
`;

const EmptyState = styled.div`
  text-align: center;

  padding: 60px 20px;

  color: #888;
`;

const AddressGrid = styled.div`
  display: grid;

  gap: 20px;
`;

const AddressCard = styled.div`
  background: white;

  padding: 25px;

  border-radius: 15px;

  box-shadow: 0 5px 20px rgba(0,0,0,.08);
`;

const Name = styled.h3`
  color: #272727;

  margin-bottom: 15px;
`;

const Info = styled.p`
  color: #666;

  margin-bottom: 8px;
`;

const ButtonGroup = styled.div`
  display: flex;

  gap: 10px;

  margin-top: 20px;
`;

const ActionButton = styled.button`
  padding: 10px 20px;

  border: none;

  border-radius: 8px;

  background: #f3f3f3;

  cursor: pointer;

  &:hover{
    background: #e8e8e8;
  }
`;

const DeleteButton = styled.button`
  padding: 10px 20px;

  border: none;

  border-radius: 8px;

  background: #ffebee;

  color: #e53935;

  cursor: pointer;

  &:hover{
    background: #ffcdd2;
  }
`;

const FormCard = styled.div`
  background: white;

  padding: 25px;

  border-radius: 15px;

  box-shadow: 0 5px 20px rgba(0,0,0,.08);

  margin-bottom: 30px;

  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Input = styled.input`
  width: 100%;

  padding: 12px;

  border: 1px solid #ddd;

  border-radius: 10px;

  outline: none;

  &:focus{
    border-color: #D4AF37;
  }
`;

const SaveButton = styled.button`
  padding: 12px;

  border: none;

  border-radius: 10px;

  background: #D4AF37;

  color: white;

  cursor: pointer;

  transition: .3s;

  &:hover{
    background: #bf9b30;
  }
`;

const DefaultBadge = styled.div`
  display: inline-block;

  margin-top: 15px;

  padding: 8px 14px;

  border-radius: 30px;

  background: #fff8e1;

  color: #d4af37;

  font-size: 14px;

  font-weight: 600;
`;

const SetDefaultButton = styled.button`
  margin-top: 15px;

  padding: 8px 14px;

  border: none;

  border-radius: 30px;

  background: #f5f5f5;

  cursor: pointer;

  transition: .3s;

  &:hover {
    background: #D4AF37;
    color: white;
  }
`;

const ErrorText = styled.p`
  color: #d32f2f;
  font-size: 13px;
  margin-top: 6px;
  margin-left: 4px;
`;

type Address = {
  _id: string;
  fullName: string;
  phone: number;
  addressLine: string;
  city: string;
  state: string;
  pinCode: number;
  isDefault: boolean;
};

export default function AddressPage() {

  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pinCode: "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pinCode: "",
  });

  const [editingAddressId, setEditingAddressId] =
    useState<string | null>(null);



  useEffect(() => {
    fetchAddresses();
  }, []);

  useEffect(() => {
    console.log("Addresses state updated:", addresses);
  }, [addresses]);


  const validateForm = () => {

    const newErrors = {
      fullName: "",
      phone: "",
      addressLine: "",
      city: "",
      state: "",
      pinCode: "",
    };

    let isValid = true;

    
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
      isValid = false;
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = "Minimum 3 characters required";
      isValid = false;
    }

    // Phone
    if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
      isValid = false;
    }

    
    if (!formData.addressLine.trim()) {
      newErrors.addressLine = "Address is required";
      isValid = false;
    } else if (formData.addressLine.trim().length < 10) {
      newErrors.addressLine =
        "Address should be at least 10 characters";
      isValid = false;
    }

   
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
      isValid = false;
    }

   
    if (!formData.state.trim()) {
      newErrors.state = "State is required";
      isValid = false;
    }

    
    if (!/^[0-9]{6}$/.test(formData.pinCode)) {
      newErrors.pinCode = "Enter a valid 6-digit PIN code";
      isValid = false;
    }

    setErrors(newErrors);

    return isValid;
  };

  const fetchAddresses = async () => {
    try {

      const res = await fetch("/api/user/address",
        {
          cache: "no-store",
        }
      );

      const data = await res.json();

      console.log("Fetched Addresses:", data.addresses);

      if (data.success) {
        setAddresses(data.addresses);
      }

    } catch (error) {
      console.log(error);
    }
  };

  const handleSaveAddress = async () => {

    if (!validateForm()) {
      return;
    }

    try {

      if (editingAddressId) {
        const res = await fetch(
          `/api/user/address/${editingAddressId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...formData,
              phone: Number(formData.phone),
              pinCode: Number(formData.pinCode),
            }),
          }
        );

        const data = await res.json();

        if (data.success) {

          if (from === "checkout") {
            router.push("/checkout");
            return;
          }


          fetchAddresses();

          setShowForm(false);

          setEditingAddressId(null);

          setFormData({
            fullName: "",
            phone: "",
            addressLine: "",
            city: "",
            state: "",
            pinCode: "",
          });

        }

      } else {
        const res = await fetch(
          "/api/user/address",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...formData,
              phone: Number(formData.phone),
              pinCode: Number(formData.pinCode),
            }),
          }
        );

        const data = await res.json();

        if (data.success) {

          if (from === "checkout") {
            router.push("/checkout");
            return;
          }

          fetchAddresses();

          setShowForm(false);

          setEditingAddressId(null);

          setFormData({
            fullName: "",
            phone: "",
            addressLine: "",
            city: "",
            state: "",
            pinCode: "",
          });

        }
      }

    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteAddress = async (
    addressId: string
  ) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!confirmed) return;

    try {

      const res = await fetch(
        `/api/user/address/${addressId}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (data.success) {
        fetchAddresses();
      }

    } catch (error) {

      console.log(error);

    }
  };

  const handleEditClick = (
    address: Address
  ) => {

    setEditingAddressId(address._id);

    setFormData({
      fullName: address.fullName,
      phone: address.phone.toString(),
      addressLine: address.addressLine,
      city: address.city,
      state: address.state,
      pinCode: address.pinCode.toString(),
    });

    setShowForm(true);
  };

  const handleSetDefault = async (
    addressId: string

  ) => {
    console.log("Sending ID:", addressId);

    try {
      const res = await fetch(
        `/api/user/address/default/${addressId}`,
        {
          method: "PATCH",
        }
      );

      const data = await res.json();

      if (data.success) {
        fetchAddresses();
      }

    } catch (error) {

      console.log(error);

    }
  };

  return (
    <Container>

      <Header>

        <Title>
          Address Book
        </Title>

        <AddButton
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "+ Add Address"}
        </AddButton>

      </Header>

      {
        showForm && (

          <FormCard>

            <Input
              type="text"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  fullName: e.target.value,
                })

                setErrors({
                  ...errors,
                  fullName: "",
                });
              }}
            />

            {errors.fullName && (
              <ErrorText>{errors.fullName}</ErrorText>
            )}

            <Input
              type="text"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  phone: e.target.value,
                })

                setErrors({
                  ...errors,
                  phone: "",
                });
              }}
            />

            {errors.phone && (
              <ErrorText>{errors.phone}</ErrorText>
            )}

            <Input
              type="text"
              placeholder="Address Line"
              value={formData.addressLine}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  addressLine: e.target.value,
                })

                setErrors({
                  ...errors,
                  addressLine: "",
                });

              }}
            />

            {errors.addressLine && (
              <ErrorText>{errors.addressLine}</ErrorText>
            )}

            <Input
              type="text"
              placeholder="City"
              value={formData.city}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  city: e.target.value,
                })

                setErrors({
                  ...errors,
                  city: "",
                });
              }}
            />

            {errors.city && (
              <ErrorText>{errors.city}</ErrorText>
            )}

            <Input
              type="text"
              placeholder="State"
              value={formData.state}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  state: e.target.value,
                })

                setErrors({
                  ...errors,
                  state: "",
                });
              }}
            />

            {errors.state && (
              <ErrorText>{errors.state}</ErrorText>
            )}

            <Input
              type="text"
              placeholder="PIN Code"
              value={formData.pinCode}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  pinCode: e.target.value,
                })

                setErrors({
                  ...errors,
                  pinCode: "",
                });
              }}
            />

            {errors.pinCode && (
              <ErrorText>{errors.pinCode}</ErrorText>
            )}

            <SaveButton
              onClick={handleSaveAddress}
            >
              {
                editingAddressId
                  ? "Update Address"
                  : "Save Address"
              }
            </SaveButton>

          </FormCard>

        )
      }

      {addresses.length === 0 ? (

        <EmptyState>
          No addresses found.
        </EmptyState>

      ) : (

        <AddressGrid>

          {addresses.map((address) => (

            <AddressCard key={address._id}>

              <Name>
                {address.fullName}
              </Name>

              <Info>
                {address.phone}
              </Info>

              <Info>
                {address.addressLine}
              </Info>

              <Info>
                {address.city}, {address.state}
              </Info>

              <Info>
                {address.pinCode}
              </Info>

              <ButtonGroup>

                <ActionButton
                  onClick={() => handleEditClick(address)}
                >
                  Edit
                </ActionButton>

                <DeleteButton
                  onClick={() => handleDeleteAddress(address._id)}
                >
                  Delete
                </DeleteButton>

              </ButtonGroup>

              {
                address.isDefault ? (

                  <DefaultBadge>
                    ⭐ Default Address
                  </DefaultBadge>

                ) : (

                  <SetDefaultButton
                    onClick={() => {
                      console.log("Clicked address:", address);
                      handleSetDefault(address._id)
                    }}
                  >
                    Set as Default
                  </SetDefaultButton>

                )
              }

            </AddressCard>

          ))}

        </AddressGrid>

      )}

    </Container>
  );
}