import { useEffect, useState } from "react";
import { getPublications, postComment } from "../services/api";

const Publications = () => {
  const [publications, setPublications] = useState([]);
  const [selectedPublication, setSelectedPublication] = useState(null);
  const [comment, setComment] = useState("");
  const [author, setAuthor] = useState("");
  const [isCommentSubmitted, setIsCommentSubmitted] = useState(false);

  useEffect(() => {
    const fetchPublications = async () => {
      const res = await getPublications();
      if (!res.error) {
        setPublications(res.data.publications);
      }
    };

    fetchPublications();
  }, []);

  const handleSelect = (pub) => {
    setSelectedPublication(pub);
    setIsCommentSubmitted(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comment.trim() || !author.trim() || !selectedPublication?.title) return;

    const data = { author, comment, publication: selectedPublication.title };

    const res = await postComment(data);
    if (!res.error) {
      setComment("");
      setIsCommentSubmitted(true);
      const refreshRes = await getPublications();
      if (!refreshRes.error) {
        setPublications(refreshRes.data.publications);
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="display-6 fw-bold">Publications</h2>

      <ul className="list-group mt-3">
        {publications.map((pub) => (
          <li
            key={pub._id}
            className="list-group-item list-group-item-action"
            onClick={() => handleSelect(pub)}
            style={{ cursor: "pointer" }}
          >
            <h5>{pub.title}</h5>
            <p>{pub.description}</p>
            <small className="text-muted">
              Course: {pub.course[0]?.name || "Sin curso asignado!"}
            </small>
          </li>
        ))}
      </ul>

      {selectedPublication && !isCommentSubmitted && (
        <div className="mt-4">
          <h5>Add comment to: <strong>{selectedPublication.title}</strong></h5>

          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <textarea
                className="form-control"
                placeholder="Write your comment..."
                rows="3"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">Submit Comment</button>
          </form>
        </div>
      )}

      {isCommentSubmitted && (
        <div className="alert alert-success mt-3">Comment submitted successfully!</div>
      )}
    </div>
  );
};

export default Publications;