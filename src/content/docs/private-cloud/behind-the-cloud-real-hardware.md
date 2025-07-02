---
title: Behind the Cloud - Real Hardware
description: My journey building a private cloud with Raspberry Pi and k3s.
---

## Introduction

When I think about the cloud, I see something virtual, far away, and almost magic. But behind the cloud, there are real machines, cables, and blinking lights. This is the beginning of my story building a mini private cloud at home. I bought some Raspberry Pis one month ago and I am still in the building process. My goal is simple: become a better cloud engineer by touching real hardware.

## My Motivation

I worked on a research project about cloud infrastructure and the internet backbone. This made me realize something important. Since the start of my career, I have always used the cloud, both private and public. But I never really worked with physical network devices like switches or routers. Maybe I touched them for five minutes at school. Otherwise, everything was and still is virtual.

## Project Context

In my spare time, I work with researchers in economics. I help them build software and infrastructure for their work. Their projects include collecting data (daily, weekly, or monthly), analyzing data with Python or databases, and soon, using AI. The systems are used for automated background tasks like data collection, and for day-to-day analysis when researchers need to get or query data directly. Because of this, maintenance must be planned carefully to fit between data collection and analysis. This makes the challenge more interesting. It's production, so I can't delete everything and restart from scratch. But I can plan maintenance to limit the stress of updates.

## Technology Choices and First Steps

From this context, I had to make some technology choices that would fit both the hardware and the needs of the users.

### Choices and Progress

- At first, I installed Kubernetes. But I saw that k3s—a lightweight Kubernetes distribution designed for small devices—is better for Raspberry Pi and simpler to maintain, so I switched to this solution.
- I use Ansible to automate the setup. It helps me configure the Raspberry Pis, install k3s, and keep everything consistent and automated.
- The first application to deploy is a Django application using Celery.

### What’s Next

In the next post, I will share more details about the hardware, expenses, and the first deployment steps.

## Summary

This is just the beginning of my private cloud journey. I hope my experience will help others who want to learn more about real hardware and cloud technologies. Stay tuned for the next part!
