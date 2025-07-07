# Tax Management Application

A modern, full-stack tax management application built with React, TypeScript, tRPC, and Supabase. This application helps users manage their financial transactions and tax-related activities with an intuitive user interface.

## 🚀 Features

- **User Authentication**: Secure authentication system with Supabase Auth
- **Transaction Management**: Track and manage financial transactions
- **Dashboard**: Visualize financial data with interactive charts
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Updates**: Live updates using WebSockets
- **Form Validation**: Robust form handling with React Hook Form and Zod
- **Modern UI**: Built with Chakra UI for a clean, accessible interface

## 🛠 Tech Stack

### Frontend
- **React 19** - UI Library
- **TypeScript** - Type-safe JavaScript
- **Chakra UI** - Component library
- **React Router** - Client-side routing
- **React Query** - Data fetching and state management
- **tRPC** - End-to-end typesafe APIs
- **GSAP** - Animation library
- **Vite** - Build tool and dev server

### Backend
- **Bun** - JavaScript runtime
- **Hono** - Web framework
- **tRPC** - Typesafe APIs
- **Supabase** - Authentication and database
- **Argon2** - Password hashing
- **Zod** - Schema validation

## 📦 Prerequisites

- Node.js (v18+)
- Bun (v1.0.0+)
- Supabase account
- Git

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/tax.git
   cd tax
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env` in both `apps/client` and `apps/server`
   - Update the environment variables with your Supabase credentials

4. **Start the development servers**
   In separate terminal windows:
   ```bash
   # Start the client
   cd apps/client
   bun run dev
   
   # Start the server (from project root)
   cd ../../
   bun --watch apps/server/src/index.ts
   ```

5. **Open the application**
   The client will be available at `http://localhost:5173`

## 🏗 Project Structure

```
tax/
├── apps/
│   ├── client/              # Frontend application
│   │   ├── public/          # Static files
│   │   └── src/             # Source code
│   │       ├── components/   # Reusable components
│   │       ├── features/     # Feature modules
│   │       └── routes/       # Application routes
│   └── server/              # Backend application
│       └── src/
│           ├── trpc/        # tRPC routers and middleware
│           └── index.ts     # Server entry point
└── package.json            # Workspace configuration
```

## 📝 License

This project is [MIT licensed](./LICENSE).

## 🙏 Acknowledgments

- [tRPC](https://trpc.io/) for end-to-end typesafe APIs
- [Chakra UI](https://chakra-ui.com/) for the component library
- [Supabase](https://supabase.com/) for authentication and database
- [Vite](https://vitejs.dev/) for the development server and build tool