-- CreateTable
CREATE TABLE "GameSession" (
    "slug" TEXT NOT NULL PRIMARY KEY,
    "questions" TEXT NOT NULL,
    "opentdb_token" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "current_question" INTEGER NOT NULL DEFAULT 0
);
