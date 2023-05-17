import TriviaDb from "lib/triviadb";

import { prisma } from "~/db.server";

const triviaDb = new TriviaDb()

export async function getCategoriesList() {
  return await triviaDb.getCategories()
}

export async function createGameSession(amount: number, categoryId: number) {
  const token = await triviaDb.getSessionToken()
  let questions = await triviaDb.getQuestions(
    amount,
    categoryId,
    token
  )
  for (let i = 0; i < questions.length; i++) {
    let question = questions[i]
    question.answers = [...question.incorrect_answers, question.correct_answer].sort(() => Math.random() - 0.5)
  }
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
