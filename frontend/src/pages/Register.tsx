import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMultiStepForm } from "../hooks/useMultiStepForm";
import { StepName } from "../components/register/StepName";
import { StepEmail } from "../components/register/StepEmail";
import { StepPassword } from "../components/register/StepPassword";
import { StepDetails } from "../components/register/StepDetails";
import ButtonOne from "@/assets/button-one.svg?react";
import ButtonTwo from "@/assets/button-two.svg?react";
import ButtonThree from "@/assets/button-three.svg?react";
import ButtonFour from "@/assets/button-four.svg?react";

const WAVES = [
  {
    color: "#fde3c8",
    path: "M0,20 C100,5 200,35 320,18 C400,8 480,28 560,20 L560,50 L0,50 Z",
    bottom: 52,
  },
  {
    color: "#f9c89a",
    path: "M0,26 C90,10 210,40 330,22 C420,10 490,32 560,24 L560,50 L0,50 Z",
    bottom: 36,
  },
  {
    color: "#f0a96e",
    path: "M0,30 C110,14 220,44 350,26 C430,14 500,34 560,28 L560,50 L0,50 Z",
    bottom: 20,
  },
  {
    color: "#e8933a",
    path: "M0,34 C120,18 230,46 360,30 C440,18 508,38 560,32 L560,50 L0,50 Z",
    bottom: 4,
  },
];

const STEP_TITLES: Record<number, { title: string; subtitle?: string }> = {
  1: { title: "Vad heter du?" },
  2: { title: "Och din e-post" },
  3: {
    title: "Välj ett lösenord",
    subtitle:
      "Lösenordet måste vara minst 8 tecken långt och innehålla minst en versal, en gemen och en siffra",
  },
  4: { title: "Lite mer om dig" },
};

const HERO_HEIGHT = "clamp(280px, 50vh, 600px)";
const TITLE_BOTTOM = "clamp(60px, 10vh, 100px)";

export default function RegisterPage() {
  const navigate = useNavigate();
  const formScrollRef = useRef<HTMLDivElement | null>(null);

  const {
    step,
    formData,
    error,
    isSubmitting,
    fieldErrors,
    handleNext,
    handleBack,
    handleChange,
    handleSubmit,
  } = useMultiStepForm();

  const { title, subtitle } = STEP_TITLES[step] ?? { title: "" };

  const scrollIntoView = (el: HTMLElement | null) => {
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  const sharedProps = {
    formData,
    fieldErrors,
    error,
    onChange: handleChange,
    onBack: handleBack,
    scrollIntoView,
  };

  const STEP_ICONS = [
    { stepNum: 1, Icon: ButtonOne },
    { stepNum: 2, Icon: ButtonTwo },
    { stepNum: 3, Icon: ButtonThree },
    { stepNum: 4, Icon: ButtonFour },
  ];

  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
      {/* Wave header */}
      <div
        className="relative w-full overflow-hidden bg-orange-300/90 shrink-0 -mb-px"
        style={{ height: HERO_HEIGHT }}
      >
        {/* Step indicator icons — pinned to top */}
        <div className="absolute inset-x-0 top-6 flex justify-center gap-3">
          {STEP_ICONS.map(({ stepNum, Icon }) => {
            const isActive = stepNum === step;
            return (
              <Icon
                key={stepNum}
                aria-label={`Step ${stepNum}`}
                className={`w-10 h-10 transition-all duration-300 ${
                  isActive
                    ? "[&_path:nth-child(1)]:fill-[#0f9100] scale-110"
                    : "scale-100"
                }`}
              />
            );
          })}
        </div>

        {/* Title — centered in the middle of the header */}
        <div
          className="absolute inset-x-0 top-0 flex flex-col items-center justify-center px-6 text-center"
          style={{ bottom: TITLE_BOTTOM }}
        >
          <h1 className="text-3xl text-white leading-tight">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-sm text-white/80 max-w-xs">{subtitle}</p>
          )}
        </div>

        {WAVES.map((wave, i) => (
          <svg
            key={i}
            className="absolute left-0 w-full"
            style={{ bottom: wave.bottom, height: 52 }}
            viewBox="0 0 560 50"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d={wave.path} fill={wave.color} />
          </svg>
        ))}

        <svg
          className="absolute -bottom-1 left-0 w-full block"
          style={{ height: 40 }}
          viewBox="0 0 560 50"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0,28 C130,10 260,46 390,28 C460,18 520,36 560,28 L560,50 L0,50 Z"
            fill="#faf4ee"
          />
        </svg>
      </div>

      {/* Form section */}
      <div
        ref={formScrollRef}
        className="flex-1 bg-[#faf4ee] overflow-y-auto"
        style={{
          paddingBottom: "max(16px, env(safe-area-inset-bottom) + 220px)",
        }}
      >
        <div className="px-6 pt-6 pb-8 w-full max-w-md mx-auto">
          {step === 1 && (
            <StepName
              {...sharedProps}
              onNext={handleNext}
              onCancel={() => navigate("/")}
            />
          )}
          {step === 2 && <StepEmail {...sharedProps} onNext={handleNext} />}
          {step === 3 && <StepPassword {...sharedProps} onNext={handleNext} />}
          {step === 4 && (
            <StepDetails
              {...sharedProps}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
}
