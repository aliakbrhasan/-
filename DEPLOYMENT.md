# Netlify Deployment Configuration

This project is configured for deployment on Netlify with the following setup:

## Configuration Files

- `netlify.toml` - Main Netlify configuration
- `ازياء قرطبة/public/_redirects` - SPA redirect rules
- `ازياء قرطبة/public/_headers` - Security and caching headers

## Build Configuration

- **Base Directory**: `ازياء قرطبة`
- **Publish Directory**: `build` (relative to base directory)
- **Build Command**: `npm run build`
- **Node Version**: 18

## Features

- Single Page Application (SPA) routing support
- Security headers for XSS protection
- Optimized caching for static assets
- Automatic redirects for client-side routing
- Code splitting for better performance
- ESM build configuration (no CJS deprecation warnings)

## Deployment

The project will automatically deploy when changes are pushed to the main branch. The build process:

1. Installs dependencies
2. Runs `npm run build`
3. Deploys the contents of the `build` directory
4. Applies redirect and header rules
