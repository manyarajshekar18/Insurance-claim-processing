import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CustomerDashboard from "./pages/CustomerDashboard";

function App() {
    const [page, setPage] = useState("login");
    const [role, setRole] = useState(localStorage.getItem("role"));

    if (role === "CUSTOMER") {
        return <CustomerDashboard />;
    }

    if (role) {
        return (
            <div className="container mt-5">
                <h2>Insurance Claim Dashboard</h2>
                <p>Logged in as: {localStorage.getItem("email")}</p>
                <p>Role: {role}</p>

                <button
                    className="btn btn-danger"
                    onClick={() => {
                        localStorage.clear();
                        setRole(null);
                    }}
                >
                    Logout
                </button>
            </div>
        );
    }

    return (
        <>
            {page === "login" ? (
                <Login onLoginSuccess={setRole} />
            ) : (
                <Register />
            )}

            <div className="text-center mt-3">
                {page === "login" ? (
                    <>
                        Don't have an account?{" "}
                        <button
                            className="btn btn-link"
                            onClick={() => setPage("register")}
                        >
                            Register
                        </button>
                    </>
                ) : (
                    <>
                        Already have an account?{" "}
                        <button
                            className="btn btn-link"
                            onClick={() => setPage("login")}
                        >
                            Login
                        </button>
                    </>
                )}
            </div>
        </>
    );
}

export default App;