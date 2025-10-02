# react-cismap
Our  (https://cismet.de) mapping (pattern) library for better reusability in different projects

![map](https://user-images.githubusercontent.com/837211/45474949-485fee00-b73b-11e8-85c1-982bd5fa71d6.png)

## What it is not?
It is not a replacement for Leaflet or react-leaflet. We also use these libraries. 

## What it is?
Patterns and supporting components that we need again and again in our projects are collected in this project.

For Example:
* named Layers
* Projected Maps and GeoJSON Collections
* Support for Poistion of the Map as Query Parameter
* Support for derived GeoJSON Marker Layers (no Tooltip bungling anymore)
* CSS Styled WMSTileLayer
* ...

## What can i do with it?
Please don't use it till the version number will go significally over 1.



--------

Map icon from http://www.kameleon.pics/free-icons-pack.html 

## Development setup

### Prerequisites

Make sure to use node v16.18.1

1. If on never version use nvm or your node version manager to switch to node v16.18.
```bash
nvm use v16.18.1
```

2. restart corepack to work with node v16.18.

```bash
corepack disable && corepack enable
```

### Installation

1. clone the repository
2. install with `yarn install`
3. run `yarn storybook` for testing