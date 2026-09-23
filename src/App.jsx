import {useState, useEffect} from "react";
import { Routes, Route } from "react-router";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import EventEditPage from "./pages/EventEditPage";
import AboutPage from "./pages/AboutPage";
function App() {
    const [events, setEvents] = useState([]);
    useEffect(()=>{
            fetch("http://localhost:4000/api/events")
            .then((response)=>response.json())
            .then((data)=>{
                setEvents(data);
            });
        }, []);

    function handleAddEvent(newEvent) {
       fetch("http://localhost:4000/api/events",{
        method:"POST",
        headers:{"content-Type":"application/json"

        },
        body:JSON.stringify(newEvent)
       }).then((response)=>response.json())
       .then((data)=>{
        console.log(data);
        fetch("http://localhost:4000/api/events")
        .then((response)=>response.json())
        .then((data)=>{
            setEvents(data);
        });
       })
    }

    function handleDeleteEvent(eventId) {
       fetch(`http://localhost:4000/api/events/${eventId}`,{
        method: "DELETE"
       }).then((response)=>response.json())
       .then((data)=>{
        console.log(data);
        fetch("http://localhost:4000/api/events")
        .then((response)=>response.json())
        .then((data)=>{
            setEvents(data);
        })
       })
    }
    async function handleUpdateEvent(updatedEvent) {
        const response = await fetch(`http://localhost:4000/api/events/${updatedEvent.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedEvent),
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Could not update event");
        }

        setEvents((currentEvents) =>
            currentEvents.map((event) =>
                event.id === data.event.id ? data.event : event
            )
        );
    }

    return (
        <div>
            <Navbar />

            <Routes>
                <Route
                    path="/"
                    element={
                        <HomePage
                            events={events}
                            onAddEvent={handleAddEvent}
                            onDeleteEvent={handleDeleteEvent}
                        />
                    }
                />

                <Route
                    path="/events"
                    element={
                        <EventsPage
                            events={events}
                            onDeleteEvent={handleDeleteEvent}
                        />
                    }
                />

                <Route
                    path="/events/:eventId"
                    element={
                        <EventDetailsPage
                            events={events}
                        />
                    }
                />

                <Route
                    path="/events/:eventId/edit"
                    element={
                        <EventEditPage
                            events={events}
                            onUpdateEvent={handleUpdateEvent}
                        />
                    }
                />

                <Route
                    path="/about"
                    element={<AboutPage />}
                />
            </Routes>

            <Footer />
        </div>
    );
}

export default App;