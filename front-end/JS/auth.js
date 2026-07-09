const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

function isLoggedIn() {
    return !!token;
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "login.html";
}