import { ActionArgs, LoaderArgs, json, redirect } from "@remix-run/node";
import { createGameSession } from "~/models/game.server";

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
