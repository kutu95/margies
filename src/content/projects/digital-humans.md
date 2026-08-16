---
title: "Digital Humans / Unreal Engine"
summary: "Experiments with MetaHumans, facial capture, photogrammetry and interactive historical characters — including a digital Captain Godfrey for the Georgette exhibition."
category: Real-time 3D / research
disciplines:
  - 3D
  - AI
  - Immersive
  - Research
technologies:
  - Unreal Engine
  - MetaHuman
  - Facial capture
  - Live Link Face
  - Photogrammetry
  - Meshroom
  - Blender
  - Voice systems
status: experimental
hero: /images/projects/digital-humans/hero.svg
heroAlt: Abstract wireframe-style placeholder for a digital human study
gallery: []
featured: true
order: 5
seoTitle: "Digital humans and Unreal Engine work — John Bowskill"
seoDescription: "Unreal Engine, MetaHuman, photogrammetry and voice-system experiments, including an interactive Captain Godfrey for the SS Georgette exhibition."
meta:
  Related project: SS Georgette 150th
---

I did not set out to become a digital-human person. I set out to put Captain John Godfrey in a room with visitors to an exhibition about his ship, and discovered that the available shortcuts were either lifeless or dishonest.

This page is the technical half of that work, and a place to keep the experiments that are not only about the Georgette.

## Captain Godfrey

The Georgette exhibition includes an interactive reconstruction of the ship’s captain. Visitors can speak with him. He is a MetaHuman, driven in Unreal Engine, with a voice system and a model that has been given the facts of the ship as I have been able to establish them.

It is not a séance and it is not a documentary. It is a way to hold a conversation with a historical figure whose ship is still on the bottom of a local bay. The ethics of that are worth arguing about. I would rather argue them in front of a working prototype than in the abstract.

How that work sits in the wider project is on [Building the Exhibition](/projects/ss-georgette-150th). The public exhibition is at [exhibition.margies.app](https://exhibition.margies.app/).

## The stack around a face

A digital human that can be looked at for more than a few seconds needs more than a downloadable MetaHuman. Facial capture, Live Link Face, photogrammetry (Meshroom and related tools), cleanup in Blender, and a voice pipeline all have to agree with each other. When they don’t, the result is the familiar valley: almost a person, therefore worse than a photograph.

I have been working through that pipeline as a set of experiments — what can be captured from a real face, what has to be invented, what should be left as an obvious construction. Some of this will stay in the exhibition. Some of it is simply me learning the tools hard enough to know when they are lying.

## Why keep it as its own project

Unreal Engine work, digital humans and interactive historical characters are useful beyond one wreck. They are also easy to oversell. This entry exists so the Georgette page does not have to carry every technical note, and so later characters or real-time pieces have somewhere to live.

<!-- TODO: Add stills from Unreal, MetaHuman tests, and photogrammetry captures. -->
