/*
  Warnings:

  - Added the required column `amount` to the `GameSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `GameSession` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GameSession" (
    "slug" TEXT NOT NULL PRIMARY KEY,
    "questions" TEXT NOT NULL,
    "opentdb_token" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "current_question" INTEGER NOT NULL DEFAULT 0,
    "category" TEXT NOT NULL,
    "amount" INTEGER NOT NULL
);
INSERT INTO "new_GameSession" ("current_question", "opentdb_token", "questions", "score", "slug") SELECT "current_question", "opentdb_token", "questions", "score", "slug" FROM "GameSession";
DROP TABLE "GameSession";
ALTER TABLE "new_GameSession" RENAME TO "GameSession";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
