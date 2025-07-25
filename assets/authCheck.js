// auth.js
document.addEventListener("DOMContentLoaded", () => {
  fetch("/api/auth/me", {
    method: "GET",
    credentials: "include", // Important for cookies
  })
    .then(res => res.json())
    .then(data => {
      // Dispatch a custom event with the auth data
      window.dispatchEvent(new CustomEvent("authLoaded", { detail: data }));
    })
    .catch(err => {
      console.error("Error fetching auth:", err);
    });
});

