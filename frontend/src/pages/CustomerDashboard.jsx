function CustomerDashboard() {
    const email = localStorage.getItem("email");

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
                            <button className="btn btn-primary">
                                View Policy
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
        </div>
    );
}

export default CustomerDashboard;