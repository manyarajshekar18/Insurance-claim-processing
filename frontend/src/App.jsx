import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CustomerDashboard from "./pages/CustomerDashboard";
import OfficerDashboard from "./pages/OfficerDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
    const [page, setPage] = useState("login");
    const [role, setRole] = useState(
        localStorage.getItem("role")
    );

    if (role === "CUSTOMER") {
        return <CustomerDashboard />;
    }

    if (role === "OFFICER") {
        return <OfficerDashboard />;
    }

    if (role === "ADMIN") {
        return <AdminDashboard />;
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