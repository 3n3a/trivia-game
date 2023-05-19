-- CreateTable
CREATE TABLE "GameSession" (
    "slug" TEXT NOT NULL,
    "questions" TEXT NOT NULL,
    "opentdb_token" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "current_question" INTEGER NOT NULL DEFAULT 0,
    "category_id" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "joker_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "GameSession_pkey" PRIMARY KEY ("slug")
);
