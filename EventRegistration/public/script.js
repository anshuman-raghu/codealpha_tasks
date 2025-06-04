const API_BASE_URL = "http://localhost:8004/api"; // Ensure this matches your server port

// Helper to get JWT token
function getToken() {
    return localStorage.getItem("token");
}

// Helper to clear token
function clearToken() {
    localStorage.removeItem("token");
}

// --- User Registration ---
document
    .getElementById("registerForm")
    .addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = document.getElementById("registerName").value;
        const email = document.getElementById("registerEmail").value;
        const password = document.getElementById("registerPassword").value;

        try {
            const response = await fetch(`${API_BASE_URL}/users/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                alert("User registered successfully!");
                document.getElementById("registerForm").reset();
            } else {
                alert(`Registration failed: ${data.message || data.error}`);
            }
        } catch (error) {
            console.error("Error during registration:", error);
            alert("An error occurred during registration.");
        }
    });

// --- User Login ---
document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
        const response = await fetch(`${API_BASE_URL}/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem("token", data.token);
            alert("Logged in successfully!");
            document.getElementById("loginForm").reset();
            fetchEvents();
            fetchMyRegistrations();
        } else {
            alert(`Login failed: ${data.message || data.error}`);
            clearToken();
        }
    } catch (error) {
        console.error("Error during login:", error);
        alert("An error occurred during login.");
        clearToken();
    }
});

// --- Create Event ---
document
    .getElementById("createEventForm")
    .addEventListener("submit", async (e) => {
        e.preventDefault();
        const title = document.getElementById("eventTitle").value;
        const description = document.getElementById("eventDescription").value;
        const date = document.getElementById("eventDate").value;
        const location = document.getElementById("eventLocation").value;
        const token = getToken();

        if (!token) {
            alert("Please log in to create an event.");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/events`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title,
                    description,
                    date,
                    location,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                alert("Event created successfully!");
                document.getElementById("createEventForm").reset();
                fetchEvents();
            } else {
                alert(`Failed to create event: ${data.message || data.error}`);
            }
        } catch (error) {
            console.error("Error creating event:", error);
            alert("An error occurred while creating the event.");
        }
    });

// --- Fetch Events ---
async function fetchEvents() {
    const eventListDiv = document.getElementById("eventList");
    eventListDiv.innerHTML = "Loading events...";
    try {
        const response = await fetch(`${API_BASE_URL}/events`);
        const data = await response.json();
        if (response.ok) {
            eventListDiv.innerHTML = "";
            if (data.length === 0) {
                eventListDiv.innerHTML = "<p>No events available.</p>";
                return;
            }
            data.forEach((event) => {
                const eventItem = document.createElement("div");
                eventItem.classList.add("event-item");
                eventItem.innerHTML = `
                <h3>${event.title}</h3>
                <p><strong>Description:</strong> ${event.description}</p>
                <p><strong>Date:</strong> ${new Date(
                    event.date
                ).toLocaleString()}</p>
                <p><strong>Location:</strong> ${event.location}</p>
                <button onclick="registerForEvent('${
                    event._id
                }')">Register</button>
            `;
                eventListDiv.appendChild(eventItem);
            });
        } else {
            eventListDiv.innerHTML = `<p>Error fetching events: ${
                data.message || data.error
            }</p>`;
        }
    } catch (error) {
        console.error("Error fetching events:", error);
        eventListDiv.innerHTML =
            "<p>An error occurred while fetching events.</p>";
    }
}

// --- Register for Event ---
async function registerForEvent(eventId) {
    const token = getToken();
    if (!token) {
        alert("Please log in to register for an event.");
        return;
    }

    try {
        const response = await fetch(
            `${API_BASE_URL}/registrations/${eventId}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        const data = await response.json();
        if (response.ok) {
            alert("Successfully registered for the event!");
            fetchMyRegistrations();
        } else {
            alert(`Registration failed: ${data.message || data.error}`);
        }
    } catch (error) {
        console.error("Error during event registration:", error);
        alert("An error occurred during event registration.");
    }
}

// --- Fetch My Registrations ---
async function fetchMyRegistrations() {
    const myRegistrationsDiv = document.getElementById("myRegistrations");
    const token = getToken();

    if (!token) {
        myRegistrationsDiv.innerHTML =
            "<p>Please log in to view your registrations.</p>";
        return;
    }

    myRegistrationsDiv.innerHTML = "Loading your registrations...";
    try {
        const response = await fetch(`${API_BASE_URL}/registrations/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        if (response.ok) {
            myRegistrationsDiv.innerHTML = "";
            if (data.length === 0) {
                myRegistrationsDiv.innerHTML =
                    "<p>You have no current registrations.</p>";
                return;
            }
            data.forEach((reg) => {
                const registrationItem = document.createElement("div");
                registrationItem.classList.add("registration-item");
                registrationItem.innerHTML = `
                <h3>${reg.event.title}</h3>
                <p><strong>Event Date:</strong> ${new Date(
                    reg.event.date
                ).toLocaleString()}</p>
                <p><strong>Registered On:</strong> ${new Date(
                    reg.registrationDate
                ).toLocaleString()}</p>
                <button onclick="cancelRegistration('${
                    reg._id
                }')">Cancel Registration</button>
            `;
                myRegistrationsDiv.appendChild(registrationItem);
            });
        } else {
            myRegistrationsDiv.innerHTML = `<p>Error fetching registrations: ${
                data.message || data.error
            }</p>`;
            if (response.status === 401) {
                // Unauthorized
                clearToken();
            }
        }
    } catch (error) {
        console.error("Error fetching registrations:", error);
        myRegistrationsDiv.innerHTML =
            "<p>An error occurred while fetching your registrations.</p>";
    }
}

// --- Cancel Registration ---
async function cancelRegistration(registrationId) {
    const token = getToken();
    if (!token) {
        alert("Please log in to cancel a registration.");
        return;
    }

    if (!confirm("Are you sure you want to cancel this registration?")) {
        return;
    }

    try {
        const response = await fetch(
            `${API_BASE_URL}/registrations/${registrationId}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        const data = await response.json();
        if (response.ok) {
            alert("Registration cancelled successfully!");
            fetchMyRegistrations();
        } else {
            alert(
                `Failed to cancel registration: ${data.message || data.error}`
            );
        }
    } catch (error) {
        console.error("Error cancelling registration:", error);
        alert("An error occurred while cancelling the registration.");
    }
}

// Initial fetch of events when the page loads
document.addEventListener("DOMContentLoaded", () => {
    fetchEvents();
    fetchMyRegistrations();
});
