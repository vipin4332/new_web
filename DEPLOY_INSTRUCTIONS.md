# GitHub Deployment Instructions

## Steps to Deploy to GitHub:

### 1. Create a GitHub Repository (if you haven't already)
   - Go to https://github.com/new
   - Create a new repository (e.g., "tenx-frontend")
   - **Don't** initialize with README, .gitignore, or license
   - Copy the repository URL

### 2. Add Remote and Push
   Replace `YOUR_GITHUB_URL` with your actual repository URL:

```powershell
cd "D:\Project m\new copy\frontend"
git remote add origin YOUR_GITHUB_URL
git branch -M main
git push -u origin main
```

### 3. Enable GitHub Pages (for hosting)
   - Go to your repository on GitHub
   - Click on "Settings"
   - Scroll to "Pages" in the left sidebar
   - Under "Source", select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click "Save"
   - Your site will be available at: `https://yourusername.github.io/repository-name/`

## Example:
If your repository URL is `https://github.com/yourusername/tenx-frontend.git`:

```powershell
git remote add origin https://github.com/yourusername/tenx-frontend.git
git branch -M main
git push -u origin main
```

