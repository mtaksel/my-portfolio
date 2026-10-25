# Mehmet Turgut Aksel — QA Portfolio

A compact dark portfolio with four equal desktop panels:

1. Profile, Software QA Tester role, and protected document downloads
2. About Me, Key Skills, and Interests
3. Education and 10 certifications listed on the [public LinkedIn profile](https://tr.linkedin.com/in/mehmeturgutaksel/en)
4. The original four projects, arranged vertically with their original images and descriptions

Headings are bold. Instagram and My Music Taste are removed. Tablet and mobile layouts stack the panels as needed, without hiding page content behind internal scrolling.

## Local preview

```sh
python -m http.server 4173
```

Visit http://localhost:4173. No dependencies or build step are needed for the site. Protected downloads require JavaScript and a secure browser context (HTTPS or localhost).

## Protected documents

The site serves only encrypted `.pdf.enc` payloads. The browser derives an AES-256-GCM key from the entered password with PBKDF2-SHA-256 (310,000 iterations). Each document has its own random salt and IV. A wrong password fails authenticated decryption; the password is never embedded in the site or saved to browser storage.

The original PDFs are kept outside this repository in a private local directory. To replace a document or rotate its password, set `PORTFOLIO_DOCUMENT_PASSWORD` in your shell and run:

```sh
node tools/encrypt-documents.mjs /path/to/private-pdfs
```

Supply both PDFs using their existing filenames, then clear the environment variable. Commit only the encrypted outputs. Do not add the originals or the password to this repository.

This protects the current site's document contents, not previous public copies: historical Git commits may still contain the old PDFs. A short numeric password can also be guessed offline; this static solution is not a substitute for server-side access control or rate limiting.

## Assets and deployment

All five original local images are retained. Relative asset paths support GitHub Pages under `/my-portfolio/`. Main page content, projects, and the expandable certification list work without JavaScript.

The certifications reproduce titles, issuers, and issue months visible on LinkedIn. The five additional entries expand inline; the panel links to LinkedIn for credential details.
