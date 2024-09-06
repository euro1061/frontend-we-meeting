
# We-Meeting Frontend

We-Meeting is a web application for booking and managing meeting rooms. This repository contains the frontend code for the We-Meeting project.

![Logo](https://img5.pic.in.th/file/secure-sv1/We-Meeting.jpg)

## Table of Contents

- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Running the Application](#running-the-application)
- [Building for Production](#building-for-production)
- [Contributing](#contributing)
- [License](#license)

## Technologies Used

- [TypeScript](https://www.typescriptlang.org/)
- [Nuxt.js](https://nuxt.com/) (Vue.js framework)
- [Nuxt UI](https://ui.nuxt.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [dayjs](https://day.js.org/)
- [axios](https://axios-http.com/)
- [yup](https://github.com/jquense/yup)

## Project Structure

```
frontend-we-meeting/
├── components/      # Reusable Vue components
├── composables/     # Shared code (e.g., useBookingForm, useAuth)
├── layouts/         # Application layouts
├── pages/           # Application pages
├── plugins/         # Nuxt plugins
├── utils/           # Utility functions and API client
├── nuxt.config.ts   # Nuxt configuration file
├── tailwind.config.js # Tailwind CSS configuration
└── package.json     # Project dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js (version 14 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/frontend-we-meeting.git
   cd frontend-we-meeting
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following variables:
   ```
   API_BASE_URL=http://your-backend-api-url
   ```

## Running the Application

To run the application in development mode:

```
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`.

## Building for Production

To build the application for production:

```
npm run build
# or
yarn build
```

To start the production server:

```
npm run start
# or
yarn start
```

## Contributing

We welcome contributions to the We-Meeting project. Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the [MIT License](LICENSE).
