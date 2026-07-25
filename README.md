# Aurelija Budreckyte — Portfolio

A responsive personal portfolio focused on cybersecurity, data integrity, and
security operations. The site is intentionally dependency-free so it can be
hosted directly with GitHub Pages.

## Pages

- `index.html` — résumé-led portfolio, experience, credentials, work, and personal story
- `soc-triage.html` — interactive SOC alert-triage project demo

## Local preview

From the project directory:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## GitHub Pages

After pushing the repository to GitHub:

1. Open **Settings → Pages** in the repository.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select the default branch and the `/ (root)` folder.
4. Save. GitHub will publish the site at the URL shown in the Pages panel.

## Privacy and assets

The original phone photos are intentionally excluded from Git because they may
contain EXIF location data. The WebP files in `assets/` are resized derivatives
saved without EXIF metadata.
