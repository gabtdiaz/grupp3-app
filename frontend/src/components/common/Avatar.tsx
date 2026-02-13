import React, { useState } from "react";

interface AvatarProps {
  src?: string | null;
  alt: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "h-10 w-10 text-sm",
  md: "h-14 w-14 text-base",
  lg: "h-20 w-20 text-2xl",
  xl: "h-32 w-32 text-4xl",
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = "md",
  className = "",
}) => {
  const [imageError, setImageError] = useState(false);

  // Hämta initial från namn
  const getInitial = (name: string): string => {
    return name.charAt(0).toUpperCase();
  };

  const initial = getInitial(alt);

  // Om ingen src ELLER om bilden failade att ladda
  if (!src || imageError) {
    return (
      <div
        className={`${sizeClasses[size]} ${className} rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center`}
      >
        <span className="text-white font-semibold">{initial}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setImageError(true)}
      className={`${sizeClasses[size]} ${className} rounded-full object-cover`}
    />
  );
};

export default Avatar;
