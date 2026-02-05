import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

console.log("LOADED useMultiStepForm FILE");

function toCamelCaseKey(key: string) {
  return key.length > 0 ? key[0].toLowerCase() + key.slice(1) : key;
}

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
    dateOfBirth: "",
    gender: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = () => {
    setError(null);
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setError(null);
    setStep((s) => s - 1);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (
    termsAccepted: boolean,
    privacyAccepted: boolean,
  ) => {
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Lösenorden matchar inte.");
      return;
    }
    if (!formData.dateOfBirth) {
      setError("Du måste ange födelsedatum.");
      return;
    }

    if (!formData.gender) {
      setError("Du måste välja kön.");
      return;
    }

    if (!termsAccepted || !privacyAccepted) {
      setError(
        "Du måste acceptera både användarvillkoren och integritetspolicyn.",
      );
      return;
    }

    const payload = {
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      city: formData.city || "Unknown",
      dateOfBirth: new Date(formData.dateOfBirth).toISOString(),
      gender: Number(formData.gender),
      acceptedTerms: termsAccepted,
      acceptedPrivacy: privacyAccepted,
    };

    try {
      setIsSubmitting(true);

      // 3)  POST /api/auth/register
      await register(payload);

      // 4) Vid lyckad register
      navigate("/activity");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as any;

        if (data?.errors) {
          const errors: Record<string, string> = {};

          Object.entries(data.errors).forEach(([key, value]) => {
            const camelKey = toCamelCaseKey(key);
            errors[camelKey] = (value as string[])[0];
          });

          setFieldErrors(errors);
          setError(null);
        } else if (typeof data === "string") {
          setError(data);
        } else {
          setError("Registreringen misslyckades.");
        }
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
    fieldErrors,
    handleNext,
    handleBack,
    handleChange,
    handleSubmit,
  };
}
