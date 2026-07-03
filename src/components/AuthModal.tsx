"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash
} from "@fortawesome/free-solid-svg-icons";

type AuthModalProps = {
  onClose: () => void;
  onLoginSuccess: () => void;
};

const Overlay = styled.div`
  position: fixed;
  inset: 0;

  background: rgba(0, 0, 0, 0.6);

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 20px;

  overflow-y: auto;

  z-index: 9999;

  @media (max-width: 480px) {
    align-items: flex-start;
    padding: 15px;
  }
`;
const Modal = styled.div`
  width: 100%;
  max-width: 450px;

  background: white;
  border-radius: 12px;
  padding: 30px;

  position: relative;
  box-sizing: border-box;

  max-height: 90vh;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 25px;
    max-width: 400px;
  }

  @media (max-width: 480px) {
    max-width: 100%;
    padding: 20px;
    border-radius: 10px;
    margin-top: 15px;
    margin-bottom: 15px;
    max-height: 85vh;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;

  border: none;
  background: none;

  font-size: 22px;
  padding: 6px;

  cursor: pointer;

  @media (max-width: 480px) {
    top: 10px;
    right: 10px;
  }
`;

const Title = styled.h2`
  text-align: center;
  color: #272727;
  margin-bottom: 25px;

  @media (max-width: 480px) {
    font-size: 24px;
    margin-bottom: 18px;
  }
`;

const Input = styled.input`
width:100%;

padding:15px;

margin-bottom:15px;

box-sizing: border-box;

border:1px solid #ddd;

border-radius:6px;

font-size:16px;

outline:none;

&:focus{
border-color: #d4af37;
}

@media(max-width:480px){
  padding:14px;
}
`;

/* Same as Input, but reserves space on the right so typed text
   never runs underneath the eye icon */
const PasswordInput = styled(Input)`
  padding-right: 45px;

  @media (max-width: 480px) {
    padding-right: 42px;
  }
`;

const Button = styled.button`
width:100%;
padding:12px;
border:none;
border-radius:6px;
background:#272727;
color:white;
font-size:16px;
cursor: pointer;
transition: 0.3s;
box-sizing: border-box;

&:hover {
    background: #d4af37;
    color: #272727;
}

&:disabled {
    background: #999;
    color: #eee;
    cursor: not-allowed;
}

    @media(max-width:480px){
  font-size:16px;
  padding:14px;
}
`;

const ToggleText = styled.p`
text-align:center;
margin-top:20px;
`;

const ToggleLink = styled.span`
color:#d4af37;
cursor:pointer;
font-weight:bold;
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  box-sizing: border-box;
  border-radius: 6px;
  font-size: 16px;
  resize: none;
  outline: none;

  &:focus {
    border-color: #d4af37;
  }

  @media (max-width: 480px) {
    padding: 14px;
    min-height: 90px;
  }
`;

const ErrorText = styled.p`
  color: red;
  font-size: 13px;
  margin-top: 4px;
  margin-bottom: 10px;
`;

const ForgotPassword = styled.p`
  text-align: right;
  margin: 10px 0 15px;
  color: #D4AF37;
  cursor: pointer;
  font-size: 15px;

  &:hover {
    text-decoration: underline;
  }

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const TimerText = styled.p`
  margin-top: 10px;
  margin-bottom: 10px;
  text-align: center;
  color: #D4AF37;
  font-size: 17px;
`;

const PasswordWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const EyeIcon = styled.span`
  position: absolute;
  top: 40%;
  right: 15px;
  transform: translateY(-50%);

  cursor: pointer;
  color: #666;

  &:hover {
    color: #272727;
  }
`;


export default function AuthModal({
  onClose,
  onLoginSuccess
}: AuthModalProps) {

  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otp, setOtp] = useState("");


  const [registerErrors, setRegisterErrors] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    pin: "",
    password: "",
    confirmPass: "",
  });

  const [loginErrors, setLoginErrors] = useState({
    email: "",
    password: "",
  });

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [forgotErrors, setForgotErrors] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [timer, setTimer] = useState(120);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  // Loading states for each async action
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  // True if ANY action is currently in flight - used to disable the button
  const isBusy =
    isLoggingIn ||
    isRegistering ||
    isSendingOtp ||
    isVerifyingOtp ||
    isResettingPassword;


  useEffect(() => {

    let interval: NodeJS.Timeout;

    if (showOtpScreen && timer > 0) {

      interval = setInterval(() => {

        setTimer(prev => prev - 1);

      }, 1000);

    }

    return () => clearInterval(interval);

  }, [showOtpScreen, timer]);

  function validateRegister() {

    let newErrors = {
      name: "",
      email: "",
      address: "",
      phone: "",
      pin: "",
      password: "",
      confirmPass: "",
    };

    let isValid = true;

    // Name
    if (!name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }
    else if (!/^[A-Za-z ]+$/.test(name)) {
      newErrors.name = "Name should contain only letters";
      isValid = false;
    }
    else if (name.trim().length < 3) {
      newErrors.name = "Name should contain at least 3 characters";
      isValid = false;
    }

    // Email
    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Address
    if (!address.trim()) {
      newErrors.address = "Address is required";
      isValid = false;
    }
    else if (address.trim().length < 10) {
      newErrors.address = "Please enter a complete address";
      isValid = false;
    }
    // Phone
    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
      isValid = false;
    }
    else if (!/^\d{10}$/.test(phone)) {
      newErrors.phone = "Phone number must contain exactly 10 digits";
      isValid = false;
    }

    // PIN
    if (!pin.trim()) {
      newErrors.pin = "PIN code is required";
      isValid = false;
    }
    else if (!/^\d{6}$/.test(pin)) {
      newErrors.pin = "PIN code must contain 6 digits";
      isValid = false;
    }

    // Password
    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    }
    else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password)
    ) {
      newErrors.password =
        "Password must contain uppercase, lowercase, number and special character";
      isValid = false;
    }

    // Confirm Password
    if (!confirmPass) {
      newErrors.confirmPass = "Confirm password is required";
      isValid = false;
    }
    else if (password !== confirmPass) {
      newErrors.confirmPass = "Passwords do not match";
      isValid = false;
    }



    setRegisterErrors(newErrors);

    return isValid;
  }

  function validateLogin() {
    let newErrors = {
      email: "",
      password: "",
    };

    let isValid = true;

    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setLoginErrors(newErrors);

    return isValid;
  }


  const handleRegister = async () => {
    try {

      if (!validateRegister()) {
        return;
      }

      setIsRegistering(true);

      const res = await fetch("/api/auth/register", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          address: address.trim(),
          phone: phone.trim(),
          pin: pin.trim(),
          password,
        }),

      });

      const data = await res.json();
      alert(data.message);

      if (res.ok) {
        alert("Registration successful");

        setIsLogin(true);

        setName("");
        setAddress("");
        setPhone("");
        setPin("");
        setPassword("");
        setConfirmPass("");
      }

      console.log(data);

    } catch (error) {
      console.log(error);
    } finally {
      setIsRegistering(false);
    }
  }

  const handleLogin = async () => {
    try {

      if (!validateLogin()) {
        return;
      }

      setIsLoggingIn(true);

      const res = await fetch("/api/auth/login", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (data.success) {

        alert(data.message);
        onLoginSuccess();
      }

      else {
        alert(data.message);
      }

    } catch (error) {
      console.log(error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleForgotPassword = async () => {
    try {

      setForgotErrors({
        email: "",
        otp: "",
        newPassword: "",
        confirmNewPassword: "",
      });

      let errors = {
        email: "",
        otp: "",
        newPassword: "",
        confirmNewPassword: "",
      };

      if (!email.trim()) {
        errors.email = "Email is required";
      }
      else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.email = "Invalid email address";
      }

      if (errors.email) {
        setForgotErrors(errors);
        return;
      }

      setIsSendingOtp(true);

      const res = await fetch(
        "/api/user/forgot-password",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        alert(data.message);
        setShowOtpScreen(true);
        setTimer(120);
      }

    } catch (error) {
      console.log(error);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {

      setForgotErrors({
        email: "",
        otp: "",
        newPassword: "",
        confirmNewPassword: "",
      });

      if (!otp.trim()) {

        setForgotErrors(prev => ({
          ...prev,
          otp: "OTP is required",
        }));

        return;
      }

      if (otp.length !== 6) {

        setForgotErrors(prev => ({
          ...prev,
          otp: "OTP must be 6 digits",
        }));

        return;
      }

      setIsVerifyingOtp(true);

      const res = await fetch(
        "/api/user/verify-reset-otp",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            otp,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert(data.message);

      setShowOtpScreen(false);
      setShowResetPassword(true);

    } catch (error) {

      console.log(error);

      alert("Something went wrong");

    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResetPassword = async () => {

    try {

      let errors = {
        email: "",
        otp: "",
        newPassword: "",
        confirmNewPassword: "",
      };

      if (!newPassword.trim()) {
        errors.newPassword = "Password is required";
      }
      else if (newPassword.length < 6) {
        errors.newPassword =
          "Password should contain at least 6 characters";
      }

      if (!confirmNewPassword.trim()) {
        errors.confirmNewPassword =
          "Confirm password is required";
      }
      else if (newPassword !== confirmNewPassword) {
        errors.confirmNewPassword =
          "Passwords do not match";
      }

      if (
        errors.newPassword ||
        errors.confirmNewPassword
      ) {

        setForgotErrors(errors);

        return;
      }

      setIsResettingPassword(true);

      const res = await fetch(
        "/api/user/reset-password",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            newPassword,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert(data.message);


      setShowResetPassword(false);
      setShowForgotPassword(false);
      setShowOtpScreen(false);

      setOtp("");

      setNewPassword("");
      setConfirmNewPassword("");

      setPassword("");

      // Return to login screen
      setIsLogin(true);

    } catch (error) {

      console.log(error);

      alert("Something went wrong");

    } finally {
      setIsResettingPassword(false);
    }
  };

 
  const handleMainButtonClick = showResetPassword
    ? handleResetPassword
    : showOtpScreen
      ? timer === 0
        ? handleForgotPassword
        : handleVerifyOtp
      : showForgotPassword
        ? handleForgotPassword
        : isLogin
          ? handleLogin
          : handleRegister;


  function getMainButtonLabel() {
    if (showResetPassword) {
      return isResettingPassword ? "Resetting..." : "Reset Password";
    }
    if (showOtpScreen) {
      if (timer === 0) {
        return isSendingOtp ? "Sending..." : "Resend OTP";
      }
      return isVerifyingOtp ? "Verifying..." : "Verify OTP";
    }
    if (showForgotPassword) {
      return isSendingOtp ? "Sending..." : "Send OTP";
    }
    if (isLogin) {
      return isLoggingIn ? "Logging in..." : "Login";
    }
    return isRegistering ? "Registering..." : "Register";
  }

  return (
    <Overlay>
      <Modal>
        <CloseButton onClick={onClose}>
          ✕
        </CloseButton>

        <Title>
          {
            showResetPassword
              ? "Reset Password"
              : showOtpScreen
                ? "Verify OTP"
                : showForgotPassword
                  ? "Forgot Password"
                  : isLogin
                    ? "Login"
                    : "Create Account"
          }
        </Title>

        {!isLogin && !showForgotPassword && (
          <>
            <Input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)} />

            {registerErrors.name && (<ErrorText>{registerErrors.name}</ErrorText>)}


            <Textarea
              placeholder="Full Address"
              rows={4}
              value={address}
              onChange={(e) => setAddress(e.target.value)} />

            {registerErrors.address && (<ErrorText>{registerErrors.address}</ErrorText>)}


            <Input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)} />

            {registerErrors.phone && (<ErrorText>{registerErrors.phone}</ErrorText>)}

            <Input
              type="text"
              placeholder="PIN Code"
              value={pin}
              onChange={(e) => setPin(e.target.value)} />

            {registerErrors.pin && (<ErrorText>{registerErrors.pin}</ErrorText>)}
          </>
        )}

        {
          !showOtpScreen && !showResetPassword && (
            <Input
              type="email"
              placeholder="EmailID"
              value={email}
              onChange={(e) => setEmail(e.target.value)} />
          )
        }


        {isLogin
          ? loginErrors.email && (
            <ErrorText>{loginErrors.email}</ErrorText>
          )
          : registerErrors.email && (
            <ErrorText>{registerErrors.email}</ErrorText>
          )}

        {
          forgotErrors.email &&
          <ErrorText>{forgotErrors.email}</ErrorText>
        }

        {
          !showForgotPassword && (

            <PasswordWrapper>

              <PasswordInput
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <EyeIcon
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                <FontAwesomeIcon
                  icon={
                    showPassword
                      ? faEyeSlash
                      : faEye
                  }
                />
              </EyeIcon>

            </PasswordWrapper>


          )
        }

        {isLogin
          ? loginErrors.password && (
            <ErrorText>{loginErrors.password}</ErrorText>
          )
          : registerErrors.password && (
            <ErrorText>{registerErrors.password}</ErrorText>
          )}

        {!isLogin && !showForgotPassword && (

          <PasswordWrapper>

            <PasswordInput
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
            />

            <EyeIcon
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            >
              <FontAwesomeIcon
                icon={
                  showConfirmPassword
                    ? faEyeSlash
                    : faEye
                }
              />
            </EyeIcon>

          </PasswordWrapper>

          )}


        {registerErrors.confirmPass && (<ErrorText>{registerErrors.confirmPass}</ErrorText>)}

        {
          isLogin && !showForgotPassword && (
            <ForgotPassword
              onClick={() => setShowForgotPassword(true)}
            >
              Forgot Password?
            </ForgotPassword>
          )
        }

        {
          showOtpScreen && (
            <Input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          )
        }

        {
          showOtpScreen && (
            <TimerText>
              OTP expires in{" "}
              {Math.floor(timer / 60)}:
              {(timer % 60).toString().padStart(2, "0")}
            </TimerText>
          )
        }

        {
          showOtpScreen && timer === 0 && (
            <TimerText>
              OTP expired. Click "Resend OTP" to get a new code.
            </TimerText>
          )
        }

        {
          forgotErrors.otp &&
          <ErrorText>
            {forgotErrors.otp}
          </ErrorText>
        }

        {
          showResetPassword && (
            <>
              <PasswordWrapper>
                <PasswordInput
                  type={showNewPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                <EyeIcon
                  onClick={() =>
                    setShowNewPassword(!showNewPassword)
                  }
                >
                  <FontAwesomeIcon
                    icon={
                      showNewPassword
                        ? faEyeSlash
                        : faEye
                    }
                  />
                </EyeIcon>
              </PasswordWrapper>

              {
                forgotErrors.newPassword &&
                <ErrorText>
                  {forgotErrors.newPassword}
                </ErrorText>
              }

              <PasswordWrapper>
                <PasswordInput
                  type={showConfirmNewPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />

                <EyeIcon
                  onClick={() =>
                    setShowConfirmNewPassword(!showConfirmNewPassword)
                  }
                >
                  <FontAwesomeIcon
                    icon={
                      showConfirmNewPassword
                        ? faEyeSlash
                        : faEye
                    }
                  />
                </EyeIcon>
              </PasswordWrapper>

              {
                forgotErrors.confirmNewPassword &&
                <ErrorText>
                  {forgotErrors.confirmNewPassword}
                </ErrorText>
              }
            </>
          )
        }

        <Button
          disabled={isBusy}
          onClick={handleMainButtonClick}
        >
          {getMainButtonLabel()}
        </Button>


        {
          !showForgotPassword && (
            <ToggleText>
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}

              <ToggleLink
                onClick={() =>
                  setIsLogin(!isLogin)
                }>

                {isLogin
                  ? "Register"
                  : "Login"}

              </ToggleLink>
            </ToggleText>

          )
        }

      </Modal>
    </Overlay>
  )
}