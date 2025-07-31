'use strict';
import 'react-tabs/style/react-tabs.css';
import React, { useState, useRef, useEffect } from "react";
import Loader from "../components/common/Loader";
import { authClient, websiteClient } from "../utils/httpClient";
import { useNavigate } from "react-router-dom";
import { toastError, toastSuccess } from '../utils/toast';
import { FaMobileAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Login = () => {
  const navigation = useNavigate();
  const [loginForm, setLoginForm] = useState({ mobile: '' });
  const [loader, setLoader] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(true);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [errors, setErrors] = useState({});
  const inputsRef = useRef([]);

  useEffect(() => {
    let timer;
    if (otpSent && otpTimer > 0) {
      timer = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [otpSent, otpTimer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobile") {
      const onlyDigits = value.replace(/\D/g, "");
      setLoginForm({ ...loginForm, [name]: onlyDigits });
    }
  };

  const validatePhone = () => {
    const validationErrors = {};
    if (!loginForm.mobile) {
      validationErrors.mobile = "Phone is required";
    } else if (loginForm.mobile.length !== 10) {
      validationErrors.mobile = "Must be exactly 10 digits";
    }
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const validateOTP = () => {
    const validationErrors = {};
    const otpValue = otp.join("");
    if (!otpValue) {
      validationErrors.otp = "Enter 6 Digits OTP";
    } else if (otpValue.length !== 6) {
      validationErrors.otp = "OTP must be 6 digits";
    }
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleGetOTP = async (e) => {
    e.preventDefault();
    if (validatePhone()) {
      try {
        setLoader(true);
        const res = await websiteClient.post('/otp/request-otp', {
          mobile: loginForm.mobile
        });

        console.log("OTP response:", res);

        if (res?.data?.code === 200 || res?.code === 200) {
          toastSuccess("OTP sent to your mobile number");
          setOtpSent(true);
          setOtpTimer(60);
          setCanResend(false);
          setIsOtpVerified(false);
          inputsRef.current[0]?.focus();
        } else {
          toastError(res?.data?.message || res?.message || "Failed to send OTP");
        }
      } catch (err) {
        console.error("OTP Error:", err);
        const message = err?.response?.data?.message || "Failed to send OTP. Please try again.";
        toastError(message);
      } finally {
        setLoader(false);
      }
    }
  };

  const handleResendOTP = async () => {
    try {
      setLoader(true);
      const res = await websiteClient.post('/otp/request-otp', {
        mobile: loginForm.mobile
      });
      if (res?.code === 200) {
        toastSuccess("New OTP sent successfully!");
        setOtpTimer(60);
        setCanResend(false);
        setIsOtpVerified(false);
        inputsRef.current[0]?.focus();
      } else {
        toastError(res?.message || "Failed to resend OTP");
      }
    } catch (err) {
      toastError("Failed to resend OTP. Please try again.");
    } finally {
      setLoader(false);
    }
  };

  const verifyOtp = async () => {
    if (validateOTP()) {
      try {
        setLoader(true);
        const otpValue = otp.join("");
        const res = await websiteClient.post('/otp/verify-otp', {
          mobile: loginForm.mobile,
          otp: otpValue
        });
        if (res?.data.success) {
          toastSuccess("OTP verified successfully!");
          setIsOtpVerified(true);
          setLoginForm(prev => ({ ...prev, otp: otpValue }));
          return true;
        } else {
          toastError(res?.message || "Invalid OTP. Please try again.");
          return false;
        }
      } catch (err) {
        toastError("Failed to verify OTP. Please try again.");
        return false;
      } finally {
        setLoader(false);
      }
    }
    return false;
  };

  const handleOtpChange = (e, idx) => {
    const value = e.target.value.replace(/\D/, "");
    if (value && value.length > 1) return;

    const updated = [...otp];
    updated[idx] = value;
    setOtp(updated);

    if (value && idx < 5) inputsRef.current[idx + 1]?.focus();
  };

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
    if (e.key === "ArrowRight" && idx < 5) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text")
      .slice(0, 6)
      .replace(/\D/g, "")
      .split("");

    if (paste.length === 6) {
      const updated = [...otp];
      paste.forEach((d, i) => (updated[i] = d));
      setOtp(updated);
      inputsRef.current[5]?.focus();
    }
  };

  const handleSubmit = async () => {
    if (isOtpVerified) {
      try {
        setLoader(true);
        const response = await authClient.post('/auth/login', {
          mobile: loginForm.mobile,
          otp: 1234
        });
        if (response.data.status) {
          localStorage.setItem('adminToken', response.data.data.token);
          navigation('/home');
        }
      } catch (err) {
        console.error(`Login error => ${err}`);
        const errorData = err.response?.data?.data || {};
        const errorMessages = Object.values(errorData).flat();
        errorMessages.forEach(toastError);
      } finally {
        setLoader(false);
      }
    } else {
      toastError('Please verify OTP first');
    }
  };

  return (
    <>
      {loader && <Loader />}
      <main className="main advrt_out bg-dark hi-100">
        <div className="login-bg login-area pt-120 pb-120">
          <Link to="https://unimakler.com/">
            <img
              src="/assets/images/unimakler-logo.png"
              alt="logos"
              className='advt-logo'
              width={180}
            />
          </Link>
          <div className="container">
            <div className="row align-items-center justify-content-center">
              <div className="col-md-12 tabHome">
                <div className='adlogin_out'>
                  <div className="log" id="demo">
                    <h5 className='text-center mb-5'> City Manager / Team Leader / Executive </h5>
                    <h2 className="anyTab">
                      <form className="formForm text-center">
                        {/* Mobile Input */}
                        <div className="form-group row align-items-center mb-3">
                          <div className="col-md-8 position-relative">
                            <div className="form-group position-relative">
                              <input
                                type="tel"
                                className={`form-control inputForm formContoler ps-3 m-0 ${errors.mobile ? 'is-invalid' : ''}`}
                                placeholder="Mobile"
                                name="mobile"
                                value={loginForm.mobile}
                                onChange={handleChange}
                                maxLength={10}
                                disabled={otpSent}
                              />
                              <FaMobileAlt className="pibuilding" />
                            </div>
                            {errors.mobile && <div className="invalid-feedback d-block text-start">{errors.mobile}</div>}
                          </div>
                          <div className="col-md-4">
                            {!otpSent ? (
                              <button
                                type="button"
                                className="gt-otp"
                                onClick={handleGetOTP}
                                disabled={!loginForm.mobile || loginForm.mobile.length !== 10}
                              >
                                Get OTP
                              </button>
                            ) : (
                              <div className="verified-badge">
                                {isOtpVerified ? '✓ Verified' : '✓ Sent'}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* OTP Input Section */}
                        {otpSent && !isOtpVerified && (
                          <div className="form-group mb-3">
                            <h5 className='text-white d-flex justify-content-start mb-2'>Enter OTP</h5>
                            <div className="row align-items-center mb-3 justify-content-center w-100">
                              <div className="col-md-8 mt-3">
                                <div
                                  className="d-flex gap-2 mb-2 justify-content-center"
                                  onPaste={handleOtpPaste}
                                >
                                  {otp.map((digit, idx) => (
                                    <input
                                      key={idx}
                                      type="text"
                                      maxLength="1"
                                      className={` text-center p-0 text-dark fw-bold ${errors.otp ? 'is-invalid' : ''}`}
                                      value={digit}
                                      onChange={(e) => handleOtpChange(e, idx)}
                                      onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                                      ref={el => inputsRef.current[idx] = el}
                                      style={{ width: 25, height: 25, fontSize: 16 }}
                                    />
                                  ))}
                                </div>
                                {errors.otp && <div className="invalid-feedback d-block">{errors.otp}</div>}
                              </div>
                              <div className="col-md-4">
                                <button
                                  type="button"
                                  className="btn btn-sm btn-primary mt-1"
                                  onClick={verifyOtp}
                                  disabled={otp.join('').length !== 6}
                                >
                                  Verify OTP
                                </button>
                              </div>
                            </div>
                            <div className="d-flex justify-content-between mt-2">
                              {otpTimer > 0 ? (
                                <span className="timer">Resend OTP in {otpTimer}s</span>
                              ) : (
                                <button
                                  type="button"
                                  className="btn btn-sm btn-link p-0"
                                  onClick={handleResendOTP}
                                  disabled={!canResend}
                                >
                                  Resend OTP
                                </button>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Submit Button */}
                        <button
                          className="theme-btn"
                          type="button"
                          onClick={handleSubmit}
                          // disabled={!isOtpVerified}
                        >
                          Sign In
                        </button>
                      </form>
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Login;