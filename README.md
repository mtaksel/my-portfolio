# Mehmet Turgut Aksel — QA Portfolio

A compact, dark version of the original portfolio.

## Layout

Desktop uses three panels: profile and downloads, About Me with Skills & Interests, and the original four project cards. The project titles, descriptions, and images are retained, with scaled image areas. Education and professional journey remain available in an expandable section. My Music Taste has been removed.

On tablets the project panel moves below the other two panels. On mobile the panels stack naturally; no fixed viewport height or internal scrolling hides content.

## Local preview

Open `index.html`, or run:

```sh
python -m http.server 4173
```

Then visit http://localhost:4173. No dependencies or build step are required.

## Assets

- [CV](./assets/files/Mehmet-Turgut-Aksel-CV.pdf)
- [Cover letter](./assets/files/Mehmet-Turgut-Aksel-Cover-Letter.pdf)
- Original portrait and all four project images are preserved in `assets/images/`.

The page and project links work without JavaScript. The small script updates the year and navigation state. Asset paths support GitHub Pages under `/my-portfolio/`.
