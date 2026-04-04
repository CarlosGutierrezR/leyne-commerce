-- AlterTable
ALTER TABLE "Order"
ADD COLUMN "stripeCheckoutSessionExpiresAt" TIMESTAMP(3),
ADD COLUMN "stripeCheckoutSessionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Order_stripeCheckoutSessionId_key" ON "Order"("stripeCheckoutSessionId");
