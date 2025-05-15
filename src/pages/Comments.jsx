import { useEffect, useState } from "react";
import { getcomments, getCommentByPublication } from "../services/api";

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [originalComments, setOriginalComments] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const fetchComments = async (title = "") => {
    setLoading(true);
    setError(null);

    const res = title
      ? await getCommentByPublication(title)
      : await getcomments();

    const data = res?.data?.comments || [];

    if (res.error || !data.length) {
      setError(res.error ? "Error loading comments!" : "No comments found for this publication!");
      setComments([]);
      setOriginalComments([]);
    } else {
      setOriginalComments(data);
      setComments(filter ? sortComments(data, filter) : data);
    }

    setLoading(false);
  };

  const sortComments = (items, criterion) => {
    return items.slice().sort((a, b) => {
      switch (criterion) {
        case "course":
          return (a.publication?.course?.[0]?.name || "").localeCompare(
            b.publication?.course?.[0]?.name || ""
          );
        case "date":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "author":
          return a.author.localeCompare(b.author);
        default:
          return 0;
      }
    });
  };

  useEffect(() => {
    setComments(filter ? sortComments(originalComments, filter) : originalComments);
  }, [filter]);

  useEffect(() => {
    fetchComments();
  }, []);

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
        <button className="btn btn-secondary" onClick={() => {
          setSearchTitle("");
          fetchComments();
        }}>
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
                  <p className="mb-1"><strong>Course:</strong> {publication?.course?.[0]?.name || ""}</p>
                  <p className="mb-1"><strong>Publication:</strong> {publication?.title || ""}</p>

                  <div style={{ borderTop: "1px solid #eee", marginTop: 12, paddingTop: 12 }}>
                    <p className="mb-1"><strong>Author:</strong> {author}</p>
                    <p className="mb-1"><strong>Comment:</strong> {comment}</p>

                    <div style={{ borderTop: "1px solid #eee", marginTop: 12, paddingTop: 12 }}>
                      <p className="mb-0">
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Comments;