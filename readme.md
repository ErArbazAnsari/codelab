# Codelab Platform

A full-stack web application for coding practice, problem solving, video tutorials, and community discussion. Built with React, Redux Toolkit, Tailwind CSS, Node.js, and Express.

## Features

- **User Authentication:** Login, signup, persistent sessions
- **Admin Panel:** Problem/video upload, delete, contest management
- **Problems & Submissions:** Solve coding problems, view submission history
- **Discussion Forum:** Discuss problems, share solutions
- **AI Chat:** Get AI-powered coding help
- **Leaderboard & Stats:** Track user progress and rankings
- **Video Tutorials:** Watch and upload solution videos
- **Dark/Light Theme:** Modern UI with theme toggle

## Tech Stack

- **Frontend:** React, Redux Toolkit, React Router, Tailwind CSS, DaisyUI, Vite
- **Backend:** Node.js, Express, MongoDB, Redis
- **Authentication:** JWT, cookies
- **Other:** Lucide icons, Axios

## Project Structure

```
readme.md
backend/
  index.js
  package.json
  middleware/
  src/
    config/
    controllers/
    models/
    routes/
    utils/
documentations/
  HLD.md
  LLD.md
frontend/
  index.html
  package.json
  src/
    App.jsx
    components/
    pages/
    store/
    utils/
```

## Getting Started

### Prerequisites
- Node.js & npm
- MongoDB & Redis (running locally or in cloud)

### Installation
1. Clone the repo:
   ```bash
   git clone <your-repo-url>
   cd codelab
   ```
2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

### Running Locally
1. Start backend server:
   ```bash
   cd backend
   npm start
   ```
2. Start frontend dev server:
   ```bash
   cd frontend
   npm run dev
   ```
3. Visit [http://localhost:5173](http://localhost:5173) in your browser.

## Documentation
- See `documentations/HLD.md` and `documentations/LLD.md` for high-level and low-level design.

## Contributing
Pull requests and issues are welcome! Please open an issue to discuss major changes.

## License
MIT

---
