import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg" style={{ backgroundColor: "#1f1f1f" }}>
            <div className="container">
                <Link className="navbar-brand fw-bold fs-4 text-light" to="/">
                    📝 Blog
                </Link>
                <button
                    className="navbar-toggler border-0"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNavAlt"
                    aria-controls="navbarNavAlt"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon" />
                </button>

                <div className="collapse navbar-collapse" id="navbarNavAlt">
                    <ul className="navbar-nav ms-auto gap-3">
                        <li className="nav-item">
                            <NavLink
                                to="/publications"
                                className={({ isActive }) =>
                                    `nav-link fw-semibold ${isActive ? "text-white" : "text-secondary"}`
                                }
                            >
                                Publications
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                to="/comments"
                                className={({ isActive }) =>
                                    `nav-link fw-semibold ${isActive ? "text-white" : "text-secondary"}`
                                }
                            >
                                Comments
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;