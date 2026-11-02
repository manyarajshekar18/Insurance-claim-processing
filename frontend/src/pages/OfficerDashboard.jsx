import { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:8080";

function OfficerDashboard() {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedClaim, setSelectedClaim] = useState(null);
    const [error, setError] = useState("");
    const [reviewing, setReviewing] = useState(false);

    const token = localStorage.getItem("token");

    const loadClaims = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_BASE_URL}/api/officer/claims`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to load claims");
            }

            const data = await response.json();
            setClaims(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadClaims();
    }, []);

    const reviewClaim = async (decision) => {
        if (!selectedClaim) {
            return;
        }

        try {
            setReviewing(true);
            setError("");

            const response = await fetch(
                `${API_BASE_URL}/api/claims/${selectedClaim.id}/review?decision=${decision}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                const text = await response.text();
                throw new Error(
                    text || "Failed to review claim"
                );
            }

            setSelectedClaim(null);

            await loadClaims();

        } catch (err) {
            setError(err.message);
        } finally {
            setReviewing(false);
        }
    };

    const logout = () => {
        localStorage.clear();
        window.location.reload();
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "SUBMITTED":
                return "officer-status submitted";
            case "AI_ANALYZED":
                return "officer-status analyzed";
            case "MORE_INFORMATION_REQUIRED":
                return "officer-status information";
            case "UNDER_REVIEW":
                return "officer-status review";
            default:
                return "officer-status";
        }
    };

    return (
        <div className="officer-dashboard">

            <header className="officer-header">
                <div>
                    <h1>SecureLife</h1>
                    <span>Officer Portal</span>
                </div>

                <div className="officer-header-right">
                    <span>
                        {localStorage.getItem("email")}
                    </span>

                    <button onClick={logout}>
                        Logout
                    </button>
                </div>
            </header>

            <main className="officer-main">

                <section className="officer-welcome">
                    <div>
                        <p className="officer-label">
                            CLAIM OPERATIONS
                        </p>

                        <h2>Claim Review Queue</h2>

                        <p>
                            Review submitted insurance claims and make
                            informed decisions based on claim details,
                            documents and AI analysis.
                        </p>
                    </div>

                    <button
                        className="refresh-button"
                        onClick={loadClaims}
                    >
                        ↻ Refresh Queue
                    </button>
                </section>

                <section className="officer-summary">

                    <div className="officer-summary-card">
                        <span>Pending Claims</span>
                        <strong>{claims.length}</strong>
                    </div>

                    <div className="officer-summary-card">
                        <span>Submitted</span>
                        <strong>
                            {
                                claims.filter(
                                    claim =>
                                        claim.status === "SUBMITTED"
                                ).length
                            }
                        </strong>
                    </div>

                    <div className="officer-summary-card">
                        <span>AI Analyzed</span>
                        <strong>
                            {
                                claims.filter(
                                    claim =>
                                        claim.status === "AI_ANALYZED"
                                ).length
                            }
                        </strong>
                    </div>

                </section>

                {error && (
                    <div className="officer-error">
                        {error}
                    </div>
                )}

                <section className="officer-claims-section">

                    <div className="section-heading">
                        <div>
                            <h3>Claims Awaiting Review</h3>
                            <p>
                                Select a claim to inspect its details.
                            </p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="officer-empty">
                            Loading claims...
                        </div>
                    ) : claims.length === 0 ? (
                        <div className="officer-empty">
                            <h3>No pending claims</h3>
                            <p>
                                All claims have been reviewed.
                            </p>
                        </div>
                    ) : (
                        <div className="claim-table-wrapper">

                            <table className="claim-table">

                                <thead>
                                    <tr>
                                        <th>Claim</th>
                                        <th>Description</th>
                                        <th>Amount</th>
                                        <th>Policy</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {claims.map(claim => (

                                        <tr key={claim.id}>

                                            <td>
                                                <strong>
                                                    {claim.claimNumber}
                                                </strong>

                                                <small>
                                                    #{claim.id}
                                                </small>
                                            </td>

                                            <td>
                                                {claim.description}
                                            </td>

                                            <td>
                                                ₹
                                                {Number(
                                                    claim.claimAmount
                                                ).toLocaleString("en-IN")}
                                            </td>

                                            <td>
                                                {claim.policy?.policyNumber ||
                                                    "—"}
                                            </td>

                                            <td>
                                                <span
                                                    className={getStatusClass(
                                                        claim.status
                                                    )}
                                                >
                                                    {claim.status ===
                                                    "AI_ANALYZED"
                                                        ? "AI Analyzed"
                                                        : claim.status.replace(
                                                              /_/g,
                                                              " "
                                                          )}
                                                </span>
                                            </td>

                                            <td>
                                                <button
                                                    className="view-claim-button"
                                                    onClick={() =>
                                                        setSelectedClaim(
                                                            claim
                                                        )
                                                    }
                                                >
                                                    Review
                                                </button>
                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>
                    )}

                </section>

                {selectedClaim && (
                    <section className="officer-detail-card">

                        <div className="detail-header">
                            <div>
                                <p className="officer-label">
                                    CLAIM DETAILS
                                </p>

                                <h3>
                                    {selectedClaim.claimNumber}
                                </h3>
                            </div>

                            <button
                                className="close-detail"
                                onClick={() =>
                                    setSelectedClaim(null)
                                }
                            >
                                ×
                            </button>
                        </div>

                        <div className="claim-detail-grid">

                            <div>
                                <span>Claim Amount</span>
                                <strong>
                                    ₹
                                    {Number(
                                        selectedClaim.claimAmount
                                    ).toLocaleString("en-IN")}
                                </strong>
                            </div>

                            <div>
                                <span>Status</span>
                                <strong>
                                    {selectedClaim.status.replace(
                                        /_/g,
                                        " "
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>Policy Number</span>
                                <strong>
                                    {
                                        selectedClaim.policy
                                            ?.policyNumber
                                    }
                                </strong>
                            </div>

                            <div>
                                <span>Policy Type</span>
                                <strong>
                                    {
                                        selectedClaim.policy
                                            ?.policyType
                                    }
                                </strong>
                            </div>

                        </div>

                        <div className="claim-description">

                            <h4>Claim Description</h4>

                            <p>
                                {selectedClaim.description}
                            </p>

                        </div>

                        <div className="review-actions">

                            <button
                                className="approve-button"
                                disabled={reviewing}
                                onClick={() =>
                                    reviewClaim("APPROVED")
                                }
                            >
                                {reviewing
                                    ? "Processing..."
                                    : "Approve Claim"}
                            </button>

                            <button
                                className="reject-button"
                                disabled={reviewing}
                                onClick={() =>
                                    reviewClaim("REJECTED")
                                }
                            >
                                {reviewing
                                    ? "Processing..."
                                    : "Reject Claim"}
                            </button>

                            <button
                                className="info-button"
                                disabled={reviewing}
                                onClick={() =>
                                    reviewClaim(
                                        "MORE_INFORMATION_REQUIRED"
                                    )
                                }
                            >
                                {reviewing
                                    ? "Processing..."
                                    : "Request Information"}
                            </button>

                        </div>

                    </section>
                )}

            </main>

            <footer className="officer-footer">
                SecureLife Insurance Services · Officer Portal
            </footer>

        </div>
    );
}

export default OfficerDashboard;