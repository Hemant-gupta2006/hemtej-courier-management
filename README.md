# Courier Management System

A premium, fast, and modern Courier Management Web Application built with Next.js, Prisma, and Tailwind CSS.

## Features Built
- **Glassmorphism UI**: Premium SaaS-like animated dashboard and landing page using Framer Motion.
- **NextAuth Integration**: Supports Google OAuth and password-based Email logins seamlessly.
- **Spreadsheet-like Data Entry**: Ultra-fast TanStack table with Autocomplete, Bulk Paste (CTRL+V), shortcut navigation (TAB/ENTER), and Batch default settings.
- **Excel Export**: Fully functional exports of courier data to `.xlsx`.

## Getting Started

First, install dependencies:
```bash
npm install
```

### Environment Variables
You must create a `.env` file at the root of the project with the following keys:

```bash
# Database connection for Prisma
DATABASE_URL="file:./dev.db"

# NextAuth 
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_generated_secret_here" # run `openssl rand -base64 32` to generate

# Google OAuth Credentials (for Google Login)
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
```

### Database & Prisma Configuration
The project uses Prisma ORM with a local SQLite database (`prisma/dev.db`). 

To generate the Prisma Client and apply schema changes, run:
```bash
npx prisma db push
```

If you ever change `prisma/schema.prisma`, you should run the push command again.

### Running the server
Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
