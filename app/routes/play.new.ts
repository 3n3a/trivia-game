import { ActionArgs, LoaderArgs, json, redirect } from "@remix-run/node";
import { createGameSession } from "~/models/game.server";

// function createGameSession(formData: any) {
//   const category = formData.get("category");
//   const questions = formData.get("questions");
//   console.log("Session", category, "qs: ", questions);
//   return { id: "123" };
// }

export const loader = async ({}: LoaderArgs) => {
  return json({})
}

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const categoryId: number = Number(formData.get("category"));
  const amount: number = Number(formData.get("questions"));

  if (!(categoryId || amount)) {
    return redirect('/')
  }

  const session = await createGameSession(amount, categoryId);
  return redirect(`/play/${session.slug}`);
};
