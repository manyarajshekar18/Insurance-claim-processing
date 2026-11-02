import { useEffect, useState } from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";
import "./AdminDashboard.css";

function AdminDashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:8080/api/admin/dashboard",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Failed to load dashboard (${response.status})`
                );
            }

            const data = await response.json();
            setDashboard(data);

        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.clear();
        window.location.reload();
    };

    if (loading) {
        return (
            <div className="admin-loading">
                <div>
                    <div className="admin-spinner"></div>
                    <p>Loading SecureLife Admin Portal...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-error">
                <div className="admin-error-card">
                    <h3>Unable to load dashboard</h3>
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()}>
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const claimStatusData = [
        {
            name: "Submitted",
            value: dashboard.submittedClaims
        },
        {
            name: "Under Review",
            value: dashboard.underReviewClaims
        },
        {
            name: "AI Analyzed",
            value: dashboard.aiAnalyzedClaims
        },
        {
            name: "More Information",
            value: dashboard.moreInformationRequiredClaims
        },
        {
            name: "Approved",
            value: dashboard.approvedClaims
        },
        {
            name: "Rejected",
            value: dashboard.rejectedClaims
        }
    ].filter((item) => item.value > 0);

    const chartColors = [
        "#F59E0B",
        "#2563EB",
        "#7C3AED",
        "#EAB308",
        "#16A34A",
        "#DC2626"
    ];

    return (
        <div className="admin-dashboard">

            {/* HEADER */}
            <header className="admin-header">

                <div className="admin-brand">
                    <div className="admin-brand-mark">
                        S
                    </div>

                    <div>
                        <div className="admin-brand-name">
                            SecureLife
                        </div>

                        <div className="admin-brand-subtitle">
                            Insurance Services
                        </div>
                    </div>
                </div>

                <div className="admin-header-right">

                    <div className="admin-user-info">
                        <div className="admin-avatar">
                            A
                        </div>

                        <div>
                            <div className="admin-user-name">
                                Administrator
                            </div>

                            <div className="admin-user-email">
                                {localStorage.getItem("email")}
                            </div>
                        </div>
                    </div>

                    <button
                        className="admin-logout"
                        onClick={logout}
                    >
                        Logout
                    </button>

                </div>

            </header>


            {/* HERO */}
            <section className="admin-hero">

                <div className="admin-hero-content">

                    <div className="admin-hero-badge">
                        ADMINISTRATION PORTAL
                    </div>

                    <h1>
                        Good evening, Administrator.
                    </h1>

                    <p>
                        Monitor your insurance operations, manage
                        claims and keep track of the SecureLife
                        platform from one place.
                    </p>

                    <div className="admin-hero-meta">
                        <span>
                            ● System Operational
                        </span>

                        <span>
                            SecureLife Insurance Platform
                        </span>
                    </div>

                </div>

                <div className="admin-hero-visual">

                    <div className="hero-shield">
                        <div className="shield-inner">
                            ✓
                        </div>
                    </div>

                    <div className="hero-floating-card hero-card-one">
                        <strong>
                            {dashboard.totalClaims}
                        </strong>
                        <span>Total Claims</span>
                    </div>

                    <div className="hero-floating-card hero-card-two">
                        <strong>
                            {dashboard.approvedClaims}
                        </strong>
                        <span>Approved</span>
                    </div>

                </div>

            </section>


            {/* MAIN CONTENT */}
            <main className="admin-content">

                {/* OVERVIEW */}
                <section>

                    <div className="admin-section-heading">
                        <div>
                            <h2>
                                Platform Overview
                            </h2>

                            <p>
                                A quick snapshot of your insurance system.
                            </p>
                        </div>
                    </div>

                    <div className="admin-overview-grid">

                        {/* USERS */}
                        <div className="admin-overview-card users-card">

                            <div className="overview-icon users-icon">
                                👥
                            </div>

                            <div className="overview-content">
                                <span>Total Users</span>

                                <strong>
                                    {dashboard.totalUsers}
                                </strong>

                                <small>
                                    Registered accounts
                                </small>
                            </div>

                        </div>


                        {/* POLICIES */}
                        <div className="admin-overview-card policies-card">

                            <div className="overview-icon policies-icon">
                                📋
                            </div>

                            <div className="overview-content">
                                <span>Total Policies</span>

                                <strong>
                                    {dashboard.totalPolicies}
                                </strong>

                                <small>
                                    Active insurance policies
                                </small>
                            </div>

                        </div>


                        {/* CLAIMS */}
                        <div className="admin-overview-card claims-card">

                            <div className="overview-icon claims-icon">
                                🧾
                            </div>

                            <div className="overview-content">
                                <span>Total Claims</span>

                                <strong>
                                    {dashboard.totalClaims}
                                </strong>

                                <small>
                                    Claims submitted
                                </small>
                            </div>

                        </div>


                        {/* APPROVED */}
                        <div className="admin-overview-card approved-card">

                            <div className="overview-icon approved-icon">
                                ✓
                            </div>

                            <div className="overview-content">
                                <span>Approved Claims</span>

                                <strong>
                                    {dashboard.approvedClaims}
                                </strong>

                                <small>
                                    Successfully approved
                                </small>
                            </div>

                        </div>

                    </div>

                </section>


                {/* ANALYTICS */}
                <section className="admin-analytics-section">

                    <div className="admin-section-heading">
                        <div>
                            <h2>
                                Claims Analytics
                            </h2>

                            <p>
                                Understand how claims are moving through
                                the processing workflow.
                            </p>
                        </div>
                    </div>


                    <div className="analytics-grid">

                        {/* PIE CHART */}
                        <div className="admin-panel chart-panel">

                            <div className="panel-header">
                                <div>
                                    <h3>
                                        Claim Status Overview
                                    </h3>

                                    <p>
                                        Current distribution of claims
                                    </p>
                                </div>

                                <div className="panel-icon">
                                    📊
                                </div>
                            </div>

                            <div className="chart-container">

                                {claimStatusData.length > 0 ? (

                                    <ResponsiveContainer
                                        width="100%"
                                        height={330}
                                    >
                                        <PieChart>

                                            <Pie
                                                data={claimStatusData}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="48%"
                                                innerRadius={75}
                                                outerRadius={115}
                                                paddingAngle={3}
                                            >
                                                {claimStatusData.map(
                                                    (entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={
                                                                chartColors[
                                                                    index %
                                                                    chartColors.length
                                                                ]
                                                            }
                                                        />
                                                    )
                                                )}
                                            </Pie>

                                            <Tooltip />

                                            <Legend
                                                verticalAlign="bottom"
                                                height={40}
                                            />

                                        </PieChart>
                                    </ResponsiveContainer>

                                ) : (

                                    <div className="empty-chart">
                                        <div>
                                            📊
                                        </div>

                                        <p>
                                            No claim activity available
                                        </p>
                                    </div>

                                )}

                            </div>

                        </div>


                        {/* SUMMARY */}
                        <div className="admin-panel summary-panel">

                            <div className="panel-header">
                                <div>
                                    <h3>
                                        Claim Summary
                                    </h3>

                                    <p>
                                        Current workflow status
                                    </p>
                                </div>

                                <div className="panel-icon">
                                    🛡️
                                </div>
                            </div>


                            <div className="claim-summary-list">

                                <SummaryRow
                                    label="Submitted"
                                    value={dashboard.submittedClaims}
                                    className="submitted"
                                />

                                <SummaryRow
                                    label="Under Review"
                                    value={dashboard.underReviewClaims}
                                    className="review"
                                />

                                <SummaryRow
                                    label="AI Analyzed"
                                    value={dashboard.aiAnalyzedClaims}
                                    className="ai"
                                />

                                <SummaryRow
                                    label="More Information"
                                    value={
                                        dashboard.moreInformationRequiredClaims
                                    }
                                    className="information"
                                />

                                <SummaryRow
                                    label="Approved"
                                    value={dashboard.approvedClaims}
                                    className="approved"
                                />

                                <SummaryRow
                                    label="Rejected"
                                    value={dashboard.rejectedClaims}
                                    className="rejected"
                                />

                            </div>

                        </div>

                    </div>

                </section>


                {/* CLAIM STATISTICS */}
                <section className="admin-statistics-section">

                    <div className="admin-section-heading">
                        <div>
                            <h2>
                                Claim Processing
                            </h2>

                            <p>
                                Current claim pipeline across the platform.
                            </p>
                        </div>
                    </div>


                    <div className="processing-grid">

                        <ProcessingCard
                            title="Submitted"
                            value={dashboard.submittedClaims}
                            description="Awaiting processing"
                            className="submitted"
                            icon="📨"
                        />

                        <ProcessingCard
                            title="Under Review"
                            value={dashboard.underReviewClaims}
                            description="Being reviewed by officers"
                            className="review"
                            icon="🔎"
                        />

                        <ProcessingCard
                            title="AI Analyzed"
                            value={dashboard.aiAnalyzedClaims}
                            description="Processed by AI"
                            className="ai"
                            icon="🤖"
                        />

                        <ProcessingCard
                            title="More Information"
                            value={
                                dashboard.moreInformationRequiredClaims
                            }
                            description="Additional details required"
                            className="information"
                            icon="📄"
                        />

                        <ProcessingCard
                            title="Approved"
                            value={dashboard.approvedClaims}
                            description="Successfully processed"
                            className="approved"
                            icon="✓"
                        />

                        <ProcessingCard
                            title="Rejected"
                            value={dashboard.rejectedClaims}
                            description="Claims not approved"
                            className="rejected"
                            icon="×"
                        />

                    </div>

                </section>


                {/* ADMIN MANAGEMENT */}
                <section className="management-section">

                    <div className="admin-section-heading">
                        <div>
                            <h2>
                                Administration
                            </h2>

                            <p>
                                Manage key areas of the SecureLife platform.
                            </p>
                        </div>
                    </div>


                    <div className="management-grid">

                        <ManagementCard
                            icon="👥"
                            title="User Management"
                            description="View and manage registered customers, officers and administrators."
                            className="blue"
                        />

                        <ManagementCard
                            icon="📋"
                            title="Policy Management"
                            description="Monitor insurance policies and policy-related information."
                            className="purple"
                        />

                        <ManagementCard
                            icon="🧾"
                            title="Claim Management"
                            description="Review claim activity and monitor claim processing."
                            className="orange"
                        />

                    </div>

                </section>


                {/* RECENT ACTIVITY */}
                <section className="activity-section">

                    <div className="admin-panel">

                        <div className="panel-header">

                            <div>
                                <h3>
                                    System Activity
                                </h3>

                                <p>
                                    Latest claim activity in the platform
                                </p>
                            </div>

                            <div className="panel-icon">
                                ⚡
                            </div>

                        </div>


                        <div className="activity-list">

                            <div className="activity-item">

                                <div className="activity-icon approved">
                                    ✓
                                </div>

                                <div className="activity-content">
                                    <strong>
                                        Approved claims
                                    </strong>

                                    <span>
                                        {dashboard.approvedClaims} claim(s)
                                        currently approved
                                    </span>
                                </div>

                                <span className="activity-status">
                                    Completed
                                </span>

                            </div>


                            <div className="activity-item">

                                <div className="activity-icon claims">
                                    🧾
                                </div>

                                <div className="activity-content">
                                    <strong>
                                        Total claims processed
                                    </strong>

                                    <span>
                                        {dashboard.totalClaims} claim(s)
                                        registered in the system
                                    </span>
                                </div>

                                <span className="activity-status neutral">
                                    Updated
                                </span>

                            </div>


                            <div className="activity-item">

                                <div className="activity-icon users">
                                    👥
                                </div>

                                <div className="activity-content">
                                    <strong>
                                        User accounts
                                    </strong>

                                    <span>
                                        {dashboard.totalUsers} registered
                                        user(s) on the platform
                                    </span>
                                </div>

                                <span className="activity-status neutral">
                                    Active
                                </span>

                            </div>

                        </div>

                    </div>

                </section>

            </main>


            {/* FOOTER */}
            <footer className="admin-footer">

                <div>
                    <strong>
                        SecureLife
                    </strong>

                    <span>
                        &nbsp; | &nbsp; Insurance Services
                    </span>
                </div>

                <span>
                    Secure administrative portal
                </span>

            </footer>

        </div>
    );
}


/* SUMMARY ROW */

function SummaryRow({ label, value, className }) {

    return (
        <div className="summary-row">

            <div className="summary-label">

                <span
                    className={`summary-dot ${className}`}
                ></span>

                <span>
                    {label}
                </span>

            </div>

            <strong>
                {value}
            </strong>

        </div>
    );
}


/* PROCESSING CARD */

function ProcessingCard({
    title,
    value,
    description,
    className,
    icon
}) {

    return (
        <div className={`processing-card ${className}`}>

            <div className="processing-top">

                <div className="processing-icon">
                    {icon}
                </div>

                <span className="processing-value">
                    {value}
                </span>

            </div>

            <h3>
                {title}
            </h3>

            <p>
                {description}
            </p>

        </div>
    );
}


/* MANAGEMENT CARD */

function ManagementCard({
    icon,
    title,
    description,
    className
}) {

    return (
        <div className={`management-card ${className}`}>

            <div className="management-icon">
                {icon}
            </div>

            <div>
                <h3>
                    {title}
                </h3>

                <p>
                    {description}
                </p>
            </div>

            <span className="management-arrow">
                →
            </span>

        </div>
    );
}

export default AdminDashboard;