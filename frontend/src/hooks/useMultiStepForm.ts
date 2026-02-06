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
    const fail = (message: string) => {
    setError(message);
    return;
  };

  if (step === 1) {
    const firstName = formData.firstName.trim();
    const lastName = formData.lastName.trim();

    if (!firstName) return fail("First name is required");
    if (firstName.length < 2) return fail("First name must be at least 2 characters");

    if (!lastName) return fail("Last name is required");
    if (lastName.length < 2) return fail("Last name must be at least 2 characters");

    setStep((s) => s + 1);
    return;
  }

 if (step === 2) {
  const email = formData.email.trim();

  if (!email) {
    setFieldErrors((prev) => ({
      ...prev,
      email: "Email is required",
    }));
    return;
  }

  const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  if (!emailRegex.test(email)) {
    setFieldErrors((prev) => ({
      ...prev,
      email: "Email must contain @ and a domain with a dot",
    }));
    return;
  }

  setFieldErrors((prev) => ({ ...prev, email: "" }));
  setStep((s) => s + 1);
  return;
  }

  if (step === 3) {
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    if (!password) return fail("Password is required");

    const hasMinLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (!hasMinLength || !hasUpper || !hasLower || !hasNumber) {
      return fail(
        "Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, and one number."
      );
    }

    if (password !== confirmPassword) {
    setFieldErrors((prev) => ({
      ...prev,
      confirmPassword: "Lösenorden matchar inte.",
    }));
  return;
}


    setStep((s) => s + 1);
    return;
  }

  if (step === 4) {
    if (!formData.city) return fail("City is required");
    if (!formData.dateOfBirth) return fail("Date of birth is required");
    if (!formData.gender) return fail("Gender is required");

    const minimumAge = 18;
    const dateOfBirth = new Date(formData.dateOfBirth);

    if (Number.isNaN(dateOfBirth.getTime())) {
      return fail("Date of birth is required");
    }

    const today = new Date();
    let age = today.getFullYear() - dateOfBirth.getFullYear();

    const compareDate = new Date(today);
    compareDate.setFullYear(today.getFullYear() - age);

    if (dateOfBirth > compareDate) {
      age--;
    }

    if (age < minimumAge) {
      return fail(`Du måste vara minst ${minimumAge} år för att bli medlem`);
    }

    return;
  }

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
     if (!formData.city) {
    setFieldErrors((prev) => ({
      ...prev,
      city: "City is required",
    }));
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
    const minimumAge = 18;
const dateOfBirth = new Date(formData.dateOfBirth);

    if (Number.isNaN(dateOfBirth.getTime())) {
      setError("Du måste ange födelsedatum.");
      return;
    }

    const today = new Date();
    let age = today.getFullYear() - dateOfBirth.getFullYear();

    const compareDate = new Date(today);
    compareDate.setFullYear(today.getFullYear() - age);

    if (dateOfBirth > compareDate) {
      age--;
    }

    if (age < minimumAge) {
      setError(`Du måste vara minst ${minimumAge} år för att bli medlem`);
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
