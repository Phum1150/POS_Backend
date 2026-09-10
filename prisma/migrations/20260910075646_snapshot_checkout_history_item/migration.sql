/*
  Warnings:

  - Added the required column `price` to the `CheckoutHistoryItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productName` to the `CheckoutHistoryItem` table without a default value. This is not possible if the table is not empty.

*/
-- Remove pre-existing test data (no productName/price snapshot to backfill from)
DELETE FROM "CheckoutHistoryItem";
DELETE FROM "CheckoutHistory";

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CheckoutHistoryItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "checkoutHistoryId" INTEGER NOT NULL,
    "productId" INTEGER,
    "productName" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    CONSTRAINT "CheckoutHistoryItem_checkoutHistoryId_fkey" FOREIGN KEY ("checkoutHistoryId") REFERENCES "CheckoutHistory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CheckoutHistoryItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_CheckoutHistoryItem" ("checkoutHistoryId", "id", "productId", "quantity") SELECT "checkoutHistoryId", "id", "productId", "quantity" FROM "CheckoutHistoryItem";
DROP TABLE "CheckoutHistoryItem";
ALTER TABLE "new_CheckoutHistoryItem" RENAME TO "CheckoutHistoryItem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
