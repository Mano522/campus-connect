import { Link, useNavigate, useParams } from "react-router";
import EventForm from "../components/EventForm";

function EventEditPage({ events, onUpdateEvent }) {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const selectedEvent = events.find((event) => event.id === Number(eventId));

  if (!selectedEvent && events.length === 0) {
    return <section className="page-heading"><p>Loading event...</p></section>;
  }

  if (!selectedEvent) {
    return (
      <section className="page-heading">
        <h1>Event Not Found</h1>
        <Link className="details-button" to="/events">
          Back to Events
        </Link>
      </section>
    );
  }

  async function handleUpdateEvent(updatedEvent) {
    await onUpdateEvent(updatedEvent);
    navigate("/events");
  }

  return (
    <EventForm
      key={selectedEvent.id}
      editingEvent={selectedEvent}
      onUpdateEvent={handleUpdateEvent}
    />
  );
}

export default EventEditPage;
