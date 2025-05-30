import { useState } from "react";
import { useComments } from "../shared/hooks/useComments";

const Comments = () => {
  const { comments, loading, error, searchTitle, setSearchTitle, filter, setFilter, fetchComments, editComment, removeComment } = useComments();

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const startEditing = (id, currentComment) => {
    setEditingId(id);
    setEditText(currentComment);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditText("");
  };

  const saveEdit = async (id, publicationTitle) => {
    if (!editText.trim()) {
      alert("Comment cannot be empty");
      return;
    }
    await editComment(id, editText.trim(), publicationTitle);
    setEditingId(null);
    setEditText("");
  };

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-5 text-center display-5">💬 Comments</h2>

      <div className="d-flex flex-wrap gap-3 align-items-center mb-4 p-4 rounded-4 shadow bg-white border">
        <input
          type="text"
          placeholder="🔍 Search by publication title..."
          className="form-control flex-grow-1 rounded-3"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && fetchComments(searchTitle.trim())
          }
        />
        <button
          className="btn btn-outline-dark rounded-3"
          onClick={() => {
            setSearchTitle("");
            fetchComments();
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
          <option value="date">By Date</option>
          <option value="author">By Author</option>
        </select>
      </div>

      {error && <div className="alert alert-danger rounded-3">{error}</div>}
      {loading && !error && <p className="text-muted">Loading comments...</p>}

      {!loading && comments.length > 0 && (
        <div className="row row-cols-1 g-4">
          {comments.map(({ _id, publication, author, comment, createdAt }) => (
            <div key={_id} className="col">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body p-4">
                  <p className="mb-2">
                    <strong>📘 Course:</strong>{" "}
                    {publication?.course?.length
                      ? publication.course.map((c) => c.name).join(", ")
                      : "No course"}
                  </p>
                  <p className="mb-3">
                    <strong>📝 Publication:</strong>{" "}
                    {publication?.title || "Untitled"}
                  </p>
                  <hr />
                  <p className="mb-1">
                    <strong>👤 Author:</strong> {author}
                  </p>
                  <p className="mb-3">
                    <strong>💬 Comment:</strong>{" "}
                    {editingId === _id ? (
                      <textarea
                        className="form-control"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows={3}
                      />
                    ) : (
                      comment
                    )}
                  </p>
                  <hr />
                  <p className="text-secondary small mb-0">
                    <strong>📅 Publicated:</strong>{" "}
                    {new Date(createdAt).toLocaleDateString("es-CL", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <div className="mt-3 d-flex gap-2">
                    {editingId === _id ? (
                      <>
                        <button
                          className="btn btn-success"
                          onClick={() => saveEdit(_id, publication?.title)}
                        >
                          💾 Save
                        </button>
                        <button
                          className="btn btn-secondary"
                          onClick={cancelEditing}
                        >
                          ❌ Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => startEditing(_id, comment)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => removeComment(_id)}
                        >
                          🗑️ Delete
                        </button>
                      </>
                    )}
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