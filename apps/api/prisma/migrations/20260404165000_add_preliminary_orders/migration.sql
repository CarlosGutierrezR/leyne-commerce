-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "cartId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending_payment',
    "source" TEXT NOT NULL DEFAULT 'storefront',
    "customerFullName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "customerReference" TEXT,
    "deliveryAddressLine1" TEXT NOT NULL,
    "deliveryCity" TEXT NOT NULL,
    "deliveryRegion" TEXT NOT NULL,
    "deliveryPostalCode" TEXT NOT NULL,
    "deliveryCountry" TEXT NOT NULL,
    "deliveryNotes" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "itemCount" INTEGER NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "shippingAmount" DECIMAL(10,2),
    "taxAmount" DECIMAL(10,2),
    "total" DECIMAL(10,2) NOT NULL,
    "stripeMode" TEXT NOT NULL DEFAULT 'test',
    "stripeStatus" TEXT NOT NULL DEFAULT 'pending_checkout_session',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "categoryName" TEXT NOT NULL,
    "imageUrl" TEXT,
    "size" TEXT,
    "color" TEXT,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "lineTotal" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");

-- CreateIndex
CREATE INDEX "OrderItem_variantId_idx" ON "OrderItem"("variantId");

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
