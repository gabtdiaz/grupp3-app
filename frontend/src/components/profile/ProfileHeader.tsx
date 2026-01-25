export default function Header() {
  return (
    <div
      className="relative h-52 bg-no-repeat"
      style={{
        backgroundImage: `url("/header-profile-background.png")`,
        backgroundSize: "26rem",
      }}
    >
      {/* Avatar placeholder */}
      <div className="absolute left-6 -bottom-12 h-24 w-24 rounded-full bg-white border border-light-green" />
    </div>
  );
}
