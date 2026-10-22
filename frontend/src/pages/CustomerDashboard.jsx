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

    const [claims, setClaims] = useState([]);
    const [claimsLoading, setClaimsLoading] = useState(false);
    const [claimsMessage, setClaimsMessage] = useState("");

    const handleViewPolicy = async () => {
        setLoading(true);
        setMessage("");

        try {
            const response = await fetch(
                `http://localhost:8080/api/policies/user/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Unable to fetch policy");
            }

            const data = await response.json();
            setPolicy(data[0] || null);

            if (!data[0]) {
                setMessage("No active policy found.");
            }
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateClaim = async (e) => {
        e.preventDefault();

        if (!policy) {
            setClaimMessage("Please view your policy before submitting a claim.");
            return;
        }

        setClaimLoading(true);
        setClaimMessage("");

        try {
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
                throw new Error("Unable to submit claim");
            }

            await response.json();

            setClaimMessage(
                "Your claim has been submitted successfully."
            );

            setClaimNumber("");
            setDescription("");
            setClaimAmount("");
        } catch (error) {
            setClaimMessage(error.message);
        } finally {
            setClaimLoading(false);
        }
    };

    const handleTrackClaims = async () => {
        setClaimsLoading(true);
        setClaimsMessage("");
        setClaims([]);

        try {
            if (!policy) {
                throw new Error("Please view your policy first.");
            }

            const response = await fetch(
                `http://localhost:8080/api/claims/policy/${policy.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Unable to fetch claims");
            }

            const data = await response.json();
            setClaims(data);
        } catch (error) {
            setClaimsMessage(error.message);
        } finally {
            setClaimsLoading(false);
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "APPROVED":
                return "status-approved";

            case "REJECTED":
                return "status-rejected";

            case "UNDER_REVIEW":
                return "status-review";

            case "AI_ANALYZED":
                return "status-review";

            case "MORE_INFORMATION_REQUIRED":
                return "status-more";

            default:
                return "status-submitted";
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "UNDER_REVIEW":
                return "Under Review";

            case "AI_ANALYZED":
                return "Under Review";

            case "MORE_INFORMATION_REQUIRED":
                return "Information Required";

            case "APPROVED":
                return "Approved";

            case "REJECTED":
                return "Rejected";

            case "SUBMITTED":
                return "Submitted";

            default:
                return status || "Submitted";
        }
    };

    const totalClaims = claims.length;

    const approvedClaims = claims.filter(
        (claim) => claim.status === "APPROVED"
    ).length;

    const activeClaims = claims.filter(
        (claim) =>
            claim.status !== "APPROVED" &&
            claim.status !== "REJECTED"
    ).length;

    return (
        <div className="insurance-dashboard">

            {/* HEADER */}

            <header className="main-header">

                <div className="header-container">

                    <div className="company-brand">

                        <div className="brand-mark">
                            <span></span>
                            <span></span>
                        </div>

                        <div>
                            <h2>SecureLife</h2>
                            <p>Insurance Services</p>
                        </div>

                    </div>

                    <nav className="main-navigation">
                        <a href="#overview">Overview</a>
                        <a href="#policy">My Policy</a>
                        <a href="#claims">Claims</a>
                        <a href="#support">Support</a>
                    </nav>

                    <div className="header-user">

                        <div className="profile-circle">
                            {email
                                ? email.charAt(0).toUpperCase()
                                : "U"}
                        </div>

                        <div className="profile-details">
                            <strong>
                                {email || "Customer"}
                            </strong>
                            <span>Policy Holder</span>
                        </div>

                        <button
                            className="logout-button"
                            onClick={() => {
                                localStorage.clear();
                                window.location.reload();
                            }}
                        >
                            Sign out
                        </button>

                    </div>

                </div>

            </header>

            <main>

                {/* HERO */}

                <section className="hero-section" id="overview">

                    <div className="hero-container">

                        <div className="hero-content">

                            <span className="hero-label">
                                CUSTOMER PORTAL
                            </span>

                            <h1>
                                Protection that
                                <br />
                                <span>works for you.</span>
                            </h1>

                            <p>
                                Manage your insurance policy, submit claims,
                                and stay updated on your requests from one
                                secure place.
                            </p>

                            <div className="hero-actions">

                                <button
                                    className="primary-button"
                                    onClick={handleViewPolicy}
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Loading..."
                                        : "View My Policy"}
                                </button>

                                <button
                                    className="secondary-button"
                                    onClick={() => {
                                        setShowClaimForm(true);
                                        setClaimMessage("");
                                    }}
                                >
                                    Submit a Claim
                                </button>

                            </div>

                        </div>

                        <div className="hero-image-wrapper">
                            <div className="hero-image"></div>

                            <div className="hero-image-card">

                                <span className="small-label">
                                    YOUR PROTECTION
                                </span>

                                <strong>
                                    Secure & Reliable
                                </strong>

                                <span>
                                    Insurance coverage when you need it.
                                </span>

                            </div>

                        </div>

                    </div>

                </section>

                {/* ERROR MESSAGE */}

                {message && (
                    <div className="message-container">
                        <div className="alert-box error">
                            {message}
                        </div>
                    </div>
                )}

                {/* QUICK SUMMARY */}

                <section className="dashboard-content">

                    <div className="section-heading">

                        <div>
                            <span className="section-label">
                                ACCOUNT OVERVIEW
                            </span>

                            <h2>Your insurance at a glance</h2>

                            <p>
                                Important information about your coverage
                                and claims.
                            </p>
                        </div>

                    </div>

                    <div className="summary-grid">

                        <div className="summary-card">

                            <div className="summary-icon policy-icon">
                                P
                            </div>

                            <div>
                                <span>Policy Status</span>

                                <strong>
                                    {policy
                                        ? policy.status || "Active"
                                        : "Active"}
                                </strong>
                            </div>

                        </div>

                        <div className="summary-card">

                            <div className="summary-icon coverage-icon">
                                ₹
                            </div>

                            <div>
                                <span>Coverage</span>

                                <strong>
                                    {policy
                                        ? `₹${Number(
                                            policy.coverageAmount
                                        ).toLocaleString("en-IN")}`
                                        : "View policy"}
                                </strong>
                            </div>

                        </div>

                        <div className="summary-card">

                            <div className="summary-icon claim-icon">
                                C
                            </div>

                            <div>
                                <span>Claims</span>

                                <strong>
                                    {totalClaims}
                                </strong>
                            </div>

                        </div>

                        <div className="summary-card">

                            <div className="summary-icon approved-icon">
                                ✓
                            </div>

                            <div>
                                <span>Completed</span>

                                <strong>
                                    {approvedClaims}
                                </strong>
                            </div>

                        </div>

                    </div>

                </section>

                {/* POLICY */}

                {policy && (
                    <section
                        className="dashboard-content"
                        id="policy"
                    >

                        <div className="section-heading policy-heading">

                            <div>
                                <span className="section-label">
                                    POLICY DETAILS
                                </span>

                                <h2>My insurance policy</h2>

                                <p>
                                    Your current policy and coverage
                                    information.
                                </p>
                            </div>

                            <span className="active-policy-badge">
                                Active Policy
                            </span>

                        </div>

                        <div className="policy-card">

                            <div className="policy-card-header">

                                <div>
                                    <span>POLICY NUMBER</span>
                                    <strong>
                                        {policy.policyNumber}
                                    </strong>
                                </div>

                                <div className="policy-status">
                                    Active
                                </div>

                            </div>

                            <div className="policy-details">

                                <div>
                                    <span>Policy Type</span>
                                    <strong>
                                        {policy.policyType}
                                    </strong>
                                </div>

                                <div>
                                    <span>Coverage Amount</span>
                                    <strong>
                                        ₹
                                        {Number(
                                            policy.coverageAmount
                                        ).toLocaleString("en-IN")}
                                    </strong>
                                </div>

                                <div>
                                    <span>Start Date</span>
                                    <strong>
                                        {policy.startDate || "—"}
                                    </strong>
                                </div>

                                <div>
                                    <span>End Date</span>
                                    <strong>
                                        {policy.endDate || "—"}
                                    </strong>
                                </div>

                            </div>

                        </div>

                    </section>
                )}

                {/* CLAIM ACTIONS */}

                <section
                    className="dashboard-content"
                    id="claims"
                >

                    <div className="section-heading">

                        <div>
                            <span className="section-label">
                                CLAIM MANAGEMENT
                            </span>

                            <h2>Manage your claims</h2>

                            <p>
                                Submit a new claim or check the status
                                of your existing requests.
                            </p>
                        </div>

                    </div>

                    <div className="claim-action-grid">

                        <div className="claim-action-card submit-card">

                            <div className="claim-card-content">

                                <span className="card-label">
                                    NEW CLAIM
                                </span>

                                <h3>
                                    Need to make a claim?
                                </h3>

                                <p>
                                    Submit your claim details and we will
                                    process your request.
                                </p>

                                <button
                                    className="orange-button"
                                    onClick={() => {
                                        setShowClaimForm(
                                            !showClaimForm
                                        );
                                        setClaimMessage("");
                                    }}
                                >
                                    {showClaimForm
                                        ? "Close Form"
                                        : "Submit a Claim"}
                                </button>

                            </div>

                            <div className="claim-card-shape"></div>

                        </div>

                        <div className="claim-action-card track-card">

                            <div className="claim-card-content">

                                <span className="card-label">
                                    CLAIM STATUS
                                </span>

                                <h3>
                                    Track your requests
                                </h3>

                                <p>
                                    View your submitted claims and
                                    current processing status.
                                </p>

                                <button
                                    className="dark-button"
                                    onClick={handleTrackClaims}
                                    disabled={claimsLoading}
                                >
                                    {claimsLoading
                                        ? "Loading..."
                                        : "View Claims"}
                                </button>

                            </div>

                        </div>

                    </div>

                </section>

                {/* CLAIM FORM */}

                {showClaimForm && (
                    <section className="dashboard-content">

                        <div className="claim-form-card">

                            <div className="form-header">

                                <div>
                                    <span className="section-label">
                                        NEW REQUEST
                                    </span>

                                    <h2>
                                        Submit an insurance claim
                                    </h2>

                                    <p>
                                        Provide the details below to
                                        submit your claim.
                                    </p>
                                </div>

                                <button
                                    className="close-form"
                                    onClick={() =>
                                        setShowClaimForm(false)
                                    }
                                >
                                    ×
                                </button>

                            </div>

                            <form onSubmit={handleCreateClaim}>

                                <div className="form-row">

                                    <div className="form-field">

                                        <label>
                                            Claim Number
                                        </label>

                                        <input
                                            type="text"
                                            placeholder="Example: CLM1003"
                                            value={claimNumber}
                                            onChange={(e) =>
                                                setClaimNumber(
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />

                                    </div>

                                    <div className="form-field">

                                        <label>
                                            Claim Amount
                                        </label>

                                        <input
                                            type="number"
                                            placeholder="Example: 75000"
                                            value={claimAmount}
                                            onChange={(e) =>
                                                setClaimAmount(
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />

                                    </div>

                                </div>

                                <div className="form-field">

                                    <label>
                                        Claim Description
                                    </label>

                                    <textarea
                                        rows="5"
                                        placeholder="Please describe the incident and provide relevant details..."
                                        value={description}
                                        onChange={(e) =>
                                            setDescription(
                                                e.target.value
                                            )
                                        }
                                        required
                                    />

                                </div>

                                <div className="linked-policy">

                                    <div>
                                        <span>
                                            Linked Policy
                                        </span>

                                        <strong>
                                            {policy
                                                ? policy.policyNumber
                                                : "Please view your policy first"}
                                        </strong>
                                    </div>

                                    {!policy && (
                                        <button
                                            type="button"
                                            onClick={handleViewPolicy}
                                        >
                                            Load Policy
                                        </button>
                                    )}

                                </div>

                                <button
                                    type="submit"
                                    className="submit-form-button"
                                    disabled={claimLoading}
                                >
                                    {claimLoading
                                        ? "Submitting..."
                                        : "Submit Claim"}
                                </button>

                            </form>

                            {claimMessage && (
                                <div
                                    className={`alert-box ${
                                        claimMessage.includes(
                                            "successfully"
                                        )
                                            ? "success"
                                            : "error"
                                    }`}
                                >
                                    {claimMessage}
                                </div>
                            )}

                        </div>

                    </section>
                )}

                {/* CLAIM LIST */}

                {claimsMessage && (
                    <div className="message-container">
                        <div className="alert-box error">
                            {claimsMessage}
                        </div>
                    </div>
                )}

                {claims.length > 0 && (
                    <section className="dashboard-content">

                        <div className="section-heading">

                            <div>
                                <span className="section-label">
                                    CLAIM HISTORY
                                </span>

                                <h2>Your claims</h2>

                                <p>
                                    Track the latest updates on your
                                    submitted claims.
                                </p>
                            </div>

                            <div className="claims-count">
                                {activeClaims} active
                            </div>

                        </div>

                        <div className="claims-table-wrapper">

                            <table className="claims-table">

                                <thead>
                                    <tr>
                                        <th>Claim Number</th>
                                        <th>Description</th>
                                        <th>Amount</th>
                                        <th>Status</th>
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
                                                ₹
                                                {Number(
                                                    claim.claimAmount
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </td>

                                            <td>
                                                <span
                                                    className={`claim-status ${getStatusClass(
                                                        claim.status
                                                    )}`}
                                                >
                                                    {getStatusText(
                                                        claim.status
                                                    )}
                                                </span>
                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    </section>
                )}

                {/* SUPPORT */}

                <section
                    className="support-section"
                    id="support"
                >

                    <div className="support-content">

                        <span className="section-label">
                            CUSTOMER SUPPORT
                        </span>

                        <h2>
                            We're here when you need us.
                        </h2>

                        <p>
                            Have a question about your policy or claim?
                            Our support team is available to help.
                        </p>

                        <div className="support-actions">

                            <button>
                                Contact Support
                            </button>

                            <button>
                                Policy Assistance
                            </button>

                        </div>

                    </div>

                    <div className="support-pattern"></div>

                </section>

            </main>

            {/* FOOTER */}

            <footer className="main-footer">

                <div className="footer-container">

                    <div>
                        <strong>SecureLife</strong>
                        <span>
                            Insurance Services
                        </span>
                    </div>

                    <p>
                        Secure insurance. Simple service.
                    </p>

                    <span>
                        © 2026 SecureLife Insurance Services
                    </span>

                </div>

            </footer>

        </div>
    );
}

export default CustomerDashboard;