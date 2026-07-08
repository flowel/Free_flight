# Free Flight Android

This directory contains the Android app scaffold for the Free Flight feature.

## Why this exists

The repository started with `fly_demo/`, a web demo used to validate:

- the main Free Flight page layout
- emotion feedback states
- breathing prompt behavior
- audio switching ideas
- flight animation presentation

This Android scaffold keeps that demo intact and creates a native starting point for the Android version.

## Current scope

The app currently includes:

- a Jetpack Compose app shell
- a home screen skeleton modeled after the existing web demo
- view state models for emotion, scene, period, and metrics
- clear TODO points for watch data, PAG animation, and audio integration

## Suggested next steps

1. Replace the sample state in `HomeViewModel` with real data sources.
2. Decide whether flight animation will use Lottie, PAG native rendering, or video.
3. Add a device/watch connection layer.
4. Add audio playback and breathing practice flows.
5. Split the current screen into feature modules if the app grows.
