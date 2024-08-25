-- CreateTable
CREATE TABLE "invites" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "invite_code" TEXT NOT NULL,
    "assigned_role_id" UUID NOT NULL,
    "created_by" TEXT NOT NULL,
    "issued_on" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_true" BOOLEAN NOT NULL DEFAULT false,
    "used_by" TEXT,
    "used_on" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "invite_code" ON "invites"("invite_code");

-- CreateIndex
CREATE UNIQUE INDEX "invites_used_by_key" ON "invites"("used_by");

-- AddForeignKey
ALTER TABLE "invites" ADD CONSTRAINT "invites_assigned_role_id_fkey" FOREIGN KEY ("assigned_role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invites" ADD CONSTRAINT "invites_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invites" ADD CONSTRAINT "invites_used_by_fkey" FOREIGN KEY ("used_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
