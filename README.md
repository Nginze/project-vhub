
<a href="https://holoverse.me">
  <img alt="Holoverse - Immerse Yourself in Virtual Events" src="/frontend/public">
  <h1 align="center">Holoverse</h1>
</a>

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/tailwindcss-hotpink.svg?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Nodejs](https://img.shields.io/badge/nodejs-%23E34F26.svg?style=for-the-badge&logo=nodejs&logoColor=white)

<p align="center">
  Better Spaces to Host Online Events.
</p>

<p align="center">
  <a href="#tech-stack"><strong>Tech Stack</strong></a> •
  <a href="#features"><strong>Features</strong></a> •
  <a href="#deploy-and-run"><strong>Deploy and Run</strong></a>
</p>
<br/>

## Tech Stack

- [Next.js](https://nextjs.org/) – Framework
- [Typescript](https://www.typescriptlang.org/) – Language
- [Tailwind](https://tailwindcss.com/) – CSS
- [Redis](https://upstash.com/) – Redis
- [Bullmq](https://upstash.com/) – Message Queue
- [Mediasoup](https://mediasoup.org/) – Media Server
- [Postgresql](https://www.postgresql.org/) – Database
- [Node.js](https://nodejs.org/en) – Server

## Features

- **Customizable 2D Avatars**: Fully customizable avatars that reflect your unique style.
- **Themed Virtual Spaces**: Create and explore spaces with different themes, sizes, and privacy options.
- **Proximity Media Interactions**: Engage in natural conversations with audio and video that dynamically appear based on proximity.
- **Realtime Participant Status**: See who’s talking, who’s active, and more with real-time participant updates.
- **Interactive Elements**: Use virtual whiteboards and other tools to collaborate just like in the real world.
- **Media and Hardware Controls**: Full control over your experience with options like spatial audio, sound effects, and AI-powered noise cancellation.
- **Text Chat with Emojis & Emotes**: Engage with others through global text channels filled with emojis and animated emoticons.
- **Help Signals**: Raise your hand to get assistance in real time.

### Virtual Spaces

Holoverse offers fully customizable and themed spaces, where users can interact using their avatars. These spaces are designed to mimic real-world scenarios, offering a seamless blend of visual and auditory interaction.

![](https://raw.githubusercontent.com/Nginze/Anispace/master/uploads/RoomArea.png)

### Collaborative Tools

The platform includes interactive elements like whiteboards, allowing users to brainstorm and collaborate effectively within the virtual environment.

![](https://raw.githubusercontent.com/Nginze/Anispace/master/uploads/Feed2.png)

## Deploy and Run

### Prerequisites

- Node.js v14+
- PostgreSQL
- Redis
- Mediasoup dependencies

### Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/holoverse.git
   cd holoverse
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Configure Environment Variables:**

   Create a `.env` file in the root directory and add the following:

   ```env
   DATABASE_URL=your_postgresql_database_url
   REDIS_URL=your_redis_url
   MEDIASOUP_LISTEN_IP=your_server_ip
   ```

4. **Set Up the Database:**

   Run migrations to set up the PostgreSQL database schema:

   ```bash
   npx prisma migrate dev
   ```

### Running the Application

1. **Start the Development Server:**

   ```bash
   npm run dev
   ```

   The app should now be running on `http://localhost:3000`.

2. **Building for Production:**

   To build the application for production, use:

   ```bash
   npm run build
   ```

3. **Start the Production Server:**

   ```bash
   npm start
   ```

## Author

- [Nginze](https://github.com/nginze)
