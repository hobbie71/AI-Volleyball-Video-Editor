# AI Volleyball Video Editor

A tool designed to transform raw volleyball footage into polished, YouTube-ready videos using artificial intelligence.

![Project Status](https://img.shields.io/badge/Status-In%20Development-yellow)
![License](https://img.shields.io/badge/License-MIT-blue)

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Project Status](#project-status)
- [Installation](#installation)
- [Usage](#usage)
- [Tech Stack](#tech-stack)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## 🏐 About

The AI Volleyball Video Editor is a specialized video editing application that leverages artificial intelligence to streamline the process of creating professional volleyball highlight reels and match videos. This tool is designed to help coaches, players, and content creators efficiently transform raw volleyball footage into engaging, shareable content.

## ✨ Features

- **AI-Powered Analysis**: Automatically detect key volleyball moments and plays
- **Video Timeline Management**: Intuitive timeline interface for precise video editing
- **Motion Effects**: Apply position, scale, and rotation effects to video clips
- **Real-time Preview**: Canvas-based video rendering with live preview
- **Multiple Video Support**: Import and manage multiple video files simultaneously
- **Export Ready**: Generate YouTube-ready video content

## 🚧 Project Status

**Current Phase**: Active Development - Feature Implementation & UI Polish

This project is currently under active development. The major refactoring phase is complete, implementing a UI-based file structure following React best practices. Core features are now implemented and the focus has shifted to feature enhancement and user interface polishing.

**What's Working**:

- ✅ Video import and library management
- ✅ Canvas-based video rendering
- ✅ Modular hook and component architecture
- ✅ Timeline-based video editing interface
- ✅ Motion effects system
- ✅ Export functionality

**Currently Working On**:

- 🔄 User interface polish and styling improvements
- 🔄 Advanced editing features
- 🔄 Performance optimizations

**Coming Soon**:

- 🔄 AI-powered video analysis
- 🔄 Enhanced user experience

## 🚀 Installation

### Prerequisites

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Git** - [Download here](https://git-scm.com/)
- **FFmpeg** - Required for video processing
  - **macOS**: `brew install ffmpeg`
  - **Windows**: [Download from ffmpeg.org](https://ffmpeg.org/download.html)
  - **Linux**: `sudo apt install ffmpeg` (Ubuntu/Debian) or equivalent for your distribution

### Backend Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/hobbie71/AI-Volleyball-Video-Editor.git
   cd AI-Volleyball-Video-Editor
   ```

2. Install server dependencies:

   ```bash
   cd server
   npm install
   ```

3. Start the backend server:
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:4000`

### Frontend Setup

1. Open a new terminal and navigate to the client directory:

   ```bash
   cd client
   ```

2. Install client dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The application will open in your browser at `http://localhost:5173`

### Required Packages

The installation process will automatically install all required dependencies including:

**Frontend**:

- React 18+ with TypeScript
- Vite (build tool)
- Canvas API for video rendering
- SCSS/CSS for styling
- UUID for unique identifiers

**Backend**:

- Express.js server
- TypeScript
- FFmpeg for video processing
- Multer for file uploads
- Enhanced error handling and validation

## 🎯 Usage

1. **Start the Application**: Follow the installation instructions above
2. **Import Videos**: Use the import form on the intro page to upload your volleyball footage
3. **Edit Timeline**: Navigate to the editing interface to arrange and trim video clips
4. **Apply Effects**: Use the sidebar controls to add motion effects and adjustments
5. **Preview**: Use the canvas player to preview your edits in real-time
6. **Export**: Export your finished video for sharing on YouTube and other platforms

## 🛠 Tech Stack

### Frontend

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Canvas API** - Video rendering
- **SCSS/CSS3** - Styling and design system

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web server
- **TypeScript** - Type safety
- **FFmpeg** - Video processing
- **Multer** - File handling

### Architecture

- **UI-Based folder structure** - UI-centric organization
- **Custom hooks** - Reusable logic
- **Context API** - State management
- **Pure functions** - Testable utilities

## 🤝 Contributing

This project is currently in active development. Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

**Javier Tamayo** - Developer

- GitHub: [@hobbie71](https://github.com/hobbie71)
- Project Link: [https://github.com/hobbie71/AI-Volleyball-Video-Editor](https://github.com/hobbie71/AI-Volleyball-Video-Editor)

---

**Note**: This project is under active development. Features and functionality are subject to change. For the latest updates and development progress, please check the repository regularly.
