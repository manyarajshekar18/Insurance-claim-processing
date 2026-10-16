import { useState } from "react";

function CustomerDashboard() {
    const email = localStorage.getItem("email");
    const token = localStorage.getItem("token");

    const [policy, setPolicy] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleViewPolicy = async () => {
        setLoading(true);
        setMessage("");
        setPolicy(null);

        try {
            const response = await fetch(
                `http://localhost:8080/api/policies/user/${localStorage.getItem("userId")}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Unable to fetch policy");
            }

            const data = await response.json();

            setPolicy(data);
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2>Customer Dashboard</h2>
                    <p className="text-muted mb-0">
                        Welcome, {email}
                    </p>
                </div>

                <button
                    className="btn btn-danger"
                    onClick={() => {
                        localStorage.clear();
                        window.location.reload();
                    }}
                >
                    Logout
                </button>
            </div>

            <div className="row g-4">

                <div className="col-md-4">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <h5>My Policy</h5>

                            <p className="text-muted">
                                View your active insurance policy.
                            </p>

                            <button
                                className="btn btn-primary"
                                onClick={handleViewPolicy}
                                disabled={loading}
                            >
                                {loading
                                    ? "Loading..."
                                    : "View Policy"}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <h5>Submit Claim</h5>

                            <p className="text-muted">
                                Create a new insurance claim.
                            </p>

                            <button className="btn btn-success">
                                Create Claim
                            </button>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <h5>Track Claims</h5>

                            <p className="text-muted">
                                Check your claim status and AI analysis.
                            </p>

                            <button className="btn btn-info">
                                Track Claims
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            {message && (
                <div className="alert alert-danger mt-4">
                    {message}
                </div>
            )}

            {policy && (
                <div className="card shadow mt-4">
                    <div className="card-body">

                        <h4 className="mb-4">
                            My Policy Details
                        </h4>

                        <p>
                            <strong>Policy Number:</strong>{" "}
                            {policy.policyNumber}
                        </p>

                        <p>
                            <strong>Policy Type:</strong>{" "}
                            {policy.policyType}
                        </p>

                        <p>
                            <strong>Coverage Amount:</strong>{" "}
                            ₹{policy.coverageAmount}
                        </p>

                        <p>
                            <strong>Status:</strong>{" "}
                            {policy.status}
                        </p>

                    </div>
                </div>
            )}

        </div>
    );
}

export default CustomerDashboard;