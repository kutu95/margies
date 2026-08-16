---
title: "Metal My Mini"
summary: "Custom tabletop miniatures that start as an uploaded 3D file and end as a copper-plated object, with software tying the shop to the workshop."
category: Software / manufacturing
technologies:
  - 3D model upload
  - Automated file checking
  - Resin 3D printing
  - Copper electroplating
  - E-commerce workflow
  - Order management
status: live
url: https://metal.margies.app
urlLabel: Open Metal My Mini
hero: /images/projects/metal/hero.jpg
heroAlt: A copper-plated tabletop miniature standing on a hexagonal base
gallery: []
year: "2026"
featured: true
order: 2
seoTitle: "Metal My Mini — custom copper-plated miniatures — John Bowskill"
seoDescription: "Metal My Mini connects an online 3D-model upload service to resin printing and copper electroplating. Built with John Bowskill’s son."
meta:
  Live site: metal.margies.app
  Collaboration: Developed with John’s son
---

Metal My Mini is a small manufacturing service: a customer uploads a tabletop miniature, the file is checked, the model is printed in UV resin, then electroplated in copper and finished by hand.

[The live site is at metal.margies.app](https://metal.margies.app). I built the software side of this with my son. He runs the printing and plating. The interesting part, from my side of the bench, is not “an online shop”. It is the join between a browser and a physical process that can fail in very specific ways.

## The problem

A 3D file is not a product. It might be too thin to plate. It might have holes that only appear after printing. It might be the wrong scale, or a format that looks fine in a viewer and falls apart in a slicer. If you take payment and discover that later, you have a refund and a disappointed person. If you check every file by hand with no system, you have a bottleneck that does not scale past a kitchen table.

The work was to make a path from upload to finished object that a human can still interrupt.

## What the system does

The public site accepts STL, OBJ and 3MF files, takes the order, and puts the model into a review queue. Automated checks catch the obvious problems. A person still looks at the file before it goes near a printer. If it will not plate cleanly, the order is revised or refunded.

After that the physical process is deliberately old-fashioned: resin print, copper bath, polish, photograph, pack. The software’s job is to keep the state of each order honest — paid, reviewed, printing, plating, shipped — and to keep customer communication attached to the object rather than to a pile of emails.

## Why this belongs in a software portfolio

Most e-commerce templates assume the product already exists on a shelf. This one assumes the product will be grown out of a file, a printer and a tank of electrolyte. That changes the checkout, the admin tools, the failure cases and the photographs you show afterwards.

It is a useful example of software as the connective tissue for a real workshop, not as a destination in itself. The destination is a copper figure on someone’s table.

## What I would show someone who asked

The upload and review flow. The way an order can be stopped before it wastes resin. The fact that the public site and the manufacturing steps are one system. And the constraint that the plating is still done by a person who cares whether the cloak reads as metal.
