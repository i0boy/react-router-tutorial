import React from "react";
import {
  Form,
  NavLink,
  Outlet,
  redirect,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "react-router-dom";

// URL segments, layouts, and data are more often than not coupled (tripled?) together. We can see it in this app already:

import { createContact, getContacts } from "../contacts";

export async function action() {
  const contact = await createContact();
  return redirect(`/contacts/${contact.id}/edit`);
}

export async function loader({ request }) {
  /**
   * Because this is a GET, not a POST, React Router does not call the action.
   * Submitting a GET form is the same as clicking a link: only the URL changes.
   * That's why the code we added for filtering is in the loader,
   * not the action of this route.
   */
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q);
  /**
   * 1. If you click back after a search, the form field still has the value you entered even though the list is no longer filtered.
   * 2. If you refresh the page after searching, the form field no longer has the value in it, even though the list is filtered
   */
  return { contacts };
}

export default function Root() {
  const { contacts, q } = useLoaderData();
  const navigation = useNavigation();
  const submit = useSubmit();
  /**
   * Now for problem (1), clicking the back button and updating the input.
   * We can bring in useEffect from React to manipulate the form's state in the DOM directly.
   * You don't control the URL, the user does with the back/forward buttons.
   */
  React.useEffect(() => {
    document.getElementById("q").value = q;
  }, [q]);

  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          {/* when the browser creates the request for the next document, 
          it doesn't put the form data into the request POST body, 
          but into the URLSearchParams of a GET request. */}
          <Form id="search-form" role="search">
            <input
              id="q"
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q"
              /**
               *  That solves problem (2). If you refresh the page now, the input field will show the query.
               */
              defaultValue={q}
              /**
               * For this UI, we'd probably rather have the filtering happen on every key stroke instead of when the form is explicitly submitted.
               */
              onChange={(event) => {
                submit(event.currentTarget.form);
              }}
            />
            <div id="search-spinner" aria-hidden hidden={true} />
            <div className="sr-only" aria-live="polite"></div>
          </Form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  {/* This allows us to easily indicate where the user is, as well as provide immediate feedback on links that have been clicked but we're still waiting for data to load. */}
                  <NavLink
                    to={`contacts/${contact.id}`}
                    className={({ isActive, isPending }) =>
                      isActive ? "active" : isPending ? "pending" : ""
                    }
                  >
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{" "}
                    {contact.favorite && <span>★</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>
      </div>
      <div
        id="detail"
        /**useNavigation returns the current navigation state: it can be one of "idle" | "submitting" | "loading". */
        className={navigation.state === "loading" ? "loading" : ""}
      >
        <Outlet />
      </div>
    </>
  );
}
