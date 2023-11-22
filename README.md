# AREA Project

## Overview

AREA is an automation platform inspired by Zapier and IFTTT, designed to enable users to create custom workflows by interconnecting various web services. This project allows users to automate tasks across different platforms, such as Yammer, Facebook, Twitter, OneDrive, and more, through a combination of Action and REAction components.

## Features

- **User Registration and Authentication**: Secure user registration and authentication process, including OAuth2 integration for services like Yammer, Facebook, Twitter, etc.
- **Service Subscription**: Allows users to subscribe to various services and configure them for automation.
- **Action and REAction Components**: Each service offers Action components to trigger events and REAction components to perform tasks based on those triggers.
- **Custom Workflow Creation (AREA)**: Users can create AREA by connecting an Action to a previously configured REAction, automating complex workflows.
- **Web and Mobile Support**: Compatible with both web and mobile platforms through a REST API.

Prerequisites
-------------

* Have docker installed on your machine
* Have a .env file.

Here the .env file to be completed with your data and placed at the root of the server folder:

```.env
# Connection string for MongoDB database
MONGODB_URL=

# Google OAuth credentials for web clients
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Spotify OAuth credentials for linking Spotify services
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=

# GitHub OAuth credentials for web clients
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# GitHub OAuth credentials for mobile clients
GITHUB_CLIENT_ID_MOBILE=
GITHUB_CLIENT_SECRET_MOBILE=

# Discord OAuth credentials for authenticating users
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=

# Secret key for signing JWT tokens
SECRET_KEY=

# Algorithm used for signing JWT tokens (e.g., HS256)
ALGORITHM=HS256

# JWT access token expiry time in minutes
ACCESS_TOKEN_EXPIRE_MINUTES=120

# Base URL for the web client
WEB_CLIENT_URL=http://localhost:8081

# Base URL for the API endpoints
API_URL=http://localhost:8080/api/v2

# Mailjet credentials for sending emails
MAILJET_SECRET_KEY=
MAILJET_API_KEY=

# Azure OAuth credentials for authenticating users
AZURE_CLIENT_SECRET=
AZURE_CLIENT_ID=
AZURE_TENANT_ID=

# Docker registry image name used in CI/CD pipelines
CI_REGISTRY_IMAGE=

# Flag for running the application in a testing mode (set to 'true' for testing)
TESTING=False

# Frequency for polling external services (in seconds)
POLLING=0.8
```

## Technology Stack

Below is the technology stack used in the AREA project, outlining the main components of the web client, mobile client, server, and CI/CD pipeline.

![Screenshot from 2023-11-22 11-44-58](https://github.com/EpitechPromo2026/B-DEV-500-LYN-5-1-area-kevin.carttigueane/assets/91593713/460b7772-5e55-4c6e-b604-9eccf093b1f3)

## Database Schema

The following diagram represents the database schema used in the AREA project, detailing the structure of tables and their relationships.
The database is use is **Mongodb** but for visualization purposes with design the relation using the sql.

![drawSQL-area-export-2023-11-22](https://github.com/EpitechPromo2026/B-DEV-500-LYN-5-1-area-kevin.carttigueane/assets/91593713/084b12c2-ff67-4061-b014-cb7e69d38365)


## Core maintainers :sunglasses:

- [Yann DEMUYT](https://github.com/demisIsTired)
- [Jules DUTEL](https://github.com/jvlxz)
- [Lucas HISSINGER](https://github.com/LucasHissinger)
- [Dylan WINTER](https://github.com/DylanWTR)

---

Made with a lot of :heart: and a bit of :brain:
