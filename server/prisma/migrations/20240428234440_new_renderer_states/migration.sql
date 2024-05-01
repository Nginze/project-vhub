-- CreateTable
CREATE TABLE "auth_provider" (
    "user_id" UUID NOT NULL,
    "google_id" VARCHAR,
    "github_id" VARCHAR,
    "discord_id" VARCHAR,

    CONSTRAINT "auth_provider_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "room" (
    "room_id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "creator_id" UUID,
    "room_desc" TEXT,
    "is_private" BOOLEAN,
    "auto_speaker" BOOLEAN,
    "chat_enabled" BOOLEAN,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "hand_raise_enabled" BOOLEAN,
    "last_active" TIMESTAMP(6),
    "ended" BOOLEAN DEFAULT false,
    "map_key" TEXT NOT NULL,

    CONSTRAINT "room_pkey" PRIMARY KEY ("room_id")
);

-- CreateTable
CREATE TABLE "room_ban" (
    "room_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "ban_type" VARCHAR,
    "created_at" TIMESTAMP(6),

    CONSTRAINT "room_ban_pkey" PRIMARY KEY ("room_id","user_id")
);

-- CreateTable
CREATE TABLE "room_category" (
    "room_id" UUID NOT NULL,
    "category" VARCHAR NOT NULL,

    CONSTRAINT "room_category_pkey" PRIMARY KEY ("room_id","category")
);

-- CreateTable
CREATE TABLE "room_status" (
    "user_id" UUID NOT NULL,
    "room_id" UUID NOT NULL,
    "is_speaker" BOOLEAN,
    "is_mod" BOOLEAN,
    "raised_hand" BOOLEAN,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "is_muted" BOOLEAN,
    "pos_x" INTEGER NOT NULL,
    "pos_y" INTEGER NOT NULL,
    "dir" TEXT NOT NULL,
    "skin" TEXT NOT NULL,

    CONSTRAINT "room_status_pkey" PRIMARY KEY ("user_id","room_id")
);

-- CreateTable
CREATE TABLE "user_data" (
    "user_id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "user_name" VARCHAR,
    "email" VARCHAR,
    "display_name" VARCHAR,
    "avatar_url" VARCHAR,
    "bio" TEXT,
    "current_room_id" UUID,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "last_seen" TIMESTAMPTZ(6),

    CONSTRAINT "user_data_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "user_follows" (
    "user_id" UUID NOT NULL,
    "is_following" UUID NOT NULL,
    "created_at" TIMESTAMP(6),

    CONSTRAINT "user_follows_pkey" PRIMARY KEY ("user_id","is_following")
);

-- CreateTable
CREATE TABLE "user_notification" (
    "notification_id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" UUID,
    "room_id" UUID,
    "category" VARCHAR,
    "content" VARCHAR,
    "is_read" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_notification_pkey" PRIMARY KEY ("notification_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_data_email_key" ON "user_data"("email");

-- AddForeignKey
ALTER TABLE "auth_provider" ADD CONSTRAINT "auth_provider_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_data"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "room" ADD CONSTRAINT "room_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "user_data"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "room_ban" ADD CONSTRAINT "room_ban_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "room"("room_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "room_ban" ADD CONSTRAINT "room_ban_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_data"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "room_category" ADD CONSTRAINT "room_category_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "room"("room_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "room_status" ADD CONSTRAINT "room_status_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "room"("room_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "room_status" ADD CONSTRAINT "room_status_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_data"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_follows" ADD CONSTRAINT "user_follows_is_following_fkey" FOREIGN KEY ("is_following") REFERENCES "user_data"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_follows" ADD CONSTRAINT "user_follows_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_data"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_notification" ADD CONSTRAINT "user_notification_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "room"("room_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_notification" ADD CONSTRAINT "user_notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_data"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;
