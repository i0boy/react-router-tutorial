import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Root, {
  action as rootAction,
  loader as rootLoader,
} from "./routes/root";
/* previous imports */
import ErrorPage from "./error-page";
import Contact, {
  action as contactAction,
  loader as contactLoader,
} from "./routes/contact";

import { action as destroyAction } from "./routes/destroy";
import EditContact, { action as editAction } from "./routes/edit";
import Index from "./routes/index";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,

    // React Router prevents that and sends the request to your action instead, including the FormData.
    action: rootAction,
    children: [
      {
        // pathless routes. for all error under the outlet of root page.
        // We could add the error element to every one of the child routes but, since it's all the same error page, this isn't recommended.
        errorElement: <ErrorPage />,
        children: [
          // // Note the { index:true } instead of { path: "" }.
          { index: true, element: <Index /> },
          // pathless routes. for all error under the outlet of root page.
          {
            path: "contacts/:contactId",
            element: <Contact />,
            loader: contactLoader,
            action: contactAction,
          },
          {
            path: "contacts/:contactId/edit",
            element: <EditContact />,
            loader: contactLoader,
            action: editAction,
          },
          {
            path: "contacts/:contactId/destroy",
            errorElement: <div>Oops! There was an error.</div>,
            /**
             * Because the destroy route has its own errorElement and is a child of the root route,
             * the error will render there instead of the root.
             * As you probably noticed, these errors bubble up to the nearest errorElement.
             * Add as many or as few as you like!
             */
            action: destroyAction,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
