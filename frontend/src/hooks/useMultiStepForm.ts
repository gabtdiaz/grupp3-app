import { useState } from "react";

export function useMultiStepForm(initialStep = 1) {
  const [step, setStep] = useState(initialStep);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    // Validering och submit-logik här
    console.log("Registrera användare:", formData);
  };

  return {
    step,
    formData,
    handleNext,
    handleBack,
    handleChange,
    handleSubmit,
  };
}
