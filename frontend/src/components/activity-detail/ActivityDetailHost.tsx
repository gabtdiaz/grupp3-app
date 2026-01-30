import React from "react";

interface ActivityDetailHostProps {
  hostName: string;
  hostRole?: string;
  hostImageUrl?: string;
}

export const ActivityDetailHost: React.FC<ActivityDetailHostProps> = ({
  hostName,
  hostImageUrl,
}) => {
  return (
    <div className="px-4 py-5 border-b border-gray-100">
      <p className="text-sm text-gray-700 mb-3">Arrangeras av</p>

      {/* Host Card */}
      <div className="flex items-center gap-4">
        {/* Profile Image */}
        <div className="shrink-0">
          {hostImageUrl ? (
            <img
              src={hostImageUrl}
              alt={hostName}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-16 h-16 rounded-full border-2 border-gray-300" />
          )}
        </div>

        {/* Host Info */}
        <div className="flex-1">
          <h3 className="text-lg font-normal text-gray-900">{hostName}</h3>
          <p className="text-sm text-gray-500">Arrangör</p>
        </div>
      </div>
    </div>
  );
};
