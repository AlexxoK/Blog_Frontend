import Layout from "./components/layout/Layout";
import Publications from "./pages/Publications";
import Comments from "./pages/Comments";

const routes = [
    {
        path: "/",
        element: <Layout />,
        children: [
            { path: "publications", element: <Publications /> },
            { path: "comments", element: <Comments /> },
            { index: true, element: <Publications /> }, // por defecto va a publications
        ],
    },
];

export default routes;