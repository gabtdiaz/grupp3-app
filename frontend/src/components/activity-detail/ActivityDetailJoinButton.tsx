import React from "react";

interface ActivityDetailJoinButtonProps {
  onJoin?: () => void;
  isJoined?: boolean;
}

export const ActivityDetailJoinButton: React.FC<
  ActivityDetailJoinButtonProps
> = ({ onJoin, isJoined = false }) => {
  return (
    <button
      onClick={onJoin}
      className="w-full py-4 rounded-lg text-white font-futura"
      style={{
        backgroundColor: isJoined ? "#FF7070" : "#BDBDBD",
      }}
    >
      {isJoined ? "✓ GÅ MED" : "GÅ UR"}
    </button>
  );
};
