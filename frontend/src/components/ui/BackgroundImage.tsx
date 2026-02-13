// BackgroundImage.tsx
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
        backgroundSize: "clamp(10rem, 45vw, 18rem) auto, contain, cover",
        backgroundPosition: `
          center calc(env(safe-area-inset-top) + var(--logo-offset)),
          center,
          center
        `,
      }}
    />
  );
};
