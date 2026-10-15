# How to add a blog post (English + Arabic)

Every story has two files with the same name:

    my-new-post.md      → English   alaa-ali.com/blog/my-new-post/
    my-new-post.ar.md   → Arabic    alaa-ali.com/blog/my-new-post/ar/

Start each file with this block, then write the post below it:

```
---
title: The title of the post
description: One sentence that shows under the title and in Google / link previews.
date: 2026-10-20
category: design    (about | design | girls | drawing | podcast | clients)
order: 1            (only breaks ties between posts on the same date)
cover: family       (name of one of your drawings, see below)
tags: ux, kids
featured: true      (optional: shows it big at the top of the blog)
draft: true         (true = hidden from the live site; false = public)
---
```

Write normally. `## ` makes a heading, `> ` makes a hand-drawn quote box,
`- ` makes a list, `**bold**`, `[link text](https://…)`, `---` makes a divider.
The Arabic file flips to right-to-left on its own.

Drawings you can use as `cover`: books, couch1, family, news, site, teach (+ -b / -c
versions), carseer, siba-list, trackhawk, contact, designer, teacher, consultant, creator, father,
podcast-breakfast, client-meeting, drawing-tools.
New drawings go in src/assets/blog/ as .webp.

Each version gets its own page, title, Google description, share preview, a link
to its twin in the other language (hreflang), and a place in the sitemap.
The "Blog" link appears in the menu as soon as one post is published.
