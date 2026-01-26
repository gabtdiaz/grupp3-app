import FeedDate from "./FeedDate";
import ActivityCard from "./ActivityCard";

export default function ActivityFeed() {
  const isEmpty = false;

  if (isEmpty) {
    return (
      <div className="flex flex-1 items-center justify-center text-center px-6">
        <p
          className="text-gray-400 text-xl"
          style={{ fontFamily: "'Segoe Print', cursive" }}
        >
          Här är det tomt just nu :(
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <FeedDate label="Måndag, 14 januari" />
      <ActivityCard
        title="BOKKLUBB: Greven av Monte Cristo"
        description="Tänkte att vi ska läsa Greven av Monte Cristo och träffas för att diskutera boken varje vecka..."
        participants={11}
      />
      <ActivityCard
        title="Brädspelskväll!!! D&D"
        description="Vi tänkte ses och spela lite Dungeons & Dragons tillsammans. Inget seriöst, vi är alla ganska nya..."
        participants={5}
        imageSrc="/dungeons-and-dragons.jpg"
      />
      <FeedDate label="Söndag, 13 januari" />
      <ActivityCard
        title="SALSA! Nybörjarkväll!"
        description="Vi dansar salsa utomhus och har kul tillsammans. Inga förkunskaper behövs."
        participants={8}
      />
    </div>
  );
}
