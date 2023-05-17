import TriviaDb from "lib/triviadb";
import type { Question } from "lib/triviadb/trivia";

import { prisma } from "~/db.server";

const triviaDb = new TriviaDb()

export type GameSession = {
  slug: string;
  questions: Question[];
  opentdb_token: string;
  score: number;
  current_question: number;
}

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
  processQuestions(questions);
  return prisma.gameSession.create({
    data: {
      questions: JSON.stringify(questions),
      opentdb_token: token,
      amount: amount,
      category_id: categoryId,
    }
  })
}

export async function nextQuestion(slug: string, wasCorrect: boolean) {
  const res = await prisma.gameSession.update({
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
  return convertToGameSession(res)
}

export async function restartGameSession(slug: string, amount?: number, categoryId?: number) {
  const session = await prisma.gameSession.findUnique({
    where: { slug }
  })
  if (!session) return null
  const questions = await triviaDb.getQuestions(
    amount || session.amount,
    categoryId || session.category_id,
    session.opentdb_token
  )
  processQuestions(questions);
  const res = await prisma.gameSession.update({
    where: {
      slug
    },
    data: {
      questions: JSON.stringify(questions),
      current_question: 0,
      score: 0
    }
  })
  return convertToGameSession(res)
}

function processQuestions(questions: Question[]) {
  for (let i = 0; i < questions.length; i++) {
    let question = questions[i];
    question.answers = [...question.incorrect_answers!, question.correct_answer!].sort(() => Math.random() - 0.5);
  }
}

export async function getGameSession(slug: string) {
  const res =  await prisma.gameSession.findUnique({
    where: { slug }
  })
  return convertToGameSession(res)
}

function convertToGameSession(record: any) {
  if (record && record.hasOwnProperty("questions")) {
    record.questions = JSON.parse(record!.questions);
    return record as unknown as GameSession
  }
  return undefined
}