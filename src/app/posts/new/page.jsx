import { sql } from "@vercel/postgres";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default function NewPostPage() {
  async function handleSavePost(formData) {
    "use server"; // makes this function run _on the server_, as if by magic API.
    console.log("Saving post to the database...");

    // get the form data from the formData object next provdides
    const title = formData.get("title");
    const content = formData.get("content");

    // insert the data into postgres
    await sql`INSERT INTO posts (title, content) VALUES (${title}, ${content})`;
    console.log("Post saved!");

    // revalidate the posts page, so it fetches the new data
    revalidatePath("/posts");

    // redirect the user to the posts page
    redirect("/posts");
  }

  return (
    <form action={handleSavePost}>
      <label htmlFor="title">Title</label>
      <input id="title" name="title" type="text" />
      <label htmlFor="content">Content</label>
      <textarea id="content" name="content" />
      <button type="submit">Save</button>
    </form>
  );
}
