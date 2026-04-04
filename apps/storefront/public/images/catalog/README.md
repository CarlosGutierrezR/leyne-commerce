# Catalog Image Convention

This folder is the canonical asset layer for the storefront catalog UI.

## Naming rules

- Categories: `categories/<category-slug>/cover.<ext>`
- Collections: `collections/<line-slug>/<collection-slug>/cover.<ext>`
- Brand assets: `brand/<brand-slug>/logo-<variant>.<ext>`

## Current usage

- Files in this folder are stable copies created from the legacy image library already present in `public/images`.
- The legacy folders remain untouched so existing product image URLs coming from the backend do not break.
- New UI sections in the home should prefer this canonical layer instead of reading directly from mixed legacy folder names.
