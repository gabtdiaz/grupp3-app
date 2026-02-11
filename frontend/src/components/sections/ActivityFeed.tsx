import FeedDate from "./FeedDate";
import ActivityCard from "./ActivityCard";
import type { Event } from "../../api/eventService";

interface ActivityFeedProps {
  events: Event[];
  onCardClick: (eventId: number) => void;
}

export default function ActivityFeed({
  events,
  onCardClick,
}: ActivityFeedProps) {
  // Filtrera bort gamla events (endast kommande events ska synas)
  const upcomingEvents = events.filter((event) => {
    const eventDate = new Date(event.startDateTime);
    const now = new Date();
    return eventDate >= now;
  });
  if (upcomingEvents.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center text-center px-6">
        <p
          className="text-gray-400 text-xl"
          style={{ fontFamily: "'Segoe Print', cursive" }}
        >
          Här är det tomt just nu :
        </p>
      </div>
    );
  }

  // Gruppera events per datum
  const eventsByDate = groupEventsByDate(upcomingEvents);

  return (
    <div className="flex flex-col w-full">
      {Object.entries(eventsByDate).map(([date, dateEvents]) => (
        <div key={date}>
          <FeedDate label={formatDate(date)} />
          {dateEvents.map((event) => (
            <ActivityCard
              key={event.id}
              eventId={event.id} 
              title={event.title}
              description={event.description || ""}
              participants={event.currentParticipants}
              maxParticipants={event.maxParticipants}
              imageSrc={event.imageUrl || undefined}
              isFull={event.isFull}
              onClick={() => onCardClick(event.id)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// Grupperar events per datum

function groupEventsByDate(events: Event[]): Record<string, Event[]> {
  const grouped: Record<string, Event[]> = {};

  events.forEach((event) => {
    const date = event.startDateTime.split("T")[0]; // "2026-01-29"
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(event);
  });

  // Sortera datum
  return Object.keys(grouped)
    .sort()
    .reduce(
      (acc, date) => {
        acc[date] = grouped[date];
        return acc;
      },
      {} as Record<string, Event[]>,
    );
}

// Formaterar datum från "2026-01-29" till "Måndag, 29 januari"

function formatDate(dateString: string): string {
  const date = new Date(dateString);

  const weekday = date.toLocaleDateString("sv-SE", { weekday: "long" });
  const day = date.getDate();
  const month = date.toLocaleDateString("sv-SE", { month: "long" });

  // Kapitalisera första bokstaven
  const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);

  return `${capitalizedWeekday}, ${day} ${month}`;
}
