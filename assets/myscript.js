// write a script to check if user  is logged in and is an admin
document.addEventListener("DOMContentLoaded", () => {
  fetch("/api/auth/me", {
    method: "GET",
    credentials: "include", // 👈 important: sends the cookie
  })
    .then(res => {
      if (!res.ok) throw new Error("Not logged in");
      return res.json();
    })
    .then(response => {
      // Hide the sign-in section if logged in
      if (response.data.user.role !== "admin") {
        window.location.href = "./";
      }
    })
    .catch(() => {
      window.location.href = "./";
    });
});
