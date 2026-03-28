-- CreateEnum
CREATE TYPE "visit_status" AS ENUM ('VISIT', 'VISITED');

-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN "visit" "visit_status";

-- Backfill: mark restaurants with a rating or review as VISITED
UPDATE "Restaurant" SET "visit" = 'VISITED' WHERE "rating" IS NOT NULL OR "review" IS NOT NULL;
