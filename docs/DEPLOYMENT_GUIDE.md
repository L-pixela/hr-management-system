# Cloud Deployment Guide - HR Management Microservices

Complete step-by-step guide to deploy your microservices to the cloud using **Render.com** (free tier) and **MongoDB Atlas** (free tier).

## 📋 Table of Contents
- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Part 1: MongoDB Atlas Setup](#part-1-mongodb-atlas-setup)
- [Part 2: Prepare Your Repository](#part-2-prepare-your-repository)
- [Part 3: Deploy to Render.com](#part-3-deploy-to-rendercom)
- [Part 4: Configure Services](#part-4-configure-services)
- [Part 5: Testing Deployment](#part-5-testing-deployment)
- [Part 6: CI/CD Integration](#part-6-cicd-integration)
- [Troubleshooting](#troubleshooting)
- [Cost Breakdown](#cost-breakdown)

---

## Overview

**Deployment Architecture:**

```
                    Internet
                       │
                       ▼
         ┌─────────────────────────┐
         │   Render.com (Free)     │
         │                         │
         │  ┌─────────────────┐   │
         │  │  Auth Service   │   │
         │  │  Port: 4000     │   │
         │  └────────┬────────┘   │
         │           │             │
         │  ┌────────▼────────┐   │
         │  │ Employee Service│   │
         │  │  Port: 4001     │   │
         │  └────────┬────────┘   │
         └───────────┼─────────────┘
                     │
          ┌──────────▼──────────┐
          │  MongoDB Atlas      │
          │  (Free M0 Cluster)  │
          │  512MB Storage      │
          └─────────────────────┘
```

**What you'll deploy:**
- ✅ Auth Service (authentication & JWT tokens)
- ✅ Employee Service (employee & department management)
- ✅ MongoDB Atlas (managed database)
- ✅ Automatic HTTPS/SSL
- ✅ CI/CD pipeline with GitHub Actions

**Total Cost:** $0/month (within free tier limits)

---

## Prerequisites

### Required Accounts
1. **GitHub account** (you already have this)
2. **MongoDB Atlas account** (free - sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas))
3. **Render.com account** (free - sign up at [render.com](https://render.com))

### Tools Needed
- Git installed on your computer
- Your code pushed to GitHub repositories

### Repository Structure
Your project should be in a GitHub repository with this structure:
```
project/
├── auth-service/
│   ├── Dockerfile
│   ├── src/
│   └── package.json
├── employee_service/
│   ├── Dockerfile
│   ├── src/
│   └── package.json
└── docker-compose.yml
```

---

## Part 1: MongoDB Atlas Setup

**Time Required:** 10 minutes

### Step 1.1: Create MongoDB Atlas Account

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Click **"Try Free"**
3. Sign up with Google, GitHub, or email
4. Complete registration

### Step 1.2: Create a Free Cluster

1. After login, you'll see **"Create"** or **"Build a Database"**
2. Click **"Create"**
3. Select **"M0 FREE"** tier:
   - ✅ 512 MB storage
   - ✅ Shared RAM
   - ✅ No credit card required

4. Choose cloud provider and region:
   - **Provider:** AWS (recommended)
   - **Region:** Choose closest to you or your users
     - Singapore (`ap-southeast-1`) - for Asia
     - US East (`us-east-1`) - for Americas
     - EU Ireland (`eu-west-1`) - for Europe

5. **Cluster Name:** `hr-microservices` (or any name you prefer)
6. Click **"Create Cluster"** (takes 3-5 minutes to provision)

### Step 1.3: Configure Database Access

**Create Database User:**

1. In left sidebar, click **"Database Access"** (under Security)
2. Click **"Add New Database User"**
3. Authentication Method: **"Password"**
4. Username: `microservices_user` (or your choice)
5. Password: Click **"Autogenerate Secure Password"** and **COPY IT**
   - Example: `K9mP3xR7nQ2wL5vT`
   - ⚠️ **SAVE THIS PASSWORD** - you'll need it later!
6. Database User Privileges: **"Read and write to any database"**
7. Click **"Add User"**

### Step 1.4: Configure Network Access

**Allow connections from Render.com:**

1. In left sidebar, click **"Network Access"** (under Security)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for Render.com dynamic IPs)
   - This adds `0.0.0.0/0`
   - ⚠️ This is safe because authentication is required
4. Click **"Confirm"**

### Step 1.5: Get Connection String

1. Go to **"Database"** in left sidebar
2. Click **"Connect"** button on your cluster
3. Select **"Connect your application"**
4. Driver: **Node.js**, Version: **5.5 or later**
5. **Copy the connection string:**
   ```
   mongodb+srv://microservices_user:<password>@hr-microservices.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

6. **Replace `<password>` with your actual password:**
   ```
   mongodb+srv://microservices_user:K9mP3xR7nQ2wL5vT@hr-microservices.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

7. **Create two connection strings** (one for each service):
   - Auth DB: Add `/auth_db` before the `?`:
     ```
     mongodb+srv://microservices_user:K9mP3xR7nQ2wL5vT@hr-microservices.xxxxx.mongodb.net/auth_db?retryWrites=true&w=majority
     ```
   - Employee DB: Add `/employee_db` before the `?`:
     ```
     mongodb+srv://microservices_user:K9mP3xR7nQ2wL5vT@hr-microservices.xxxxx.mongodb.net/employee_db?retryWrites=true&w=majority
     ```

8. **Save both connection strings** - you'll need them in Part 4!

✅ **MongoDB Atlas setup complete!**

---

## Part 2: Prepare Your Repository

**Time Required:** 5 minutes

### Step 2.1: Verify Dockerfiles

Make sure both services have proper Dockerfiles.

**Check `auth-service/Dockerfile`:**
```bash
cat auth-service/Dockerfile
```

**Check `employee_service/Dockerfile`:**
```bash
cat employee_service/Dockerfile
```

Both should exist and be properly configured.

### Step 2.2: Push to GitHub

Make sure your latest code is pushed:

```bash
cd e:/Cambodia_Academy_of_Digital_Technology/CADT-DevOps/project

# Check status
git status

# Add all changes
git add .

# Commit
git commit -m "Prepare for cloud deployment"

# Push to GitHub
git push origin main
```

✅ **Repository prepared!**

---

## Part 3: Deploy to Render.com

**Time Required:** 20 minutes

### Step 3.1: Create Render Account

1. Go to [render.com](https://render.com)
2. Click **"Get Started"**
3. Sign up with **GitHub** (recommended for easy integration)
4. Authorize Render to access your GitHub repositories

### Step 3.2: Deploy Auth Service

**Create the service:**

1. On Render dashboard, click **"New +"** → **"Web Service"**

2. **Connect Repository:**
   - Find your project repository
   - Click **"Connect"**

3. **Configure Service:**
   - **Name:** `hr-auth-service`
   - **Region:** Same as MongoDB (e.g., Singapore, Oregon, Frankfurt)
   - **Branch:** `main` (or `master` if that's your default)
   - **Root Directory:** `auth-service`
   - **Runtime:** `Docker`
   - **Instance Type:** **Free**

4. **Environment Variables:** (Click "Advanced" then "Add Environment Variable")
   
   Add these variables:
   ```
   PORT=4000
   NODE_ENV=production
   MONGO_URI=mongodb+srv://microservices_user:K9mP3xR7nQ2wL5vT@hr-microservices.xxxxx.mongodb.net/auth_db?retryWrites=true&w=majority
   JWT_SECRET=your_super_secure_production_secret_key_change_this_12345
   JWT_EXPIRES_IN=1h
   REFRESH_TOKEN_EXPIRES_IN=7d
   ```

   ⚠️ **Important:**
   - Replace `MONGO_URI` with your actual MongoDB connection string for `auth_db`
   - Generate a strong `JWT_SECRET` (use a password generator, 32+ characters)
   - **SAVE your JWT_SECRET** - you'll use the same one for employee service!

5. **Click "Create Web Service"**

   - Render will start building your Docker image
   - This takes 3-5 minutes
   - Watch the logs for any errors
   - Wait for status: **"Live"** (green)

6. **Save the service URL:**
   - Example: `https://hr-auth-service.onrender.com`
   - Click on the URL to test: add `/health` to check
   - Should return: `{"status":"ok"}`

### Step 3.3: Deploy Employee Service

**Repeat the same process:**

1. Click **"New +"** → **"Web Service"**

2. **Connect same repository**

3. **Configure Service:**
   - **Name:** `hr-employee-service`
   - **Region:** **Same as auth service**
   - **Branch:** `main` (or `master`)
   - **Root Directory:** `employee_service`
   - **Runtime:** `Docker`
   - **Instance Type:** **Free**

4. **Environment Variables:**
   ```
   PORT=4001
   NODE_ENV=production
   MONGO_URI=mongodb+srv://microservices_user:K9mP3xR7nQ2wL5vT@hr-microservices.xxxxx.mongodb.net/employee_db?retryWrites=true&w=majority
   JWT_SECRET=your_super_secure_production_secret_key_change_this_12345
   ```

   ⚠️ **Critical:**
   - Use your `employee_db` MongoDB connection string
   - **Use the EXACT SAME `JWT_SECRET`** as auth service!
   - This is required for JWT validation to work

5. **Click "Create Web Service"**

   - Wait for build to complete (3-5 minutes)
   - Status should show **"Live"**

6. **Save the service URL:**
   - Example: `https://hr-employee-service.onrender.com`
   - Test: `https://hr-employee-service.onrender.com/health`
   - Should return: `{"status":"ok"}`

✅ **Both services deployed!**

---

## Part 4: Configure Services

**Time Required:** 5 minutes

### Step 4.1: Update Service URLs

Since services need to communicate, we'll use direct URLs instead of nginx.

**For local testing, you used nginx. In production on Render:**
- Each service has its own public URL
- Clients connect directly to each service
- No reverse proxy needed (Render provides SSL for each service)

### Step 4.2: Test Service Health

```bash
# Test auth service
curl https://hr-auth-service.onrender.com/health

# Test employee service  
curl https://hr-employee-service.onrender.com/health

# Both should return: {"status":"ok"}
```

### Step 4.3: Note Your Service URLs

**Save these URLs for your API documentation:**

```
Auth Service Base URL:     https://hr-auth-service.onrender.com
Employee Service Base URL: https://hr-employee-service.onrender.com
```

**Your API endpoints are now:**
- `POST https://hr-auth-service.onrender.com/auth/register`
- `POST https://hr-auth-service.onrender.com/auth/login`
- `GET https://hr-auth-service.onrender.com/auth/me`
- `POST https://hr-employee-service.onrender.com/employees`
- `GET https://hr-employee-service.onrender.com/employees`
- `POST https://hr-employee-service.onrender.com/departments`
- etc.

✅ **Services configured!**

---

## Part 5: Testing Deployment

**Time Required:** 10 minutes

### Step 5.1: Test Authentication Flow

**1. Register a User:**

```bash
curl -X POST https://hr-auth-service.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!"
  }'
```

**Expected Response:**
```json
{
  "email": "test@example.com",
  "roles": ["EMPLOYEE"],
  "isLocked": false,
  "_id": "...",
  "createdAt": "...",
  "updatedAt": "..."
}
```

**2. Login:**

```bash
curl -X POST https://hr-auth-service.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!"
  }'
```

**Expected Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "..."
}
```

**Copy the `accessToken` value!**

**3. Test Protected Endpoint:**

```bash
# Replace <TOKEN> with your actual token
curl -X GET https://hr-auth-service.onrender.com/auth/me \
  -H "Authorization: Bearer <TOKEN>"
```

**Expected Response:**
```json
{
  "id": "...",
  "email": "test@example.com",
  "roles": ["EMPLOYEE"],
  "iat": ...,
  "exp": ...
}
```

### Step 5.2: Test Employee Service

**1. Create a Department:**

```bash
curl -X POST https://hr-employee-service.onrender.com/departments \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Engineering",
    "description": "Software Development Team"
  }'
```

**Expected Response:**
```json
{
  "name": "Engineering",
  "description": "Software Development Team",
  "status": "active",
  "_id": "...",
  "createdAt": "...",
  "updatedAt": "...",
  "__v": 0
}
```

**Copy the department `_id`!**

**2. Create an Employee:**

```bash
# Replace <DEPT_ID> with the department ID from above
curl -X POST https://hr-employee-service.onrender.com/employees \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@company.com",
    "position": "Software Engineer",
    "department": "<DEPT_ID>",
    "dateOfJoining": "2025-01-15",
    "status": "active"
  }'
```

**Expected Response:**
```json
{
  "name": "John Doe",
  "email": "john@company.com",
  "position": "Software Engineer",
  "department": "...",
  "dateOfJoining": "2025-01-15T00:00:00.000Z",
  "status": "active",
  "_id": "...",
  "createdAt": "...",
  "updatedAt": "...",
  "__v": 0
}
```

**3. List All Employees:**

```bash
curl -X GET https://hr-employee-service.onrender.com/employees \
  -H "Authorization: Bearer <TOKEN>"
```

✅ **Deployment working perfectly!**

---

## Part 6: CI/CD Integration

**Time Required:** 15 minutes

### Step 6.1: Update GitHub Actions Workflow

Your existing CI/CD pipeline already runs tests. Let's add automatic deployment to Render.

**Get Render Deploy Hook:**

1. In Render dashboard, go to your **auth-service**
2. Click **"Settings"** tab
3. Scroll to **"Deploy Hook"**
4. Copy the deploy hook URL (looks like: `https://api.render.com/deploy/srv-xxxxx?key=yyyyy`)

5. Repeat for **employee-service**

### Step 6.2: Add GitHub Secrets

1. Go to your GitHub repository
2. Click **"Settings"** → **"Secrets and variables"** → **"Actions"**
3. Click **"New repository secret"**
4. Add these secrets:

   **Secret 1:**
   - Name: `RENDER_AUTH_DEPLOY_HOOK`
   - Value: `https://api.render.com/deploy/srv-xxxxx?key=yyyyy` (auth service hook)

   **Secret 2:**
   - Name: `RENDER_EMPLOYEE_DEPLOY_HOOK`
   - Value: `https://api.render.com/deploy/srv-xxxxx?key=yyyyy` (employee service hook)

### Step 6.3: Update CI/CD Workflow

Your workflow file will be updated to include deployment after successful tests.

Now, **every push to main branch** will:
1. ✅ Run unit tests
2. ✅ Build Docker images
3. ✅ Run integration tests
4. ✅ **Automatically deploy to Render** (if tests pass)

### Step 6.4: Test CI/CD Pipeline

```bash
# Make a small change
echo "# Deployed to Render" >> README.md

# Commit and push
git add README.md
git commit -m "Test CI/CD deployment"
git push origin main
```

**Watch GitHub Actions:**
1. Go to your GitHub repo → **"Actions"** tab
2. Watch the workflow run
3. After tests pass, Render will automatically deploy
4. Check Render dashboard for deployment logs

✅ **Full CI/CD pipeline active!**

---

## Troubleshooting

### Issue: Service won't start on Render

**Symptoms:** Build succeeds but service shows error

**Solutions:**

1. **Check Logs:**
   - Go to Render service → **"Logs"** tab
   - Look for error messages

2. **Common Issues:**
   - **MongoDB connection fails:**
     - Verify connection string is correct
     - Check MongoDB Atlas IP whitelist includes `0.0.0.0/0`
     - Verify username/password are correct
   
   - **Port binding error:**
     - Ensure `PORT` env variable is set correctly
     - Make sure app listens on `process.env.PORT`

   - **Missing dependencies:**
     - Check `package.json` has all dependencies
     - Run `npm install` locally to verify

### Issue: "Service Unavailable" or very slow response

**Symptoms:** First request takes 30+ seconds

**Explanation:** Free tier services sleep after 15 minutes of inactivity

**Solutions:**
- ✅ This is normal behavior on free tier
- ✅ Service wakes up automatically (takes ~30 seconds)
- ✅ Use a uptime monitor (like [UptimeRobot](https://uptimerobot.com)) to ping your service every 5 minutes
- ✅ Or upgrade to paid tier ($7/month) for always-on services

### Issue: JWT authentication fails between services

**Symptoms:** Token validation returns 401 Unauthorized

**Solutions:**
1. **Verify JWT_SECRET is identical in both services:**
   - Go to Render → Auth Service → Environment
   - Go to Render → Employee Service → Environment
   - Both `JWT_SECRET` values must be exactly the same!

2. **Check token format:**
   - Ensure header is: `Authorization: Bearer <token>`
   - No extra spaces or characters

### Issue: MongoDB connection timeout

**Symptoms:** Services fail to connect to database

**Solutions:**
1. Check MongoDB Atlas cluster is running
2. Verify Network Access allows `0.0.0.0/0`
3. Test connection string locally:
   ```bash
   node -e "require('mongoose').connect('mongodb+srv://...').then(() => console.log('OK'))"
   ```

### Issue: Build fails on Render

**Symptoms:** Docker build errors

**Solutions:**
1. **Test build locally:**
   ```bash
   cd auth-service
   docker build -t test-auth .
   ```

2. **Check Dockerfile:**
   - Verify all paths are correct
   - Ensure `package.json` and `package-lock.json` exist
   - Check Node version compatibility

3. **View build logs:**
   - Render dashboard → Service → **"Events"** tab
   - Look for specific error messages

### Issue: Environment variables not loading

**Symptoms:** App crashes with "undefined" errors

**Solutions:**
1. Go to Render → Service → **"Environment"** tab
2. Verify all required variables are set
3. Click **"Save Changes"**
4. Manually trigger redeploy

---

## Cost Breakdown

### Free Tier Limits

**MongoDB Atlas (M0 Free):**
- ✅ 512 MB storage
- ✅ Shared RAM and CPU
- ✅ No credit card required
- ✅ Suitable for development/testing
- ⚠️ Limit: ~500-1000 concurrent connections

**Render.com Free Tier (per service):**
- ✅ 512 MB RAM
- ✅ 0.1 CPU
- ✅ 750 hours/month (~31 days)
- ✅ Automatic SSL certificates
- ⚠️ Services sleep after 15 min inactivity
- ⚠️ Slower build times

**Total Monthly Cost:** **$0**

### When to Upgrade

**Consider paid plans when:**
- You need services to be always-on (no sleep)
- You need more than 512 MB storage in MongoDB
- You need faster performance
- You have high traffic (>10k requests/day)

**Paid Options:**
- **Render:** $7/month per service (starter plan, no sleep)
- **MongoDB Atlas:** $9/month (M10 tier, 2GB storage, better performance)

**Total for production:** ~$23/month ($7×2 services + $9 database)

---

## Post-Deployment Checklist

After successful deployment, verify:

- [ ] Both services show "Live" status in Render
- [ ] Health endpoints return 200 OK
- [ ] User registration works
- [ ] Login returns valid JWT token
- [ ] Protected endpoints require authentication
- [ ] Employee CRUD operations work
- [ ] Department CRUD operations work
- [ ] MongoDB Atlas shows connection activity
- [ ] GitHub Actions CI/CD pipeline passes
- [ ] Auto-deployment works on push to main

---

## Next Steps

**1. Monitor Your Services:**
- Set up [UptimeRobot](https://uptimerobot.com) (free) to monitor uptime
- Configure alerts for downtime

**2. Update API Documentation:**
- Update `API_DOCUMENTATION.md` with production URLs
- Share with your team/users

**3. Security Improvements:**
- Rotate JWT_SECRET regularly
- Enable 2FA on MongoDB Atlas
- Review CORS settings for production
- Add rate limiting (already in auth-service)

**4. Performance Optimization:**
- Add database indexes for frequently queried fields
- Implement caching (Redis) if needed
- Monitor MongoDB performance in Atlas dashboard

**5. Backup Strategy:**
- MongoDB Atlas auto-backups (M10+ tier)
- Export critical data regularly
- Document restore procedures

---

## Useful Links

**Documentation:**
- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

**Monitoring Tools:**
- [UptimeRobot](https://uptimerobot.com) - Free uptime monitoring
- [MongoDB Atlas Monitoring](https://cloud.mongodb.com) - Built-in metrics

**Community:**
- [Render Community Forum](https://community.render.com)
- [MongoDB Community Forum](https://www.mongodb.com/community/forums/)

---

## Support

If you encounter issues:

1. Check troubleshooting section above
2. Review service logs in Render dashboard
3. Check MongoDB Atlas logs and metrics
4. Review GitHub Actions workflow logs
5. Test locally with Docker Compose first

**Common Commands:**

```bash
# Test locally before deploying
docker compose up --build

# Check service logs in Render CLI
npm install -g render

# View logs
render logs <service-name>

# Trigger manual deployment
curl -X POST https://api.render.com/deploy/srv-xxxxx?key=yyyyy
```

---

**Congratulations! 🎉**

Your microservices are now deployed to the cloud with:
- ✅ Free hosting on Render.com
- ✅ Managed MongoDB on Atlas
- ✅ Automatic HTTPS/SSL
- ✅ CI/CD pipeline with GitHub Actions
- ✅ Zero monthly cost

Your HR Management System is production-ready!

---

**Last Updated:** December 25, 2025  
**Deployment Platform:** Render.com + MongoDB Atlas  
**Total Setup Time:** ~60 minutes  
**Monthly Cost:** $0 (Free Tier)
