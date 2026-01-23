export default function ActivityFeed() {
  const isEmpty = true; // senare ersätter du med riktig data-check

  return (
    <div
      className="flex-1 flex items-center justify-center text-center"
      style={{
        backgroundImage: "url('/activity-feed-background.png')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center 20%",
        backgroundSize: "90%",
      }}
    >
      {isEmpty && (
        <p
          className="text-gray-400 text-xl pb-25"
          style={{
            fontFamily: "'Segoe Print',  cursive",
          }}
        >
          Här är det tomt just nu :(
        </p>
      )}
    </div>
  );
}
