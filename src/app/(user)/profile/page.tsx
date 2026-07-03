"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
`;

const Title = styled.h1`
  font-size: 32px;
  color: #272727;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    font-size: 26px;
  }
`;

const Card = styled.div`
  background: #fff;

  border-radius: 15px;

  padding: 35px;

  box-shadow: 0 5px 20px rgba(0,0,0,.08);

  @media (max-width: 768px) {
    padding: 25px;
  }
`;

const InfoGroup = styled.div`
  margin-bottom: 25px;

  padding-bottom: 20px;

  border-bottom: 1px solid #eee;
`;

const Label = styled.p`
  font-size: 14px;

  color: #888;

  margin-bottom: 8px;
`;

const Value = styled.p`
  font-size: 18px;

  color: #272727;

  font-weight: 500;

  word-break: break-word;
`;

const EditButton = styled.button`
  margin-top: 20px;

  padding: 12px 30px;

  border: none;

  border-radius: 50px;

  background: #d4af37;

  color: white;

  font-size: 15px;

  cursor: pointer;

  transition: 0.3s;

  &:hover {
    background: #bf9b30;
  }
`;

type User = {
  name: string;
  email: string;
  phone: number;
  address: string;
  pin: number;
};

const InputGroup = styled.div`
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;

  padding: 12px;

  border: 1px solid #ddd;

  border-radius: 10px;

  font-size: 15px;

  outline: none;

  &:focus {
    border-color: #d4af37;
  }
`;

const TextArea = styled.textarea`
  width: 100%;

  min-height: 100px;

  padding: 12px;

  border: 1px solid #ddd;

  border-radius: 10px;

  resize: none;

  outline: none;

  &:focus {
    border-color: #d4af37;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;
`;

const CancelButton = styled.button`
  padding: 12px 30px;

  border: none;

  border-radius: 50px;

  background: #eee;

  cursor: pointer;

  transition: 0.3s;

  &:hover {
    background: #ddd;
  }
`;

const ErrorText = styled.p`
  color: #d32f2f;
  font-size: 13px;
  margin-top: 6px;
  margin-left: 4px;
`;

export default function ProfilePage() {
  const [user, setUser] = useState<User>({
    name: "",
    email: "",
    phone: 0,
    address: "",
    pin: 0,
  });

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    pin: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    address: "",
    pin: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/user/profile");

      const data = await res.json();

      if (data.success) {
        setUser(data.user);

        setFormData({
          name: data.user.name,
          phone: data.user.phone,
          address: data.user.address,
          pin: data.user.pin,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const validateProfileForm = () => {

    const newErrors = {
      name: "",
      phone: "",
      address: "",
      pin: "",
    };

    let isValid = true;


    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
      isValid = false;
    } else if (!/^[A-Za-z ]+$/.test(formData.name.trim())) {
      newErrors.name = "Only letters and spaces are allowed";
      isValid = false;
    }


    if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
      isValid = false;
    }


    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
      isValid = false;
    } else if (formData.address.trim().length < 10) {
      newErrors.address = "Address should be at least 10 characters";
      isValid = false;
    }


    if (!/^[0-9]{6}$/.test(formData.pin)) {
      newErrors.pin = "Enter a valid 6-digit PIN code";
      isValid = false;
    }

    setErrors(newErrors);

    return isValid;
  };

  const handleUpdateProfile = async () => {

    if (!validateProfileForm()) {
      return;
    }
    try {

      const res = await fetch(
        "/api/user/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            phone: Number(formData.phone),
            pin: Number(formData.pin),
          })
        }
      );

      const data = await res.json();

      if (data.success) {

        setUser(data.user);

        setIsEditing(false);

        alert("Profile updated successfully");

      }

    } catch (error) {

      console.log(error);

    }
  };

  return (
    <Container>

      <Title>
        Personal Information
      </Title>

      <Card>

        {!isEditing ? (

          <>
            <InfoGroup>
              <Label>Name</Label>
              <Value>{user.name}</Value>
            </InfoGroup>

            <InfoGroup>
              <Label>Email</Label>
              <Value>{user.email}</Value>
            </InfoGroup>

            <InfoGroup>
              <Label>Phone Number</Label>
              <Value>{user.phone}</Value>
            </InfoGroup>

            <InfoGroup>
              <Label>Address</Label>
              <Value>{user.address}</Value>
            </InfoGroup>

            <InfoGroup>
              <Label>PIN Code</Label>
              <Value>{user.pin}</Value>
            </InfoGroup>

            <EditButton onClick={() => setIsEditing(true)}>
              Edit Profile
            </EditButton>

          </>

        ) : (

          <>
            <InputGroup>
              <Label>Name</Label>

              <Input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })

                  setErrors({
                    ...errors,
                    name: "",
                  });
                }}
              />

              {errors.name && (
                <ErrorText>{errors.name}</ErrorText>
              )}
            </InputGroup>

            <InputGroup>
              <Label>Phone Number</Label>

              <Input
                type="text"
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
            </InputGroup>

            <InputGroup>
              <Label>Address</Label>

              <TextArea
                value={formData.address}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    address: e.target.value,
                  })

                  setErrors({
                    ...errors,
                    address: "",
                  });
                }}
              />

              {errors.address && (
                <ErrorText>{errors.address}</ErrorText>
              )}
            </InputGroup>

            <InputGroup>
              <Label>PIN Code</Label>

              <Input
                type="text"
                value={formData.pin}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    pin: e.target.value,
                  })

                  setErrors({
                    ...errors,
                    pin: "",
                  });
                }}
              />

              {errors.pin && (
                <ErrorText>{errors.pin}</ErrorText>
              )}
            </InputGroup>

            <ButtonContainer>

              <EditButton onClick={handleUpdateProfile}>
                Save Changes
              </EditButton>

              <CancelButton
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </CancelButton>

            </ButtonContainer>
          </>

        )}

      </Card>

    </Container>
  );
}