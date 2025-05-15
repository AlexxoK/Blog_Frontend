import { useEffect, useState } from "react";
import { getPublications, postComment, getPublicationsByCourseName } from "../services/api";

const Publications = () => {
  const [publications, setPublications] = useState([]);
  const [originalPublications, setOriginalPublications] = useState([]);
  const [selectedPublication, setSelectedPublication] = useState(null);
  const [comment, setComment] = useState("");
  const [author, setAuthor] = useState("");
  const [searchCourse, setSearchCourse] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentSuccess, setCommentSuccess] = useState(false);
  const [filter, setFilter] = useState("");

  const fetchPublications = async (query = "") => {
    setLoading(true);
    setError(null);
    setSelectedPublication(null);
    setCommentSuccess(false);

    const res = query
      ? await getPublicationsByCourseName(query)
      : await getPublications();

    if (res.error || !res.data.publications.length) {
      setError(res.error ? "Error loading publications!" : "No publications found for this course!");
      setPublications([]);
      setOriginalPublications([]);
    } else {
      setOriginalPublications(res.data.publications);
      setPublications(filter ? sortPublications(res.data.publications, filter) : res.data.publications);
    }
    setLoading(false);
  };

  const sortPublications = (items, criterion) => {
    if (criterion === "course") {
      return [...items].sort((a, b) => (a.course?.[0]?.name?.toLowerCase() || "").localeCompare(b.course?.[0]?.name?.toLowerCase() || ""));
    }
    if (criterion === "publicated") {
      return [...items].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return items;
  };

  useEffect(() => {
    setPublications(filter === "" ? originalPublications : sortPublications(publications, filter));
  }, [filter]);

  useEffect(() => {
    fetchPublications();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim() || !author.trim()) return;

    const res = await postComment({ author, comment, publication: selectedPublication.title });
    if (!res.error) {
      setAuthor("");
      setComment("");
      setCommentSuccess(true);
      fetchPublications(searchCourse);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="display-6 fw-bold">Publications</h2>

      <div className="mb-3 d-flex gap-2">
        <input
          type="text"
          placeholder="Search publications by course name"
          className="form-control"
          value={searchCourse}
          onChange={e => setSearchCourse(e.target.value)}
          onKeyDown={e => e.key === "Enter" && fetchPublications(searchCourse.trim())}
        />
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            setSearchCourse("");
            fetchPublications();
          }}
        >
          All
        </button>
        <select
          className="form-select"
          style={{ maxWidth: 200 }}
          value={filter}
          onChange={e => setFilter(e.target.value)}
        >
          <option value="">Filter (none)</option>
          <option value="course">Course</option>
          <option value="publicated">Publicated</option>
        </select>
      </div>

      {error && <p className="text-danger">{error}</p>}
      {loading && !error && <p>Loading publications...</p>}

      {!loading && publications.length > 0 && (
        <div className="row mt-3">
          {publications.map(pub => (
            <div
              key={pub._id}
              className="col-12 mb-4"
              onClick={() => {
                setSelectedPublication(pub);
                setCommentSuccess(false);
              }}
              style={{ cursor: "pointer" }}
            >
              <div className="card shadow-sm">
                <div className="card-body">
                  <p className="mb-1"><strong>Course:</strong> {pub.course?.[0]?.name || "Sin curso asignado!"}</p>

                  <div style={{ borderTop: "1px solid #eee", marginTop: 12, paddingTop: 12 }}>
                    <p className="mb-1"><strong>{pub.title}</strong></p>
                    <p className="mb-1">{pub.description}</p>
                  </div>

                  <div style={{ borderTop: "1px solid #eee", marginTop: 12, paddingTop: 12 }}>
                    <p className="mb-0">
                      <strong>Created:</strong>{" "}
                      {new Date(pub.createdAt).toLocaleDateString("es-CL", { day: "2-digit", month: "long", year: "numeric" })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedPublication && !commentSuccess && (
        <div className="mt-4">
          <h5>Add comment to: <strong>{selectedPublication.title}</strong></h5>

          <input
            type="text"
            className="form-control mb-3"
            placeholder="Author"
            value={author}
            onChange={e => setAuthor(e.target.value)}
          />

          <form onSubmit={handleSubmit}>
            <textarea
              className="form-control mb-3"
              placeholder="Write your comment..."
              rows="3"
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Submit Comment</button>
          </form>
        </div>
      )}

      {commentSuccess && (
        <div className="alert alert-success mt-3">Comment submitted successfully!</div>
      )}
    </div>
  );
};

export default Publications;