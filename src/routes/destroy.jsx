import { redirect } from "react-router-dom";
import { deleteContact } from "../contacts";

/**
 *
 *  When the user clicks the submit button:
 * <Form> prevents the default browser behavior of sending a new POST request to the server, 
 * but instead emulates the browser by creating a POST request with client side routing
 * 
 * The <Form action="destroy"> matches the new route at "contacts/:contactId/destroy" and sends it the request
 * 
 * After the action redirects, 
 * React Router calls all of the loaders for the data on the page to get the latest values (this is "revalidation"). 
 * useLoaderData returns new values and causes the components to update!
 */
export async function action({ params }) {
  await deleteContact(params.contactId);
  return redirect("/");
}
