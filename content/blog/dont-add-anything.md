---
title: The hardest brief I ever got was "don't add anything"
description: A redesign where new features were off the table forced every improvement to come from arrangement, grouping and restraint. It's where most of the value in a dashboard lives anyway.
date: 2026-10-16
order: 6
category: design
cover: trackhawk
tags: dashboards, restraint, trackhawk
draft: true
---

Most redesign briefs come with a wishlist. The [Trackhawk](/work/trackhawk) brief came with a rule: minimal, easy access, group the data, and don't add a single feature.

At first that felt like designing with one hand tied. It turned out to be the best constraint I've had.

## The problem was arrangement, not features

The people watching the dots on a fleet map are dispatchers and owners, not engineers, and the product talked to them like engineers. Live tracking, the one job everyone opens the app for, was spread across many pages, with a flat menu of a dozen items and data shown raw.

A dispatcher wants to know where truck 14 is. He finds the map, but the unit's details live on another page. Alerts, geofences and history each on their own page. By the time he's sure, the truck has moved.

Nothing was missing. Everything was just in the wrong place.

## Group by the user's day

The flat menu became four groups: **Operations** (live tracking, alerts, maintenance), **Management** (units, trackers, geofences, automations), **Insights** (history, reports) and **Settings**. Same features, zero new ones, but now the menu reads like the dispatcher's day.

It's obvious in hindsight. That's usually the sign.

## Put the job on one page

The fleet list, the map and the selected unit now live together on one page. The old live tracking was spread over many pages; the new one is one page. That's the case study. The rest is detail.

## Design for a hundred, not for twelve

A screen that's lovely with twelve dots falls apart with a hundred. So the layout was designed and checked at 12, 40 and 100 units. That one habit caught more problems than any review.

## Numbers before tables

Reports and history pages used to open with a table. Now each opens with the handful of numbers a manager actually checks, and the table sits underneath for when they need it.

## The one exception

We allowed exactly one addition: per-unit alert settings, because users kept asking for it. When a constraint is that strict, the one thing you break it for tells you exactly what people need.

> "Don't add anything" forces the redesign to come from arrangement, grouping and restraint. That's where most of the value in a dashboard lives.
