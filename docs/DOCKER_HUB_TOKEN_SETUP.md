# Fix Docker Hub Authentication Error

## Error: "access token has insufficient scopes"

This error means your Docker Hub access token doesn't have the correct permissions.

## Solution: Generate New Access Token

### Step 1: Create Docker Hub Access Token

1. **Go to Docker Hub**: https://hub.docker.com
2. **Login** with your credentials
3. Click your **username** (top right) → **Account Settings**
4. In left sidebar, click **Security**
5. Scroll to **Access Tokens** section
6. Click **New Access Token**

### Step 2: Configure Token Properly

**IMPORTANT Settings:**

- **Access token description**: `github-actions-hr-system`
- **Access permissions**: Select **Read, Write, Delete** ✅

⚠️ **Common Mistake**: If you select "Public Repo Read-only", it will fail!

### Step 3: Save the Token

1. Click **Generate**
2. **COPY THE TOKEN IMMEDIATELY** - you won't see it again!
3. Save it temporarily in a secure location (you'll delete this after adding to GitHub)

### Step 4: Update GitHub Repository Secrets

1. **Go to your GitHub repository**
2. Navigate to: **Settings** → **Secrets and variables** → **Actions**
3. Find `DOCKERHUB_TOKEN` in the list
4. Click the **Update** button (or **Add** if it doesn't exist)
5. **Paste your new token** in the Secret field
6. Click **Update secret**

### Step 5: Verify DOCKERHUB_USERNAME

While you're in GitHub Secrets:

1. Check `DOCKERHUB_USERNAME` secret exists
2. Verify it matches your Docker Hub username **exactly** (case-sensitive)
3. Example: If your Docker Hub username is `john_doe`, the secret should be `john_doe` (not `John_Doe`)

### Step 6: Re-run the Workflow

1. Go to **Actions** tab in GitHub
2. Find the failed workflow run
3. Click **Re-run all jobs**

OR make a dummy commit:
```bash
git commit --allow-empty -m "Test Docker Hub deployment"
git push
```

## Quick Checklist

Before pushing again, verify:

- [ ] Access token has **Read, Write, Delete** permissions
- [ ] `DOCKERHUB_TOKEN` secret is updated in GitHub
- [ ] `DOCKERHUB_USERNAME` matches your Docker Hub username exactly
- [ ] Token is **NOT** expired
- [ ] You're logged into the correct Docker Hub account

## Alternative: Test Locally

Test your credentials locally before pushing:

```bash
# Login with your credentials
docker login -u YOUR_USERNAME

# Enter your access token when prompted for password (NOT your Docker Hub password)

# If successful, you'll see:
# Login Succeeded
```

## Still Having Issues?

### Check 1: Token Expiration

Access tokens can expire. If your token is old, generate a new one.

### Check 2: Docker Hub Account Status

Make sure your Docker Hub account is in good standing and not suspended.

### Check 3: Repository Naming

The workflow creates repositories like:
- `YOUR_USERNAME/hr-auth-service`
- `YOUR_USERNAME/hr-employee-service`

Make sure you don't have existing repositories with these names that have different permissions.

### Check 4: Network/Proxy Issues

If you're behind a corporate firewall, it might block Docker Hub. Test from a different network.

## Common Errors and Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| "401 Unauthorized: access token has insufficient scopes" | Token doesn't have Write permission | Regenerate token with Read, Write, Delete |
| "Invalid username/password" | Wrong credentials | Verify DOCKERHUB_USERNAME and DOCKERHUB_TOKEN |
| "repository does not exist" | Wrong username in secret | Fix DOCKERHUB_USERNAME to match exactly |
| "denied: requested access to the resource is denied" | No permission to push | Check token permissions and account access |

## Security Notes

⚠️ **NEVER** commit your Docker Hub token to the repository!
✅ **ONLY** store it in GitHub Secrets
🔒 **ROTATE** tokens every 6-12 months
🗑️ **DELETE** old tokens after creating new ones

---

**Need More Help?**

If you're still having issues after following these steps:

1. Double-check all steps above
2. Try deleting and recreating both secrets
3. Ensure you're using an access token, NOT your Docker Hub password
4. Check Docker Hub status page: https://status.docker.com/

---

**Last Updated**: December 25, 2025
