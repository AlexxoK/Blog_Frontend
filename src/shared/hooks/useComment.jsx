import { useState } from 'react';
import { postComment, getCommentByPublication } from '../../services/api';

export const useComment = () => {

    const [comments, setComments] = useState([]);

    const handlePostComment = async (data) => {
        try {
            await postComment(data);

        } catch (error) {
            console.error("Error al crear comentario:", error.response?.data || error.message);

        }
    };

    const handleGetCommentByPublication = async (title) => {
        try {
            const res = await getCommentByPublication(title);
            console.log(res);

            setComments(res.data?.comments || []);
        } catch (error) {
            console.error("Error al obtener comentarios:", error);
        }
    };

    return { comments, handlePostComment, handleGetCommentByPublication };
}