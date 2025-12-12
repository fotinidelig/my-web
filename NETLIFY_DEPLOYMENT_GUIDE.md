# Netlify Deployment Guide for byfotini.com

## 📋 Overview

This guide covers deploying your Astro portfolio website to Netlify with a focus on:
- **Privacy**: Minimizing data collection and tracking
- **Security**: Implementing best-practice security headers
- **Cost Management**: Optimizing builds to stay within free tier (300 build minutes/month)

---

## 🚀 Step-by-Step Deployment

### 1. **Prepare Your Repository**

Ensure your code is pushed to GitHub, GitLab, or Bitbucket:
```bash
git add .
git commit -m "feat(deploy): add Netlify configuration"
git push origin main
```

### 2. **Connect to Netlify**

1. Go to [netlify.com](https://netlify.com) and sign up/login
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect your Git provider (GitHub/GitLab/Bitbucket)
4. Select your repository (`my-web`)
5. Netlify should auto-detect:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - If not detected, enter these manually

### 3. **Configure Domain (byfotini.com)**

#### In Netlify Dashboard:
1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Enter: `byfotini.com`
4. Follow Netlify's DNS configuration instructions

#### In Your Domain Registrar:
You need to add DNS records at your domain registrar (where you purchased byfotini.com):

**Option A: Netlify DNS (Recommended - Free)**
- In Netlify: **Domain settings** → **DNS** → **Add DNS zone**
- Copy the nameservers provided by Netlify
- At your registrar, update nameservers to Netlify's nameservers

**Option B: External DNS (Keep current DNS provider)**
Add these DNS records:
```
Type: A
Name: @
Value: 75.2.60.5

Type: A
Name: @
Value: 75.2.60.5

Type: CNAME
Name: www
Value: byfotini.com
```

**Note**: Netlify will automatically provision SSL certificates via Let's Encrypt (free) once DNS is configured.

### 4. **Environment Variables (If Needed)**

Currently, your site doesn't use environment variables. If you add them later:
- Go to **Site settings** → **Environment variables**
- Add variables (e.g., `API_KEY`, `ANALYTICS_ID`)
- **Never commit secrets to Git** - use Netlify's environment variables

### 5. **Deploy Settings**

The `netlify.toml` file is already configured. Verify in Netlify:
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: 20 (specified in `netlify.toml`)

---

## 🔒 Privacy & Security Configuration

### Security Headers (Already Configured)

The `netlify.toml` includes:
- ✅ X-Frame-Options: Prevents clickjacking
- ✅ X-Content-Type-Options: Prevents MIME sniffing
- ✅ Content Security Policy: Restricts resource loading
- ✅ Referrer-Policy: Limits referrer information sent
- ✅ Permissions-Policy: Restricts browser features

### Privacy Considerations

#### 1. **Disable Netlify Analytics (Free Tier)**
- Netlify Analytics is **paid only** - you won't be charged accidentally
- If you want analytics, consider privacy-friendly alternatives:
  - **Plausible Analytics** (paid, privacy-focused)
  - **GoatCounter** (free tier available)
  - **Self-hosted Matomo** (if you have hosting)

#### 2. **Fonts Privacy** ✅
Your site **self-hosts fonts** for maximum privacy:
- ✅ Fonts (Cabin and Neonderthaw) are stored in `/public/fonts`
- ✅ No external requests to Google Fonts
- ✅ Improved privacy (no font requests tracked by third parties)
- ✅ Better performance (fonts served from your domain)
- ✅ CSP headers updated to only allow self-hosted fonts

#### 3. **External Resources**
Your projects use `opengraph.githubassets.com` for images. This is:
- ✅ Privacy-friendly (GitHub's CDN)
- ✅ Already allowed in CSP headers

#### 4. **No Third-Party Tracking**
Your site currently has:
- ✅ No Google Analytics
- ✅ No Facebook Pixel
- ✅ No other tracking scripts
- ✅ Theme preference stored in `localStorage` (client-side only)

---

## 💰 Cost Management (Free Tier)

### Build Minutes Budget: 300/month

**Estimated Build Time**: ~2-3 minutes per build

**Monthly Capacity**: ~100-150 builds/month

### Optimization Strategies

#### 1. **Build Optimization (Already Configured)**
- ✅ `ASTRO_TELEMETRY_DISABLED=1` - Saves ~5-10 seconds per build
- ✅ `NPM_FLAGS="--prefer-offline --no-audit"` - Faster installs
- ✅ Node version pinned (20) - Avoids version detection overhead

#### 2. **Reduce Unnecessary Builds**
- **Branch deploys**: Disable for non-main branches (if not needed)
  - Settings → Build & deploy → Deploy contexts
  - Uncheck "Deploy pull requests"
- **Build hooks**: Only trigger when necessary
- **Scheduled builds**: Avoid if not needed

#### 3. **Monitor Usage**
- Check build minutes: **Site settings** → **Usage**
- Set up email alerts: **Team settings** → **Notifications**

#### 4. **If You Exceed Limits**
- **Option A**: Upgrade to Pro ($19/month) - 1000 build minutes
- **Option B**: Optimize builds further (reduce dependencies, use build cache)
- **Option C**: Use Netlify's build cache (automatic, but verify it's working)

### Build Cache

Netlify automatically caches:
- `node_modules` (if `package-lock.json` exists) ✅
- Build artifacts (if configured)

To verify cache is working:
- Check build logs for "Restoring cache" messages
- Subsequent builds should be faster (~30-60 seconds vs 2-3 minutes)

---

## 🔧 Advanced Configuration

### Custom 404 Page

Create `public/404.html` or `public/404/index.html`:
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>404 - Page Not Found</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <h1>404 - Page Not Found</h1>
  <p><a href="/">Return to homepage</a></p>
</body>
</html>
```

### Redirects

Add to `netlify.toml`:
```toml
[[redirects]]
  from = "/old-page"
  to = "/new-page"
  status = 301
```

### Form Handling (If Needed)

If you add a contact form:
1. Use Netlify Forms (free tier: 100 submissions/month)
2. Add `netlify` attribute to form
3. No backend code needed

---

## ✅ Post-Deployment Checklist

- [ ] Site is accessible at `byfotini.com`
- [ ] HTTPS is enabled (automatic via Let's Encrypt)
- [ ] `www.byfotini.com` redirects to `byfotini.com` (or vice versa)
- [ ] Security headers are active (check with [SecurityHeaders.com](https://securityheaders.com))
- [ ] Build completes successfully
- [ ] All pages load correctly
- [ ] Images and assets load properly
- [ ] Dark mode toggle works
- [ ] Mobile responsive design works

### Test Security Headers

Visit: https://securityheaders.com/?q=https://byfotini.com

Expected grade: **A** or **A+**

---

## 🐛 Troubleshooting

### Build Fails

1. **Check build logs** in Netlify dashboard
2. **Common issues**:
   - Node version mismatch → Check `.nvmrc` matches `netlify.toml`
   - Missing dependencies → Run `npm install` locally first
   - TypeScript errors → Fix locally, then push

### Domain Not Working

1. **DNS propagation**: Can take 24-48 hours
2. **Check DNS**: Use [dnschecker.org](https://dnschecker.org)
3. **SSL certificate**: Wait 1-2 hours after DNS is correct

### Build Time Too Long

1. **Check cache**: Look for "Restoring cache" in logs
2. **Reduce dependencies**: Remove unused packages
3. **Optimize images**: Compress images before committing

---

## 📊 Monitoring & Maintenance

### Regular Checks

- **Weekly**: Review build minutes usage
- **Monthly**: Check for dependency updates (`npm audit`)
- **Quarterly**: Review security headers (re-test with SecurityHeaders.com)

### Updates

When updating your site:
1. Make changes locally
2. Test with `npm run build` and `npm run preview`
3. Commit and push
4. Netlify auto-deploys (watch build logs)

---

## 🔐 Security Best Practices

1. ✅ **Never commit secrets** - Use Netlify environment variables
2. ✅ **Keep dependencies updated** - Run `npm audit` regularly
3. ✅ **Review build logs** - Check for warnings/errors
4. ✅ **Monitor usage** - Stay within free tier limits
5. ✅ **Use HTTPS only** - Netlify handles this automatically

---

## 📚 Additional Resources

- [Netlify Documentation](https://docs.netlify.com)
- [Astro Deployment Guide](https://docs.astro.build/en/guides/deploy/netlify/)
- [Security Headers Explained](https://owasp.org/www-project-secure-headers/)
- [Netlify Free Tier Limits](https://www.netlify.com/pricing/)

---

## 🎉 You're All Set!

Your site is configured for:
- ✅ Privacy-friendly deployment
- ✅ Strong security headers
- ✅ Cost-efficient builds
- ✅ Custom domain support

If you need help, check Netlify's support or review the build logs for specific errors.

