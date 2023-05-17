import TriviaDb from "lib/triviadb";

import { prisma } from "~/db.server";

const triviaDb = new TriviaDb()

export async function createGameSession(amount: number, categoryId: number) {
  const token = await triviaDb.getSessionToken()
  const questions = await triviaDb.getQuestions(
    amount,
    categoryId,
    token
  )
  return prisma.gameSession.create({
    data: {
      questions: JSON.stringify(questions),
      opentdb_token: token,
    }
  })
}

export async function nextQuestion(slug: string, wasCorrect: boolean) {
  return prisma.gameSession.update({
    where: {
      slug
    },
    data: {
      current_question: {
        increment: 1
      },
      score: {
        increment: wasCorrect ? 1 : 0
      }
    }
  })
}

export async function restartGameSession(slug: string, amount: number, categoryId: number) {
  const session = await prisma.gameSession.findUnique({
    where: { slug }
  })
  if (!session) return null
  const questions = await triviaDb.getQuestions(
    amount,
    categoryId,
    session.opentdb_token
  )
  return prisma.gameSession.update({
    where: {
      slug
    },
    data: {
      questions: JSON.stringify(questions),
      current_question: 0,
      score: 0
    }
  })
}

export async function getGameSession(slug: string) {
  return await prisma.gameSession.findUnique({
    where: { slug }
  })
}
