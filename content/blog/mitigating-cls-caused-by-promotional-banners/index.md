---
title: "Mitigating CLS Caused by Promotional Banners: A Practical Solution"
description: "Exploring a practical solution for mitigating Cumulative Layout Shift (CLS) caused by promotional banners. Prevent unexpected layout shifts by using sessionStorage to remember the banner's content and display state across page loads."
date: 2024-08-26
tags:
  - web performance
  - cumulative layout shift
---

<figure>
	{% image "screenshot.png", "The home page of a website with a top promotional banner pushing down the content below it", [648, 1296], "648px" %}
	<figcaption>A website with a top promotional banner pushing down the content below it</figcaption>
</figure>

**Cumulative Layout Shift (CLS)** is a core web vital metric that measures visual stability. It occurs when content on a web page moves unexpectedly, often causing user frustration.

One common cause of CLS is a **promotional banner being injected at the top of the page** after the main content has already loaded. This would push down other elements on the page, leading to a poor user experience. Unluckily, this is a very common problem occurring in the websites I've been working on or consulting for.

In this blog post, we'll explore a method to mitigate CLS by reserving space for a promotional banner using session storage. This approach ensures that the banner doesn't cause layout shifts on subsequent page loads, leading to a more stable and user-friendly experience.

## The Problem

In the scenario described before, the logic to determine whether to show this banner is executed via JavaScript, often after the page's content is already visible. This results in a layout shift, where all content below the banner is suddenly pushed down, causing a jarring user experience.

## The Solution

To solve this problem, we can use `sessionStorage` to remember the banner's content and state during the user's session. By doing this, we can inject the banner's content immediately when the page loads, preventing any layout shift. If the user has closed the banner, we ensure it remains hidden for the rest of the session, so it isn't shown on the next page load.

Here's how we can implement this:

1. **Check if the banner was previously closed**:<br>We first check if the user has closed the banner in their current session. If they have, we don’t display it again.

2. **Inject the banner's content**:<br>If the banner was not closed and there is saved content in session storage, we inject it into the page as soon as possible. This prevents the layout from shifting when the banner is eventually loaded.

3. **Save the banner's content**:<br>When the promotional content is fetched for the first time, we save it to session storage. This allows us to reuse it on subsequent page loads without causing a layout shift.

4. **Handle banner closure**:<br>If the user closes the banner, we set a flag in session storage to ensure it doesn’t reappear during the same session.

## Implementation

Find here the [GitHub repository](https://github.com/verlok/cls-issue-promotional-banner-mitigation/) with the code and the [live demo](https://verlok.github.io/cls-issue-promotional-banner-mitigation/) on GitHub Pages.

For your convenience, here's the code copy-pasted from the demo page.

```js
document.addEventListener("DOMContentLoaded", function () {
  const bannerContainerId = "promo-banner"; // ID of the banner container
  const bannerSessionKey = "promoBannerContent";
  const bannerClosedKey = "promoBannerClosed";

  // Function to check if the banner was closed by the user
  const isBannerClosed = () =>
    sessionStorage.getItem(bannerClosedKey) === "true";

  // Check if the banner was previously closed by the user. If yes, do nothing.
  if (isBannerClosed()) return;

  // Function to inject the banner into the page
  const injectBanner = (bannerContent) => {
    const bannerContainer = document.getElementById(bannerContainerId);
    if (bannerContainer) {
      bannerContainer.innerHTML = bannerContent;
      bannerContainer.style.display = "block";
    }
  };

  // 👀 Check if banner content exists in sessionStorage, and eventually inject it
  const savedBannerContent = sessionStorage.getItem(bannerSessionKey);
  if (savedBannerContent) {
    injectBanner(savedBannerContent);
  }

  // Function to simulate the fetch of the promotion.
  const loadPromotion = () => {
    setTimeout(() => {
      const bannerContent = "<div>Your promotion content here</div>";

      // Inject the banner content
      injectBanner(bannerContent);

      // 👀 Save the banner content to sessionStorage for the next time
      sessionStorage.setItem(bannerSessionKey, bannerContent);
    }, 600);
  };

  // Function to handle banner close action
  const closeBanner = () => {
    sessionStorage.setItem(bannerClosedKey, "true");
    const bannerContainer = document.getElementById(bannerContainerId);
    if (bannerContainer) {
      bannerContainer.style.display = "none";
    }
  };

  // Simulate fetching the promotion
  loadPromotion();

  // Example event listener for closing the banner
  document
    .getElementById("close-banner")
    .addEventListener("click", closeBanner);
});
</script>
```

## How It Works

- **Session Storage**: This is used to store the promotional content and the closed state of the banner. The data persists across page loads within the same session, ensuring the user experience is consistent.
- **Immediate Injection**: By immediately injecting saved content into the page, we prevent any layout shift that would occur if the banner were loaded after the page was fully rendered.
- **User Control**: If the user closes the banner, it won't reappear during the same session, ensuring the user’s preference is respected.

## Conclusion

By leveraging session storage to manage the display of promotional banners, you can significantly reduce CLS on your website. This approach not only enhances the user experience but also improves your site’s performance metrics, contributing to better SEO and higher engagement rates.

This method is particularly useful for websites with dynamic content, where the decision to show certain elements is made after the page has loaded. By planning for these elements ahead of time, you can create a smoother, more stable experience for your users.

---

This approach is a simple yet effective way to address one of the common causes of CLS, and can be implemented with minimal changes to your existing codebase.
