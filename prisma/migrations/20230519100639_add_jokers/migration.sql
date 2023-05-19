-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GameSession" (
    "slug" TEXT NOT NULL PRIMARY KEY,
    "questions" TEXT NOT NULL,
    "opentdb_token" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "current_question" INTEGER NOT NULL DEFAULT 0,
    "category_id" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "joker_count" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_GameSession" ("amount", "category_id", "current_question", "opentdb_token", "questions", "score", "slug") SELECT "amount", "category_id", "current_question", "opentdb_token", "questions", "score", "slug" FROM "GameSession";
DROP TABLE "GameSession";
ALTER TABLE "new_GameSession" RENAME TO "GameSession";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
