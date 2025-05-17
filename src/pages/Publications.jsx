import { usePublications } from "../shared/hooks/usePublications";

const Publications = () => {
  const {
    publications, selectedPublication, setSelectedPublication, comment, setComment, author, setAuthor,
    handleCommentSubmit, searchCourse, setSearchCourse, fetchPublications, error, loading,
    commentSuccess, filter, setFilter
  } = usePublications();

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCommentSubmit();
  };

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-5 text-center display-5">📚 Explore Publications</h2>

      <div className="d-flex flex-wrap gap-3 align-items-center mb-4 p-4 rounded-4 shadow bg-white border">
        <input
          type="text"
          className="form-control flex-grow-1 rounded-3"
          placeholder="🔍 Search by course name..."
          value={searchCourse}
          onChange={(e) => setSearchCourse(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchPublications(searchCourse.trim())}
        />
        <button
          className="btn btn-outline-dark rounded-3"
          onClick={() => {
            setSearchCourse("");
            fetchPublications();
          }}
        >
          Show All
        </button>
        <select
          className="form-select rounded-3"
          style={{ maxWidth: 220 }}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">Filter (none)</option>
          <option value="course">By Course</option>
          <option value="publicated">By Date</option>
        </select>
      </div>

      {error && <div className="alert alert-danger rounded-3">{error}</div>}
      {loading && !error && <p className="text-muted">Loading publications...</p>}

      {!loading && publications.length > 0 && (
        <div className="row row-cols-1 row-cols-md-2 g-4">
          {publications.map((pub) => (
            <div key={pub._id} className="col" onClick={() => setSelectedPublication(pub)} style={{ cursor: "pointer" }}>
              <div className="card border-0 h-100 shadow-sm rounded-4">
                <div className="card-body p-4">
                  <h5 className="fw-semibold mb-1">{pub.title}</h5>
                  <p className="text-muted small mb-3">{pub.description}</p>
                  <p className="mb-1">
                    <strong>Course:</strong>{" "}
                    {pub.course?.length ? pub.course.map((c) => c.name).join(", ") : "No course assigned"}
                  </p>
                  <p className="text-secondary small mb-0">
                    <strong>Created:</strong>{" "}
                    {new Date(pub.createdAt).toLocaleDateString("es-CL", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedPublication && !commentSuccess && (
        <div className="mt-5 p-4 bg-white rounded-4 shadow-sm border">
          <h4 className="fw-semibold mb-4">
            💬 Add Comment to: <strong>{selectedPublication.title}</strong>
          </h4>
          <input
            type="text"
            className="form-control mb-3 rounded-3"
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <form onSubmit={handleSubmit}>
            <textarea
              className="form-control mb-3 rounded-3"
              placeholder="Write your comment..."
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button type="submit" className="btn btn-primary rounded-3">
              Submit Comment
            </button>
          </form>
        </div>
      )}

      {commentSuccess && (
        <div className="alert alert-success mt-4 rounded-3 shadow-sm">
          ✅ Comment submitted successfully!
        </div>
      )}
    </div>
  );
};

export default Publications;