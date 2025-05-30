import { useEffect, useState } from "react";
import { getcomments, getCommentByPublication, putComment as apiPutComment, deleteComment } from "../../services/api";

export const useComments = () => {
    const [comments, setComments] = useState([]);
    const [originalComments, setOriginalComments] = useState([]);
    const [searchTitle, setSearchTitle] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("");

    const sortComments = (items, criterion) => {
        return [...items].sort((a, b) => {
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

    const fetchComments = async (title = "") => {
        setLoading(true);
        setError(null);

        const res = title ? await getCommentByPublication(title) : await getcomments();
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

    const editComment = async (id, updatedContent, publicationTitle) => {
        const res = await apiPutComment(id, {
            comment: updatedContent,
            publication: publicationTitle,
        });
        if (!res.error) {
            await fetchComments(searchTitle);
        } else {
            setError("Error updating comment.");
        }
    };

    const removeComment = async (id) => {
        const res = await deleteComment(id);
        if (!res.error) {
            await fetchComments(searchTitle);
        } else {
            setError("Error deleting comment.");
        }
    };

    useEffect(() => {
        setComments(filter ? sortComments(originalComments, filter) : originalComments);
    }, [filter, originalComments]);

    useEffect(() => {
        fetchComments();
    }, []);

    return { comments, loading, error, searchTitle, setSearchTitle, filter, setFilter, fetchComments, editComment, removeComment }
}