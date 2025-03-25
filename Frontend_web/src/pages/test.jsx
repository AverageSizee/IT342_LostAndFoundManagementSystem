import React, { useEffect, useState } from "react";
import axios from "axios";

export default function SessionUserPage() {
    const [userId, setUserId] = useState("");

    useEffect(() => {
        axios.get("http://localhost:8080/user/getsessionuser", {
            withCredentials: true // Ensure cookies are sent
        })
        .then(response => setUserId(response.data))
        .catch(error => console.error("Error fetching session data:", error));
    }, []);

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Session User</h1>
            <h2>{userId ? `User ID: ${userId}` : "No user found in session"}</h2>
        </div>
    );
}