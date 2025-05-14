import { useEffect, useState } from "react";
import { getPublications, postComment } from "../services/api";

const Publications = () => {
  const [publications, setPublications] = useState([]);
  const [selectedPublication, setSelectedPublication] = useState(null);
  const [comment, setComment] = useState("");
  const [feedback, setFeedback] = useState("");
  const [author, setAuthor] = useState("");

  useEffect(() => {
    const fetchPublications = async () => {
      const res = await getPublications();
      if (!res.error) {
        setPublications(res.data.publications);
      } else {
        console.error("Error getting publications!", res.e);
      }
    };

    fetchPublications();
  }, []);

  const handleSelect = (pub) => {
    setSelectedPublication(pub);
    setFeedback("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim() || !author.trim()) return;

    const data = {
      author,
      comment,
      publication: selectedPublication._id,
    };

    const res = await postComment(data);
    if (!res.error) {
      setFeedback("Comment sumbit succesfully!");
      setComment("");
    } else {
      setFeedback("Error sumbit comment!");
      console.error(res.e);
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

      {selectedPublication && (
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
            <button type="submit" className="btn btn-primary">Sumbit Comment</button>
          </form>

          {feedback && <div className="alert alert-info mt-3">{feedback}</div>}
        </div>
      )}
    </div>
  );
};

export default Publications;