export const BackgroundImage = () => {
  return (
    <div
      className="fixed inset-0 -z-10 bg-no-repeat"
      style={{
        backgroundImage: `
          url("/logo-black.png"),
          url("/phone-background.svg"),
          url("/index-background.png")
        `,
        backgroundSize: "auto 18rem, contain, cover",
        backgroundPosition: "top -1rem center, center, center",
      }}
    />
  );
};
