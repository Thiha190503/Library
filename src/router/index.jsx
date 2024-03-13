import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Layout from "../pages/layouts/Layout";
import BookDetails from "../pages/BookDetails";
import BookForm from "../pages/BookForm";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/create",
        element: <BookForm />,
      },
      {
        path: "/edit/:id",
        element: <BookForm />,
      },
      {
        path: "/books/:id",
        element: <BookDetails />,
      },
    ],
  },
]);

export default router;
