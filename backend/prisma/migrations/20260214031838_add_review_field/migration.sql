/*
  Warnings:

  - You are about to drop the `Contact` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."Contact";

-- CreateTable
CREATE TABLE "public"."Restaurant" (
    "id" SERIAL NOT NULL,
    "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_time" TIMESTAMP(3) NOT NULL,
    "status" "public"."status" NOT NULL DEFAULT 'ENABLED',
    "name" TEXT NOT NULL,
    "address" TEXT,
    "coordinates" JSONB,
    "phone" TEXT,
    "website" TEXT,
    "description" TEXT,
    "rating" INTEGER,
    "review" TEXT,

    CONSTRAINT "Restaurant_pkey" PRIMARY KEY ("id")
);
