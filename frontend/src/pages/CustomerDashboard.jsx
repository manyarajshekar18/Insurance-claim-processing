import { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:8080";

function CustomerDashboard() {
    const [policies, setPolicies] = useState([]);
    const [claims, setClaims] = useState([]);
    const [selectedClaim, setSelectedClaim] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    const [claimNumber, setClaimNumber] = useState("");
    const [description, setDescription] = useState("");
    const [claimAmount, setClaimAmount] = useState("");

    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    const authHeaders = {
        Authorization: `Bearer ${token}`
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const policyResponse = await fetch(
                `${API_BASE_URL}/api/policies/user/${userId}`,
                {
                    headers: authHeaders
                }
            );

            if (!policyResponse.ok) {
                throw new Error("Unable to load policies");
            }

            const policyData = await policyResponse.json();
            setPolicies(policyData);

            let allClaims = [];

            for (const policy of policyData) {
                const claimResponse = await fetch(
                    `${API_BASE_URL}/api/claims/policy/${policy.id}`,
                    {
                        headers: authHeaders
                    }
                );

                if (claimResponse.ok) {
                    const claimData = await claimResponse.json();
                    allClaims = [...allClaims, ...claimData];
                }
            }

            setClaims(allClaims);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const openClaimDetails = async (claim) => {
        try {
            setError("");
            setMessage("");

            const response = await fetch(
                `${API_BASE_URL}/api/claims/${claim.id}`,
                {
                    headers: authHeaders
                }
            );

            if (!response.ok) {
                throw new Error("Unable to load claim details");
            }

            const data = await response.json();
            setSelectedClaim(data);

            await loadDocuments(data.id);
        } catch (err) {
            setError(err.message);
        }
    };

    const loadDocuments = async (claimId) => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/claims/${claimId}/documents`,
                {
                    headers: authHeaders
                }
            );

            if (response.ok) {
                const data = await response.json();
                setDocuments(data);
            } else {
                setDocuments([]);
            }
        } catch {
            setDocuments([]);
        }
    };

    const submitClaim = async (e) => {
        e.preventDefault();

        if (!policies.length) {
            setError("No active policy available.");
            return;
        }

        try {
            setError("");
            setMessage("");

            const params = new URLSearchParams();

            params.append("claimNumber", claimNumber);
            params.append("description", description);
            params.append("claimAmount", claimAmount);
            params.append("policyId", policies[0].id);

            const response = await fetch(
                `${API_BASE_URL}/api/claims?${params.toString()}`,
                {
                    method: "POST",
                    headers: authHeaders
                }
            );

            if (!response.ok) {
                throw new Error("Claim submission failed");
            }

            setClaimNumber("");
            setDescription("");
            setClaimAmount("");

            setMessage("Your claim has been submitted successfully.");

            await loadDashboard();
        } catch (err) {
            setError(err.message);
        }
    };

    const uploadDocument = async () => {
        if (!selectedFile || !selectedClaim) {
            setError("Please select a document first.");
            return;
        }

        try {
            setUploading(true);
            setError("");
            setMessage("");

            const formData = new FormData();
            formData.append("file", selectedFile);

            const response = await fetch(
                `${API_BASE_URL}/api/claims/${selectedClaim.id}/documents`,
                {
                    method: "POST",
                    headers: authHeaders,
                    body: formData
                }
            );

            if (!response.ok) {
                throw new Error("Document upload failed");
            }

            setSelectedFile(null);
            setMessage("Document uploaded successfully.");

            await loadDocuments(selectedClaim.id);
        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    const getStatusLabel = (status) => {
        if (!status) return "SUBMITTED";

        switch (status) {
            case "SUBMITTED":
                return "Submitted";
            case "UNDER_REVIEW":
                return "Under Review";
            case "AI_ANALYZED":
                return "Under Review";
            case "MORE_INFORMATION_REQUIRED":
                return "More Information Required";
            case "APPROVED":
                return "Approved";
            case "REJECTED":
                return "Rejected";
            default:
                return status.replaceAll("_", " ");
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "APPROVED":
                return "status-approved";
            case "REJECTED":
                return "status-rejected";
            case "UNDER_REVIEW":
            case "AI_ANALYZED":
                return "status-review";
            case "MORE_INFORMATION_REQUIRED":
                return "status-warning";
            default:
                return "status-submitted";
        }
    };

    const formatAmount = (amount) => {
        return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
    };

    const completedClaims = claims.filter(
        (claim) =>
            claim.status === "APPROVED" ||
            claim.status === "REJECTED"
    ).length;

    const currentPolicy = policies[0];

    return (
        <div className="customer-dashboard">

            {/* HEADER */}
            <header className="dashboard-header">
                <div className="brand">
                    <div className="brand-mark">S</div>
                    <div>
                        <h2>SecureLife</h2>
                        <span>Insurance Services</span>
                    </div>
                </div>

                <nav className="dashboard-nav">
                    <a href="#overview">Overview</a>
                    <a href="#policy">My Policy</a>
                    <a href="#claims">Claims</a>
                    <a href="#support">Support</a>
                </nav>

                <div className="customer-profile">
                    <div className="profile-circle">
                        {localStorage
                            .getItem("email")
                            ?.charAt(0)
                            .toUpperCase()}
                    </div>
                    <span>
                        {localStorage.getItem("email")}
                    </span>
                </div>
            </header>

            {/* HERO */}
            <section className="dashboard-hero" id="overview">
                <div className="hero-content">
                    <span className="hero-label">
                        CUSTOMER INSURANCE PORTAL
                    </span>

                    <h1>
                        Protection that
                        <br />
                        works for you.
                    </h1>

                    <p>
                        Manage your policy, submit claims and
                        track your insurance requests from one place.
                    </p>

                    <a href="#claims" className="hero-button">
                        Manage Claims
                    </a>
                </div>

                <div className="hero-image">
                    <img
                        src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=85"
                        alt="Insurance consultation"
                    />
                </div>
            </section>

            <main className="dashboard-content">

                {/* ALERTS */}
                {message && (
                    <div className="success-message">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {/* SUMMARY */}
                <section className="summary-grid">

                    <div className="summary-card">
                        <div className="summary-icon orange">
                            ✓
                        </div>
                        <div>
                            <span>Policy Status</span>
                            <strong>
                                {currentPolicy ? "Active" : "No Policy"}
                            </strong>
                        </div>
                    </div>

                    <div className="summary-card">
                        <div className="summary-icon blue">
                            ₹
                        </div>
                        <div>
                            <span>Coverage</span>
                            <strong>
                                {currentPolicy
                                    ? formatAmount(
                                          currentPolicy.coverageAmount
                                      )
                                    : "₹0"}
                            </strong>
                        </div>
                    </div>

                    <div className="summary-card">
                        <div className="summary-icon red">
                            #
                        </div>
                        <div>
                            <span>Total Claims</span>
                            <strong>{claims.length}</strong>
                        </div>
                    </div>

                    <div className="summary-card">
                        <div className="summary-icon green">
                            ✓
                        </div>
                        <div>
                            <span>Completed</span>
                            <strong>{completedClaims}</strong>
                        </div>
                    </div>

                </section>

                {/* POLICY */}
                <section className="dashboard-section" id="policy">

                    <div className="section-heading">
                        <div>
                            <span className="section-label">
                                YOUR COVERAGE
                            </span>
                            <h2>Policy Details</h2>
                        </div>
                    </div>

                    {loading ? (
                        <div className="empty-state">
                            Loading policy information...
                        </div>
                    ) : currentPolicy ? (
                        <div className="policy-card">

                            <div className="policy-top">
                                <div>
                                    <span>Policy Number</span>
                                    <strong>
                                        {currentPolicy.policyNumber}
                                    </strong>
                                </div>

                                <span className="active-badge">
                                    ACTIVE
                                </span>
                            </div>

                            <div className="policy-details-grid">

                                <div>
                                    <span>Policy Type</span>
                                    <strong>
                                        {currentPolicy.policyType}
                                    </strong>
                                </div>

                                <div>
                                    <span>Coverage Amount</span>
                                    <strong>
                                        {formatAmount(
                                            currentPolicy.coverageAmount
                                        )}
                                    </strong>
                                </div>

                                <div>
                                    <span>Start Date</span>
                                    <strong>
                                        {currentPolicy.startDate || "-"}
                                    </strong>
                                </div>

                                <div>
                                    <span>End Date</span>
                                    <strong>
                                        {currentPolicy.endDate || "-"}
                                    </strong>
                                </div>

                            </div>
                        </div>
                    ) : (
                        <div className="empty-state">
                            No policy information available.
                        </div>
                    )}
                </section>

                {/* CLAIMS */}
                <section className="dashboard-section" id="claims">

                    <div className="section-heading">
                        <div>
                            <span className="section-label">
                                CLAIM MANAGEMENT
                            </span>
                            <h2>Claims</h2>
                        </div>
                    </div>

                    <div className="claims-layout">

                        {/* SUBMIT CLAIM */}
                        <div className="claim-form-card">

                            <h3>Submit a New Claim</h3>

                            <p>
                                Provide your claim details and submit
                                your request for processing.
                            </p>

                            <form onSubmit={submitClaim}>

                                <div className="form-group">
                                    <label>Claim Number</label>
                                    <input
                                        type="text"
                                        value={claimNumber}
                                        onChange={(e) =>
                                            setClaimNumber(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Example: CLM1003"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Claim Amount</label>
                                    <input
                                        type="number"
                                        value={claimAmount}
                                        onChange={(e) =>
                                            setClaimAmount(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter amount"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) =>
                                            setDescription(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Describe your claim..."
                                        rows="4"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="primary-button"
                                >
                                    Submit Claim
                                </button>

                            </form>
                        </div>

                        {/* CLAIM HISTORY */}
                        <div className="claim-history-card">

                            <div className="claim-history-header">
                                <div>
                                    <h3>Claim History</h3>
                                    <p>
                                        View and track your submitted claims.
                                    </p>
                                </div>
                            </div>

                            {claims.length === 0 ? (
                                <div className="empty-state">
                                    No claims submitted yet.
                                </div>
                            ) : (
                                <div className="claims-table-wrapper">

                                    <table className="claims-table">

                                        <thead>
                                            <tr>
                                                <th>Claim</th>
                                                <th>Description</th>
                                                <th>Amount</th>
                                                <th>Status</th>
                                                <th></th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {claims.map((claim) => (
                                                <tr key={claim.id}>

                                                    <td>
                                                        <strong>
                                                            {claim.claimNumber}
                                                        </strong>
                                                    </td>

                                                    <td>
                                                        {claim.description}
                                                    </td>

                                                    <td>
                                                        {formatAmount(
                                                            claim.claimAmount
                                                        )}
                                                    </td>

                                                    <td>
                                                        <span
                                                            className={`claim-status ${getStatusClass(
                                                                claim.status
                                                            )}`}
                                                        >
                                                            {getStatusLabel(
                                                                claim.status
                                                            )}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        <button
                                                            className="view-claim-button"
                                                            onClick={() =>
                                                                openClaimDetails(
                                                                    claim
                                                                )
                                                            }
                                                        >
                                                            View Details
                                                        </button>
                                                    </td>

                                                </tr>
                                            ))}
                                        </tbody>

                                    </table>

                                </div>
                            )}

                        </div>
                    </div>
                </section>

                {/* CLAIM DETAILS */}
                {selectedClaim && (
                    <section className="claim-details-section">

                        <div className="section-heading">
                            <div>
                                <span className="section-label">
                                    CLAIM INFORMATION
                                </span>

                                <h2>
                                    {selectedClaim.claimNumber}
                                </h2>
                            </div>

                            <button
                                className="close-details-button"
                                onClick={() => {
                                    setSelectedClaim(null);
                                    setDocuments([]);
                                }}
                            >
                                Close
                            </button>
                        </div>

                        <div className="claim-details-grid">

                            {/* DETAILS */}
                            <div className="claim-detail-card">

                                <h3>Claim Details</h3>

                                <div className="detail-row">
                                    <span>Claim Number</span>
                                    <strong>
                                        {selectedClaim.claimNumber}
                                    </strong>
                                </div>

                                <div className="detail-row">
                                    <span>Claim Amount</span>
                                    <strong>
                                        {formatAmount(
                                            selectedClaim.claimAmount
                                        )}
                                    </strong>
                                </div>

                                <div className="detail-row">
                                    <span>Status</span>
                                    <span
                                        className={`claim-status ${getStatusClass(
                                            selectedClaim.status
                                        )}`}
                                    >
                                        {getStatusLabel(
                                            selectedClaim.status
                                        )}
                                    </span>
                                </div>

                                <div className="detail-description">
                                    <span>Description</span>
                                    <p>
                                        {selectedClaim.description}
                                    </p>
                                </div>

                            </div>

                            {/* TIMELINE */}
                            <div className="claim-detail-card">

                                <h3>Claim Progress</h3>

                                <div className="claim-timeline">

                                    <div className="timeline-item completed">
                                        <div className="timeline-dot">
                                            ✓
                                        </div>

                                        <div>
                                            <strong>
                                                Claim Submitted
                                            </strong>
                                            <span>
                                                Your claim was received.
                                            </span>
                                        </div>
                                    </div>

                                    <div
                                        className={`timeline-item ${
                                            [
                                                "UNDER_REVIEW",
                                                "AI_ANALYZED",
                                                "MORE_INFORMATION_REQUIRED",
                                                "APPROVED",
                                                "REJECTED"
                                            ].includes(
                                                selectedClaim.status
                                            )
                                                ? "completed"
                                                : ""
                                        }`}
                                    >
                                        <div className="timeline-dot">
                                            2
                                        </div>

                                        <div>
                                            <strong>
                                                Under Review
                                            </strong>
                                            <span>
                                                Your claim is being reviewed.
                                            </span>
                                        </div>
                                    </div>

                                    <div
                                        className={`timeline-item ${
                                            [
                                                "APPROVED",
                                                "REJECTED"
                                            ].includes(
                                                selectedClaim.status
                                            )
                                                ? "completed"
                                                : ""
                                        }`}
                                    >
                                        <div className="timeline-dot">
                                            3
                                        </div>

                                        <div>
                                            <strong>
                                                Final Decision
                                            </strong>
                                            <span>
                                                Claim approval or rejection.
                                            </span>
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>

                        {/* DOCUMENTS */}
                        <div className="documents-card">

                            <div className="documents-header">
                                <div>
                                    <h3>Claim Documents</h3>
                                    <p>
                                        Upload supporting documents for this claim.
                                    </p>
                                </div>
                            </div>

                            <div className="upload-area">

                                <input
                                    type="file"
                                    id="claim-document"
                                    onChange={(e) =>
                                        setSelectedFile(
                                            e.target.files[0]
                                        )
                                    }
                                />

                                <label htmlFor="claim-document">
                                    {selectedFile
                                        ? selectedFile.name
                                        : "Choose a document"}
                                </label>

                                <button
                                    onClick={uploadDocument}
                                    disabled={
                                        uploading ||
                                        !selectedFile
                                    }
                                    className="primary-button"
                                >
                                    {uploading
                                        ? "Uploading..."
                                        : "Upload Document"}
                                </button>

                            </div>

                            <div className="document-list">

                                {documents.length === 0 ? (
                                    <div className="empty-state">
                                        No documents uploaded for this claim.
                                    </div>
                                ) : (
                                    documents.map((document) => (
                                        <div
                                            className="document-item"
                                            key={document.id}
                                        >
                                            <div className="document-icon">
                                                DOC
                                            </div>

                                            <div>
                                                <strong>
                                                    {document.fileName ||
                                                        document.originalFileName ||
                                                        "Uploaded Document"}
                                                </strong>

                                                <span>
                                                    Document uploaded
                                                    successfully
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}

                            </div>
                        </div>

                    </section>
                )}

                {/* SUPPORT */}
                <section className="support-section" id="support">

                    <div>
                        <span className="section-label">
                            NEED HELP?
                        </span>

                        <h2>
                            We're here when you need us.
                        </h2>

                        <p>
                            Contact our support team for assistance
                            with your policy or claim.
                        </p>
                    </div>

                    <button className="support-button">
                        Contact Support
                    </button>

                </section>

            </main>

            {/* FOOTER */}
            <footer className="dashboard-footer">
                <div>
                    <strong>SecureLife</strong>
                    <span>
                        Reliable insurance services for every stage of life.
                    </span>
                </div>

                <span>
                    © 2026 SecureLife Insurance Services
                </span>
            </footer>

        </div>
    );
}

export default CustomerDashboard;