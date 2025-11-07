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

plan this functionality where i want copy paste button for each test cases so that whenever user take screenshot then he can paste in particular test case.

- now that screenshot will then stored inside public folder with testcaseID_SchemeLevel_module_timestamp.png format.
- Also will be shown in test cases in view.jsx page.
- User can remove the screenshot or add another one (keep name testcaseID_SchemeLevel_module_timestamp_2.png)
