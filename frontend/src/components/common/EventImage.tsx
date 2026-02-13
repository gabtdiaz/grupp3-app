import React, { useState } from "react";

interface EventImageProps {
  src?: string | null;
  alt: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  shape?: "circle" | "square";
}

const sizeClasses = {
  sm: "h-12 w-12 text-lg",
  md: "h-18 w-18 text-3xl",
  lg: "h-40 w-full text-6xl",
  xl: "h-28 w-28 text-4xl",
};

export const EventImage: React.FC<EventImageProps> = ({
  src,
  alt,
  size = "md",
  shape = "circle",
  className = "",
}) => {
  const [imageError, setImageError] = useState(false);

  const getInitial = (name: string): string => {
    return name.charAt(0).toUpperCase();
  };

  const initial = getInitial(alt);
  const roundedClass = shape === "circle" ? "rounded-full" : "rounded-lg";

  // ✅ Fallback med er light-green färg
  if (!src || imageError) {
    return (
      <div
        className={`${sizeClasses[size]} ${className} ${roundedClass} bg-light-green/20 border-2 border-light-green/30 flex items-center justify-center`}
      >
        <span className="text-light-green font-semibold">{initial}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setImageError(true)}
      className={`${sizeClasses[size]} ${className} ${roundedClass} object-cover`}
    />
  );
};

export default EventImage;
