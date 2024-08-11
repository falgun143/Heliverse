# Website Overview

## Tech Stack

- **Frontend & Backend:** React with Material-UI (MUI), Next.js
- **Validation:** Zod
- **Database:** PostgreSQL using Prisma ORM
- **Authentication:** JWT-based authentication
- **Deployment:** Vercel


## How the Website Works

### User Authentication

- Authentication is done with the help of JWT tokens stored in cookies.
- User roles (USER or ADMIN) are determined from the JWT payload.

### Car Management

- **Viewing Cars:**
  - Users see a list of cars fetched from the API.

- **Details Modal:**
  - Clicking "View Details" opens a modal displaying car details (car name, price, image link, manufacturing date) and actions based on user roles.
    - **USER:** Can view car details.
    - **ADMIN:** Can edit car details and add new cars.

### Car Editing

- Admins can edit car details using a form in the modal.
- Changes are submitted and saved back to the PostgreSQL database.

## Deployment

- The application is deployed on Vercel for hosting and continuous integration.

---

## Project Setup

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

### Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
