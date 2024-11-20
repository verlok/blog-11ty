---
title: "My experience at performance.now() 2024: Europe's premier web performance conference"
description: "A detailed account of my participation and insights gained from attending and contributing to performance.now(), the top web performance conference in Europe."
date: 2024-11-16
tags:
  - conferences
  - perf.now
---

From **November 14 to 15**, I attended [**performance.now**](https://www.perfnow.nl/) in **Amsterdam**, the most esteemed conference in the realm of web performance in Europe. As someone deeply embedded in this niche of web development, meeting other like-minded people at the event was both inspiring and invaluable.

<figure>
	{% image "cover.png", "performance.now() – Andrea Verlicchi – @verlok (he/him) – Speed Kit, IT, – Sponsors: Google, SpeedCurve, Mozilla, Akamai, Sentry. The image also contains stickers from Firefox, SpeedCurve #perfhero, No vanity metrics P50, Anti Javascript Javascript Club", [648, 1296], "648px" %}
	<figcaption>My performance.now 2024 badge, plus some swag and stickers</figcaption>
</figure>


## Exceptional Content and Speakers

<figure>
	{% image "schedule.png", "Schedule for first and second day, also available following the link in the figure caption", [648, 1296], "648px", true %}
	<figcaption>The <a href="https://perfnow.nl/schedule">schedule</a> for the two conference days.</figcaption>
</figure>

From the moment the conference commenced, it was evident that performance.now() stands out for its **high-caliber content and [speakers](https://perfnow.nl/speakers)**. Each session was meticulously curated, featuring industry leaders who covered a wide array of topics surrounding modern web performance challenges and solutions. 

Keynotes explored the evolving landscape of web speed, emphasizing the critical need for responsiveness and user-centric metrics. Talks addressed diverse subjects, from accessibility's impact on performance to practical strategies for improving Core Web Vitals, particularly INP (Interaction to Next Paint). Other presentations focused on advanced tooling, font optimization, and minimizing third-party script impacts. 

With in-depth case studies and future-focused discussions, the event showcased cutting-edge techniques and encouraged a holistic view of web performance.

## Connecting with like-minded professionals

One of the highlights of the conference for me was the opportunity to **connect with fellow professionals** who share the same passion for web performance. The numerous breaks and the lively after-party facilitated meaningful conversations and networking. It was refreshing to exchange ideas, discuss challenges, and explore potential collaborations with peers who truly understand the intricacies of our field.

In addition to attending, I had the honor of contributing to the conference in two significant ways. 

### Contributing in the help desk sponsored by Google

<figure>
	{% image "helpdesk_skyscanner.png", "Me at the help desk session with Morten Sorth and Ismail Gunsaya from Skyscanner", [648, 1296], "648px", true %}
	<figcaption>Morten Sorth and Ismail Gunsaya from Skyscanner asking me about INP optimization</figcaption>
</figure>

One of the key highlights for me was participating in the **Google-sponsored Help Desk**, where I engaged with attendees for about half an hour, answering their questions and offering solutions to their web performance challenges. This experience not only allowed me to give back to the community but also to learn from the diverse array of problems and perspectives presented by other professionals.


### Participating in **Henri Helvetica's live interview on YouTube**

<figure>
	{% image "henri-helvetica-and-me.webp", "Henri Helvetica and with a green and a red microphone during the live streaming", [648, 1296], "648px", true %}
	<figcaption>Henri Helvetica and me during the live streaming</figcaption>
</figure>

One of the key highlights for me was participating in **Henri Helvetica's live interview on YouTube**. Being interviewed by Henri provided an opportunity to share my experience and background with a broader audience. The interview delved into my personal background and personal challenges, and I loved that.

Check out [Henri Helvetica's Youtube channel](https://www.youtube.com/channel/UC927gvqy8i0vw0q5-6-WWBA).

## Pre-event: Performance.Sync by Mozilla

**On November 13**, the day before Performance.now, I also had the pleasure of taking part in **Performance.Sync**, an event organized by Mozilla. During this session, my good colleague Brian Louis Ramirez presented on the topic of "**Finding the needle in the haystack**", which focused on identifying anomalies in **Real User Monitoring (RUM) data**. 

Brian's insights into effectively sifting through vast amounts of performance data to pinpoint critical issues were both enlightening and highly practical. Participating in Performance.Sync provided a deeper understanding of advanced data analysis techniques and reinforced the importance of meticulous monitoring in optimizing web performance.

<figure>
	{% image "brian-perf-sync-needle-haystack.JPG", "Brian Louis Ramirez on stage at Performance.sync 2024", [648, 1296], "648px", true %}
	<figcaption>Madames et messieurs, <a href="https://screenspan.net/">Brian Louis Ramirez</a> on stage</figcaption>
</figure>


## Captured insights and follow-ups

Throughout the conference, I took some notes that I will carefully review at a second time, as some of them inspired actions on my side.

- SpeedCurve wrote a [comprehensive web performance guide](https://www.speedcurve.com/web-performance-guide/)
- Good idea to correlate conversion rate and INP
- Only alert on the KPI changes, not when enablers changed
- Bucket type of regressions in moderate, acceptable and critical, based on the % of regression
- When a regression happened, triage who, wht, when, where and why it happened
- ~Lazy loaded images can be decoded asynchronously, but eagerly loaded images should not.~ Contested, see [what `decode=async` actually does](https://www.tunetheweb.com/blog/what-does-the-image-decoding-attribute-actually-do/). 
- The new annotations functionality on Chrome Dev Tools will be very useful to me and other professionals
- We can use [crbug.com/new](https://crbug.com/new) to report bugs to the Chromium project and eventually request new features
- Chrome developer is moving the insights from the Performance Insights panel to the Performance panel -- there is one for CSS performance too, if you trace with the "Selector stats (slow)" option active
- Variable fonts are lighter only if you use 2 or more variations of the font, otherwise just load the single variation (e.g. the bold version for titles)
- The CSS overview tab in developer tools gives you the idea of how many instances of the page are using which fonts
- There's a new working group for incremental font transfer, to download only the portion of the font users currently need
- `size-adjust` (at box size) and `font-size-adjust` (at font level) are useful to try and render the fallback font like the web font. I noted there is a css-size-adjust-tester tool, which I can't find at the moment, whereas I found [Brian Louis Ramirez's fallback font generator](https://screenspan.net/fallback/).
- Google Publisher Tag (GPT) has a [feature to yield to the main thread](https://developers.google.com/publisher-tag/reference#googletag.config.PageSettingsConfig.threadYield) to optimize INP
- When there are gaps in commit events in dev tools, look in other tracks or load the trace in Perfetto to find out why

These notes have been instrumental in formulating follow-up actions and integrating new techniques into my workflow, and also for my pet projects. Sharing these insights will undoubtedly benefit others who are passionate about advancing their web performance skills.


## Reflecting on the Experience

<figure>
	{% image "attendees.webp", "Front rows attendees of performance.now()", [648, 1296], "648px", true %}
	<figcaption>I like to be in the front rows to visually engage with the speakers</figcaption>
</figure>

Attending Performance.now was a rewarding experience that reinforced my commitment to excellence in web performance. The blend of **high-level content, expert speakers, and a vibrant community** makes it an unmissable event for anyone in this niche. I look forward to applying the knowledge gained and contributing further to the ongoing dialogue in our field.

If you’re passionate about web performance and looking to elevate your skills, I highly recommend attending Performance.now. It’s not just a conference; it’s a gathering of the brightest minds dedicated to pushing the boundaries of what’s possible on the web.

*Feel free to reach out if you have any questions about the conference or web performance in general!*