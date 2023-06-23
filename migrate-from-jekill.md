# Migrate from Jekyll

## Steps

- [ ] Copy name of file
- [ ] Create folder with same name
- [ ] Copy the image in
- [ ] Create index.md
- [ ] Copy text from post…md to index.md
- [ ] Change the front matter to the following
- [ ] Change the image to the following

## Front matter and image

```
title: $
description: $
date: 202$-$$-$$
tags:
  - $
  - $

<figure>
	{% image "image.png", "$", [600, 1200], "600px" %}
	<figcaption>$</figcaption>
</figure>
```

## Pages to migrate

| Status  | N   | Old URL                                                                                | New URL                                                                                     |
| ------- | --- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Done    | 1   | /lazyload-swiper-images-instances/                                                     | /blog/lazyload-swiper-images-instances/                                                     |
| Image!  | 2   | /lazy-load-responsive-images-in-2020-srcset-sizes-picture-webp/                        | /blog/lazy-load-responsive-images-in-2020-srcset-sizes-picture-webp/                        |
| Done    | 3   | /                                                                                      | /                                                                                           |
| Image!  | 4   | /aspect-ratio-modern-reserve-space-lazy-images-async-content-responsive-design/        | /blog/aspect-ratio-modern-reserve-space-lazy-images-async-content-responsive-design/        |
| Image!  | 5   | /do-we-need-lazy-loading-libraries-data-src-in-2022/                                   | /blog/do-we-need-lazy-loading-libraries-data-src-in-2022/                                   |
| Done    | 6   | /how-integrate-git-autocomplete-mac-shell-terminal-bash-zsh/                           | /blog/how-integrate-git-autocomplete-mac-shell-terminal-bash-zsh/                           |
| Nothing | 7   | /lazyload/                                                                             | /lazyload/                                                                                  |
| Done    | 8   | /using-css-variables-to-scale-layout-spaces/                                           | /blog/using-css-variables-to-scale-layout-spaces/                                           |
| Done    | 9   | /talks-how-and-why-to-optimize-web-performance-practical-tips-2023/                    | /blog/how-and-why-to-optimize-web-performance-practical-tips-2023/                          |
| Image!  | 10  | /vanilla-lazyload-vs-lazysizes/                                                        | /blog/vanilla-lazyload-vs-lazysizes/                                                        |
| Done    | 11  | /talks-how-and-why-to-optimize-web-performance-tips-trics-2023/                        | /blog/talks-how-and-why-to-optimize-web-performance-tips-trics-2023/                        |
| TBC     | 12  | /clever-way-serve-webp-modern-browsers-jpg-internet-explorer/                          | /blog/clever-way-serve-webp-modern-browsers-jpg-internet-explorer/                          |
| TBC     | 13  | /css-3-only-spinning-loading-animation/                                                | /blog/css-3-only-spinning-loading-animation/                                                |
| TBC     | 14  | /capping-image-fidelity-2x-minimize-loading-time/                                      | /blog/capping-image-fidelity-2x-minimize-loading-time/                                      |
| TBC     | 15  | /create-a-javascript-library-using-es2015-modules-gulp-rollup-jest/                    | /blog/create-a-javascript-library-using-es2015-modules-gulp-rollup-jest/                    |
| TBC     | 16  | /about/                                                                                | /about/                                                                                     |
| TBC     | 17  | /now-google-developer-expert-gde/                                                      | /blog/now-google-developer-expert-gde/                                                      |
| TBC     | 18  | /contact/                                                                              | /contact/                                                                                   |
| TBC     | 19  | /critical-css-jekyll-sass-github-pages/                                                | /blog/critical-css-jekyll-sass-github-pages/                                                |
| TBC     | 20  | /optimise-cls-loading-more-content-pagination/                                         | /blog/optimise-cls-loading-more-content-pagination/                                         |
| TBC     | 21  | /lazy-load-responsive-images-srcset/                                                   | /blog/lazy-load-responsive-images-srcset/                                                   |
| TBC     | 22  | /lazy-load-responsive-images-in-2019-srcset-sizes-more/                                | /blog/lazy-load-responsive-images-in-2019-srcset-sizes-more/                                |
| TBC     | 24  | /check-if-element-still-inside-viewport-after-given-time/                              | /blog/check-if-element-still-inside-viewport-after-given-time/                              |
| TBC     | 25  | /a-new-lazyload-to-improve-your-website-performance/                                   | /blog/a-new-lazyload-to-improve-your-website-performance/                                   |
| TBC     | 26  | /css-day-2022-talk-automating-responsive-images-automator-ottimizzazione-immagini-4-0/ | /blog/css-day-2022-talk-automating-responsive-images-automator-ottimizzazione-immagini-4-0/ |
| TBC     | 27  | /tables-look-like-lists-look-like-tables-accessible-responsive-design/                 | /blog/tables-look-like-lists-look-like-tables-accessible-responsive-design/                 |
| TBC     | 28  | /this-website-pwa/                                                                     | /blog/this-website-pwa/                                                                     |
| TBC     | 29  | /how-intergrate-git-autocomplete-mac-shell-terminal-bash-zsh/                          | /blog/how-intergrate-git-autocomplete-mac-shell-terminal-bash-zsh/                          |
| TBC     | 30  | /quicklink-case-study-faster-pages-increased-page-views/                               | /blog/quicklink-case-study-faster-pages-increased-page-views/                               |
| TBC     | 31  | /responsive-images-you-dont-need-picture-tag/                                          | /blog/responsive-images-you-dont-need-picture-tag/                                          |
| TBC     | 32  | /using-intersection-observers-to-create-vanilla-lazyload/                              | /blog/using-intersection-observers-to-create-vanilla-lazyload/                              |
| TBC     | 33  | /jquery_lazyload                                                                       | /blog/jquery_lazyload                                                                       |
| TBC     | 34  | /native-lazy-loading-with-vanilla-lazyload/                                            | /blog/native-lazy-loading-with-vanilla-lazyload/                                            |
| TBC     | 35  | /web-share-api-step-by-step/                                                           | /blog/web-share-api-step-by-step/                                                           |
| TBC     | 36  | /advanced-sprite-generation-using-compass-sass/                                        | /blog/advanced-sprite-generation-using-compass-sass/                                        |
| TBC     | 37  | /against-online-streaming-of-local-meetups-copy/                                       | /blog/against-online-streaming-of-local-meetups-copy/                                       |
| TBC     | 38  | /changing-text-color-for-contrast-based-on-background-lightness/                       | /blog/changing-text-color-for-contrast-based-on-background-lightness/                       |
| TBC     | 39  | /how-intergrate-git-autocomplete-mac-shell-terminal-bash-zsh                           | /blog/how-intergrate-git-autocomplete-mac-shell-terminal-bash-zsh                           |
| TBC     | 40  | /how-to-productively-use-the-new-chromium-based-microsoft-edge-browser/                | /blog/how-to-productively-use-the-new-chromium-based-microsoft-edge-browser/                |
| TBC     | 41  | /hybrid-lazy-loading-smashing-magazine-article/                                        | /blog/hybrid-lazy-loading-smashing-magazine-article/                                        |
| TBC     | 42  | /lazyload-conference-talk-automating-responsive-images-automator/                      | /blog/lazyload-conference-talk-automating-responsive-images-automator/                      |
| TBC     | 44  | /responsive-images-a-html-51-standard/                                                 | /blog/responsive-images-a-html-51-standard/                                                 |
| TBC     | 45  | /page2/                                                                                | /blog/                                                                                      |
