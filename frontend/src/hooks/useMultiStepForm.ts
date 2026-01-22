import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

console.log("LOADED useMultiStepForm FILE");

export function useMultiStepForm(initialStep = 1) {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [step, setStep] = useState(initialStep);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    city: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = () => {
    setError(null);
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setError(null);
    setStep((s) => s - 1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Lösenorden matchar inte.");
      return;
    }

    
    const payload = {
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      city: formData.city || "Unknown", 
    };

    try {
      setIsSubmitting(true);

      // 3)  POST /api/auth/register
      await register(payload);

      // 4) Vid lyckad register
      navigate("/");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg =
          (typeof err.response?.data === "string" && err.response.data) ||
          (err.response?.data?.detail as string) ||
          "Registreringen misslyckades.";
        setError(msg);
      } else {
        setError("Registreringen misslyckades.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    step,
    formData,
    error,
    isSubmitting,
    handleNext,
    handleBack,
    handleChange,
    handleSubmit,
  };
}
