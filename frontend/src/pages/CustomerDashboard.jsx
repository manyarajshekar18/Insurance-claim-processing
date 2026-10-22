import { useState } from "react";

function CustomerDashboard() {
    const email = localStorage.getItem("email");
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    const [policy, setPolicy] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const [showClaimForm, setShowClaimForm] = useState(false);
    const [claimNumber, setClaimNumber] = useState("");
    const [description, setDescription] = useState("");
    const [claimAmount, setClaimAmount] = useState("");
    const [claimLoading, setClaimLoading] = useState(false);
    const [claimMessage, setClaimMessage] = useState("");

    const handleViewPolicy = async () => {
        setLoading(true);
        setMessage("");
        setPolicy(null);

        try {
            const response = await fetch(
                `http://localhost:8080/api/policies/user/${userId}`,
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

            setPolicy(data[0]);
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateClaim = async (e) => {
        e.preventDefault();

        setClaimLoading(true);
        setClaimMessage("");

        try {
            if (!policy) {
                throw new Error("Please view your policy first.");
            }

            const params = new URLSearchParams({
                claimNumber,
                description,
                claimAmount,
                policyId: policy.id
            });

            const response = await fetch(
                `http://localhost:8080/api/claims?${params.toString()}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Unable to create claim");
            }

            await response.json();

            setClaimMessage("Claim submitted successfully.");

            setClaimNumber("");
            setDescription("");
            setClaimAmount("");
        } catch (error) {
            setClaimMessage(error.message);
        } finally {
            setClaimLoading(false);
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
                                {loading ? "Loading..." : "View Policy"}
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

                            <button
                                className="btn btn-success"
                                onClick={() => {
                                    setShowClaimForm(!showClaimForm);
                                    setClaimMessage("");
                                }}
                            >
                                {showClaimForm ? "Close" : "Create Claim"}
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

            {showClaimForm && (
                <div className="card shadow mt-4">
                    <div className="card-body">

                        <h4 className="mb-4">
                            Submit Insurance Claim
                        </h4>

                        <form onSubmit={handleCreateClaim}>

                            <div className="mb-3">
                                <label className="form-label">
                                    Claim Number
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Example: CLM1002"
                                    value={claimNumber}
                                    onChange={(e) =>
                                        setClaimNumber(e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">
                                    Claim Description
                                </label>

                                <textarea
                                    className="form-control"
                                    rows="4"
                                    placeholder="Describe your claim"
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">
                                    Claim Amount
                                </label>

                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Example: 75000"
                                    value={claimAmount}
                                    onChange={(e) =>
                                        setClaimAmount(e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">
                                    Policy
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    value={
                                        policy
                                            ? policy.policyNumber
                                            : "Click View Policy first"
                                    }
                                    disabled
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-success"
                                disabled={claimLoading}
                            >
                                {claimLoading
                                    ? "Submitting..."
                                    : "Submit Claim"}
                            </button>

                        </form>

                        {claimMessage && (
                            <div className="alert alert-info mt-3">
                                {claimMessage}
                            </div>
                        )}

                    </div>
                </div>
            )}

        </div>
    );
}

export default CustomerDashboard;