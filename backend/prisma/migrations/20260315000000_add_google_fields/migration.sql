-- AlterTable
ALTER TABLE "public"."Restaurant" ADD COLUMN "google_place_id" TEXT,
ADD COLUMN "price_level" TEXT,
ADD COLUMN "types" JSONB,
ADD COLUMN "google_rating" DOUBLE PRECISION,
ADD COLUMN "google_rating_count" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Restaurant_google_place_id_key" ON "public"."Restaurant"("google_place_id");
