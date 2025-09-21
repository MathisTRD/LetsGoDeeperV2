# Let's Go Deeper - Conversation Game

A Next.js application for deeper conversations with dynamic questions and database storage.

## Features

- 🎮 Interactive conversation game with 3 categories
- 📊 Database-driven questions (210+ included)
- 📋 Public question browser
- 🔒 Admin panel for adding questions
- 🌙 Dark theme design
- 📱 Mobile responsive

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd LetsGoDeeper-nextjs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your actual values in `.env.local`

4. **Run development server**
   ```bash
   npm run dev
   ```

## Deployment to Vercel

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Add environment variables in Vercel dashboard:
   - `ADMIN_PASSWORD` - Your secure admin password
   - Database variables will be auto-added when you add Postgres

### 3. Add Database
1. In Vercel dashboard, go to Storage tab
2. Add "Postgres" (Neon)
3. Environment variables will be automatically added
4. Run migration: `npm run migrate` (or use Vercel's terminal)

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ADMIN_PASSWORD` | Password for admin access | Yes |
| `POSTGRES_URL` | Database connection string | Yes (auto-added by Vercel) |

## Routes

- `/` - Main game interface
- `/questions` - Browse all questions (public)
- `/add-question` - Add new questions (admin only)

## Security

- Admin panel protected by password authentication
- Environment variables for sensitive data
- Database queries with SQL injection protection
- Secure token-based session management

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run migrate` - Set up database tables with sample data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for your own conversations!