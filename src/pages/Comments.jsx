import { useComments } from "../shared/hooks/useComments";

const Comments = () => {
  const { comments, loading, error, searchTitle, setSearchTitle, filter, setFilter, fetchComments } = useComments();

  return (
    <div className="container mt-4">
      <h2 className="display-6 fw-bold">Comments</h2>

      <div className="mb-3 d-flex gap-2">
        <input
          type="text"
          placeholder="Search comments by publication title"
          className="form-control"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchComments(searchTitle.trim())}
        />
        <button
          className="btn btn-secondary"
          onClick={() => {
            setSearchTitle("");
            fetchComments();
          }}
        >
          All
        </button>
        <select
          className="form-select"
          style={{ maxWidth: 200 }}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">Filter (none)</option>
          <option value="course">Course</option>
          <option value="date">Publicated</option>
          <option value="author">Author</option>
        </select>
      </div>

      {error && <p className="text-danger">{error}</p>}
      {loading && !error && <p>Loading comments...</p>}

      {!loading && comments.length > 0 && (
        <div className="row">
          {comments.map(({ _id, publication, author, comment, createdAt }) => (
            <div key={_id} className="col-12 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <p className="mb-1">
                    <strong>Course:</strong>{" "}
                    {publication?.course?.length
                      ? publication.course.map(c => c.name).join(", ")
                      : ""}
                  </p>
                  <p className="mb-1">
                    <strong>Publication:</strong> {publication?.title || ""}
                  </p>

                  <div style={{ borderTop: "1px solid #eee", marginTop: 12, paddingTop: 12 }}>
                    <p className="mb-1"><strong>Author:</strong> {author}</p>
                    <p className="mb-1"><strong>Comment:</strong> {comment}</p>

                    <p style={{ borderTop: "1px solid #eee", marginTop: 12, paddingTop: 12 }} className="mb-0">
                      <strong>Publicated:</strong>{" "}
                      {new Date(createdAt).toLocaleDateString("es-CL", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Comments;