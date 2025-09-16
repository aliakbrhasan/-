# Qurtuba Fashion (ازياء قرطبة)

This repository contains the Vite + React implementation of the "ازياء قرطبة" tailoring management interface. The design reference is available on [Figma](https://www.figma.com/design/knfTb4sE2UPSAXEr0AmvAR/%D8%A7%D8%B2%D9%8A%D8%A7%D8%A1-%D9%82%D8%B1%D8%B7%D8%A8%D8%A9).

## Getting started

1. Install dependencies with `npm install`.
2. Start the development server with `npm run dev`.

The app runs on [http://localhost:3000](http://localhost:3000) by default.

## Building for production

Run `npm run build` to generate the static production bundle in the `build/` directory.

## Deploying on Netlify

With the project now located at the repository root, configure Netlify as follows:

- **Base directory:** (leave blank, defaults to the repository root)
- **Build command:** `npm run build`
- **Publish directory:** `build`

These settings match the Vite configuration (`build.outDir = "build"`) and ensure the generated assets are deployed correctly.
