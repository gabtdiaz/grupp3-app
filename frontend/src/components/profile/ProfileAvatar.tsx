type ProfileAvatarProps = {
  imageSrc: string | null;
  initial: string;
};

export default function ProfileAvatar({
  imageSrc,
  initial,
}: ProfileAvatarProps) {
  return (
    <div className="absolute left-6 -bottom-11 w-22 h-22 z-10">
      <div className="absolute inset-1 rounded-full overflow-hidden bg-gray-50 text-gray-400 flex items-center justify-center">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt="Profilbild"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-3xl">{initial}</span>
        )}
      </div>

      <img
        src="/avatar-ring.svg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}
