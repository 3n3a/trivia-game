import type { LoaderArgs} from "@remix-run/node";
import { json, redirect } from "@remix-run/node"
import { restartGameSession } from "~/models/game.server"

export const loader = async ({ params }: LoaderArgs) => {
    const { slug } = params
    if (!slug) redirect('/')
    await restartGameSession(slug!)
    return redirect(`/play/${slug!}`)
  }