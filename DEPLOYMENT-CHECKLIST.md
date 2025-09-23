# Dokploy Deployment Checklist

## ✅ Pre-Deployment Checklist

### Project Files Ready:
- [x] `Dockerfile` - Node.js 22 with multi-stage build
- [x] `docker-compose.yml` - Environment variables configured
- [x] `next.config.js` - Standalone output enabled
- [x] `package.json` - All dependencies included
- [x] `.gitignore` - Excludes environment files
- [x] `.dockerignore` - Excludes secrets from Docker image
- [x] Source code in `src/` directory

### Security:
- [x] `.env` file excluded from git
- [x] `.env` file excluded from Docker image
- [x] Environment variables passed at runtime only

## 🚀 Dokploy Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for Dokploy deployment"
git push origin main
```

### 2. Create Application in Dokploy
- Application Type: **Docker Compose**
- Repository: Your GitHub repo
- Compose File: `docker-compose.yml`

### 3. Environment Variables to Add in Dokploy

Copy these from your `.env` file into Dokploy's Environment Variables UI:

```env
NODE_ENV=production
POSTGRES_URL=your-postgres-url
DATABASE_URL=your-database-url
ADMIN_PASSWORD=your-admin-password
API_KEY=your-google-api-key
SHEET_ID=your-google-sheet-id
NEXT_PUBLIC_STACK_PROJECT_ID=your-stack-project-id
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your-publishable-key
STACK_SECRET_SERVER_KEY=your-secret-key
NEXT_TELEMETRY_DISABLED=1
```

### 4. Deploy
- Click "Deploy" in Dokploy
- Monitor build logs
- Access your app via the provided URL

## 🔧 Post-Deployment

### Test These Endpoints:
- [ ] Main app: `https://your-domain.com`
- [ ] Categories API: `https://your-domain.com/api/categories`
- [ ] Questions page: `https://your-domain.com/questions`
- [ ] Admin page: `https://your-domain.com/add-question`

### Verify Features:
- [ ] Categories show "Laughs", "Stories", "Secrets"
- [ ] Questions load properly for each category
- [ ] Admin authentication works
- [ ] Responsive design works on mobile

## 🌐 Domain Setup (Optional)
- Add custom domain in Dokploy settings
- SSL will be configured automatically
- Update DNS records as instructed

## 📊 Monitoring
- Check application logs in Dokploy dashboard
- Monitor resource usage
- Set up alerts if needed