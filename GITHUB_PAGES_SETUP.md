# GitHub Pages Setup Instructions

## Issue: "There isn't a GitHub Pages site here"

This error appears when GitHub Pages hasn't been properly configured or the deployment hasn't completed yet.

## Solution: Enable GitHub Pages with GitHub Actions

Follow these steps to enable GitHub Pages for your repository using the official GitHub Actions method:

### Step 1: Access Repository Settings

1. Go to your repository: https://github.com/yasirsabriroyal/builderapps
2. Click on **Settings** (⚙️ icon in the top menu)

### Step 2: Configure GitHub Pages

1. In the left sidebar, scroll down and click **Pages**
2. Under **"Build and deployment"** section:
   - **Source**: Select **"GitHub Actions"** from the dropdown
   - This allows the official GitHub Actions workflow to deploy automatically
3. No need to click Save - it's automatic!

### Step 3: Trigger Deployment

The deployment will happen automatically on the next push, or you can trigger it manually:

**Option A: Automatic (Recommended)**
- Push any commit to the `main` or `copilot/create-home-builder-pwa` branch
- The workflow will run automatically

**Option B: Manual Trigger**
1. Go to the **Actions** tab in your repository
2. Click on **"Deploy to GitHub Pages"** workflow in the left sidebar
3. Click the **"Run workflow"** button on the right
4. Select the branch (e.g., `main` or `copilot/create-home-builder-pwa`)
5. Click **"Run workflow"**

### Step 4: Monitor Deployment

1. Go to the **Actions** tab
2. Watch the workflow execution (it should take 2-3 minutes)
3. Wait for both "build" and "deploy" jobs to complete successfully
4. You'll see a green checkmark ✓ when it's done

### Step 5: Access Your Site

Once deployment is complete, your site will be available at:

**https://yasirsabriroyal.github.io/builderapps/**

Note: It may take an additional 1-2 minutes for the site to be accessible after the workflow completes.

## Verification Checklist

✅ GitHub Pages source is set to "GitHub Actions"
✅ Workflow has been triggered (check Actions tab)
✅ Build job completed successfully
✅ Deploy job completed successfully
✅ Waited 2-3 minutes after deployment
✅ Visited the URL: https://yasirsabriroyal.github.io/builderapps/

## Common Issues

### Issue: "GitHub Actions" option not visible
- **Solution**: Ensure your repository is public (or has GitHub Pro for private repos)
- **Alternative**: Use the gh-pages branch method (see DEPLOYMENT_GUIDE.md)
- **Check**: Try refreshing the Settings page

### Issue: Workflow not running
- **Solution**: Make sure you've selected "GitHub Actions" as the Pages source
- **Check**: Settings → Pages → Source → "GitHub Actions"
- **Verify**: Actions are enabled in Settings → Actions → General

### Issue: Workflow failing
- **Solution**: Check the Actions tab for error details
- **Common fix**: Ensure all dependencies install correctly (`npm ci`)
- **Check**: The build passes locally with `npm run build`
- **Permissions**: Verify the workflow has proper permissions (pages: write, id-token: write)

### Issue: 404 on direct route access (e.g., /stage1)
- **Solution**: This is already handled by the 404.html file
- **Note**: All routes should work once deployed
- **Verify**: The 404.html file is present in the dist folder after build

### Issue: Page shows but styles are missing
- **Solution**: This is already handled by the base path configuration
- **Check**: Vite config has `base: '/builderapps/'`
- **Verify**: Assets are loading from the correct path in browser DevTools

## Files That Enable GitHub Pages

The following files make GitHub Pages work correctly:

1. **`.github/workflows/gh-pages-deploy.yml`** - Official GitHub Actions deployment workflow
2. **`public/.nojekyll`** - Prevents Jekyll processing (preserves _files)
3. **`public/404.html`** - Handles SPA routing for direct route access
4. **`index.html`** - Contains script to handle 404 redirects
5. **`vite.config.ts`** - Configured with correct base path (`/builderapps/`)
6. **`src/App.tsx`** - Router configured with basename

All of these are already set up in your repository!

## Support

If you continue to experience issues after following these steps:

1. Check the Actions tab for detailed error logs
2. Ensure your GitHub account has Pages enabled (most do by default)
3. Verify the repository is public (or has GitHub Pro for private repos with Pages)
4. Wait 5-10 minutes and try accessing the URL again

## Quick Reference Commands

```bash
# Build locally to test
npm install
npm run build

# Preview the build locally
npm run preview
# Visit: http://localhost:4173/builderapps/

# Check if files are generated correctly
ls -la dist/
# Should see: .nojekyll, 404.html, index.html, assets/
```

---

**Need more help?** Check the [GitHub Pages documentation](https://docs.github.com/en/pages)
