"use client";

import { useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";

const Container = styled.div`
    max-width:600px;

     @media(max-width:768px){
        max-width:100%;
    }
`;

const Title = styled.h2`
    font-size:32px;
    color:#272727;
    margin-bottom:35px;

    @media(max-width:768px){
        font-size:28px;
    }
`;

const Form = styled.form`
    display:flex;
    flex-direction:column;
    gap:22px;
`;

const InputGroup = styled.div`
    display:flex;
    flex-direction:column;
`;

const Label = styled.label`
    font-size:15px;
    margin-bottom:8px;
    color:#555;
    font-weight:500;
`;

const Input = styled.input`
    width: 100%;
    padding: 14px 50px 14px 16px;

    border:1px solid #ddd;

    border-radius:10px;

    font-size:16px;

    transition:.3s;

    &:focus{
        outline:none;
        border-color:#D4AF37;
        box-shadow:0 0 0 3px rgba(212,175,55,.15);
    }

    @media(max-width:768px){
        font-size:15px;
    }
`;

const Button = styled.button`
    margin-top:15px;

    padding:15px;

    border:none;

    border-radius:10px;

    background:#D4AF37;

    color:white;

    font-size:16px;

    font-weight:600;

    cursor:pointer;

    transition:.3s;

    &:hover{
        background:#c59d22;
    }

    @media(max-width:768px){
        padding:14px;
    }
`;

const ErrorText = styled.p`
    color: #d32f2f;
    font-size: 13px;
    margin-top: 6px;
    margin-left: 4px;
`;

const PasswordHint = styled.p`
    font-size: 13px;
    color: #777;
    margin-top: 6px;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const EyeButton = styled.button`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);

  border: none;
  background: transparent;
  cursor: pointer;

  color: #777;
  font-size: 18px;

  padding: 0;

  display: flex;
  align-items: center;
  justify-content: center;
`;
export default function ChangePasswordPage() {

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const validateForm = () => {

    const newErrors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    let isValid = true;


    if (!currentPassword.trim()) {
      newErrors.currentPassword = "Current password is required.";
      isValid = false;
    }


    if (!newPassword.trim()) {
      newErrors.newPassword = "New password is required.";
      isValid = false;
    }
    else if (newPassword.length < 8) {
      newErrors.newPassword =
        "Password must be at least 8 characters.";
      isValid = false;
    }
    else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(newPassword)
    ) {
      newErrors.newPassword =
        "Must contain uppercase, lowercase, number and special character.";
      isValid = false;
    }


    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password.";
      isValid = false;
    }
    else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword =
        "Passwords do not match.";
      isValid = false;
    }

    setErrors(newErrors);

    return isValid;
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {

      const res = await fetch(
        "/api/user/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
            confirmPassword,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {

        alert(data.message);

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

        setErrors({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

      } else {

        alert(data.message);

      }

    } catch (error) {

      console.log(error);

      alert("Something went wrong.");

    }

  };
  return (

    <Container>

      <Title>
        Change Password
      </Title>

      <Form onSubmit={handleSubmit}>

        <InputGroup>

          <Label>
            Current Password
          </Label>

          <InputWrapper>

            <Input
              type={
                showCurrentPassword
                  ? "text"
                  : "password"
              }
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);

                setErrors({
                  ...errors,
                  currentPassword: "",
                });
              }}
            />

            <EyeButton
              type="button"
              onClick={() =>
                setShowCurrentPassword(
                  !showCurrentPassword
                )
              }
            >
              <FontAwesomeIcon
                icon={
                  showCurrentPassword
                    ? faEyeSlash
                    : faEye
                }
              />
            </EyeButton>

          </InputWrapper>

          {
            errors.currentPassword &&
            <ErrorText>
              {errors.currentPassword}
            </ErrorText>
          }

        </InputGroup>

        <InputGroup>

          <Label>
            New Password
          </Label>

          <InputWrapper>

            <Input
              type={
                showNewPassword
                  ? "text"
                  : "password"
              }
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);

                setErrors({
                  ...errors,
                  newPassword: "",
                });
              }}
            />

            <EyeButton
              type="button"
              onClick={() =>
                setShowNewPassword(
                  !showNewPassword
                )
              }
            >
              <FontAwesomeIcon
                icon={
                  showNewPassword
                    ? faEyeSlash
                    : faEye
                }
              />
            </EyeButton>

          </InputWrapper>

          {errors.newPassword ? (
            <ErrorText>{errors.newPassword}</ErrorText>
          ) : (
            <PasswordHint>
              Password must contain at least 8 characters, one uppercase letter,
              one lowercase letter, one number, and one special character.
            </PasswordHint>
          )}

        </InputGroup>

        <InputGroup>

          <Label>
            Confirm Password
          </Label>

          <InputWrapper>

            <Input
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);

                setErrors({
                  ...errors,
                  confirmPassword: "",
                });
              }}
            />

            <EyeButton
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
            >
              <FontAwesomeIcon
                icon={
                  showConfirmPassword
                    ? faEyeSlash
                    : faEye
                }
              />
            </EyeButton>

          </InputWrapper>

          {
            errors.confirmPassword &&
            <ErrorText>
              {errors.confirmPassword}
            </ErrorText>
          }

        </InputGroup>

        <Button type="submit">
          Update Password
        </Button>

      </Form>

    </Container>

  );
}