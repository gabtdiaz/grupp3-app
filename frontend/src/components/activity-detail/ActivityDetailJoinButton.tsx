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
      className="flex justify-center items-center w-80 py-4 px-3 rounded text-white"
      style={{
        backgroundColor: isJoined ? "#BDBDBD" : "#7c9370",
      }}
    >
      {isJoined ? "GÅ UR" : "GÅ MED"}
    </button>
  );
};
