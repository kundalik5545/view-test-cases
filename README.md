This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

# install

pnpm add -D prisma
pnpm add @prisma/client

# init prisma with sqlite

pnpm dlx prisma init --datasource-provider sqlite

# set DATABASE_URL="file:./dev.db" in .env

# add schema (edit prisma/schema.prisma), then migrate/generate:

pnpm exec prisma migrate dev --name init
pnpm exec prisma generate

# open studio (GUI)

pnpm exec prisma studio

# run seed

pnpm exec node prisma/seed.js

## Prompt

### Fix 🪛

- add release no and priority enums
- update dropdown val in meaningfull way
- update add page ui
- update enum values make relatable to project
- export to excel with filter functionality ✅
- make comments optional
- basic settings page
