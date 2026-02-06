# 📊 GitHub Stats Analyzer

A beautiful, modern web application that generates visual breakdowns of programming language usage for any GitHub user or repository.

![React](https://img.shields.io/badge/React-19.2-61dafb?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.2-646cff?style=flat-square&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8?style=flat-square&logo=tailwindcss)

## ✨ Features

- **User Analysis**: Analyze any GitHub user's language usage across their public repositories
- **Repository Analysis**: Get detailed language breakdown for specific repositories  
- **Beautiful Donut Chart**: Interactive visualization with smooth animations
- **GitHub-Styled UI**: Dark theme matching GitHub's aesthetic
- **Real-time Data**: Fetches live data from GitHub's public API
- **Shareable URLs**: Search queries are saved in the URL for easy sharing
- **Rate Limit Handling**: Graceful fallback to demo data when API limits are reached
- **Responsive Design**: Works beautifully on all screen sizes
- **Embeddable Stats Card**: Generate SVG cards for your GitHub README

## 🖼️ Embed in Your GitHub README

Add a beautiful language stats card to your GitHub profile or any README!

### Quick Start

Add this to your `README.md`:

```md
![GitHub Stats](https://github-stats.vercel.app/api/stats/YOUR_USERNAME)
```

Replace `YOUR_USERNAME` with your GitHub username and `github-stats.vercel.app` with your deployed app URL.

### Options

| Parameter | Description | Default |
|-----------|-------------|---------|
| `theme` | Card theme (`dark` or `light`) | `dark` |

### Examples

**Dark Theme (Default):**
```md
![My GitHub Stats](https://your-app.vercel.app/api/stats/octocat)
```

**Light Theme:**
```md
![My GitHub Stats](https://your-app.vercel.app/api/stats/octocat?theme=light)
```

**With Link to Full Stats:**
```md
[![My GitHub Stats](https://your-app.vercel.app/api/stats/octocat)](https://your-app.vercel.app/?search=octocat)
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/saurav-tiwari03/git-most-lang-stats.git
   cd github-stats
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## 📖 Usage

### Analyze a User

Enter a GitHub username (e.g., `facebook`, `google`, `vercel`) to see the language distribution across their public repositories.

### Analyze a Repository

Enter a repository in `owner/repo` format (e.g., `facebook/react`, `microsoft/vscode`) to see the exact byte-level language breakdown.

### URL Parameters

You can share analysis results using URL parameters:
```
?search=facebook
?search=facebook/react
```

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI library with latest features |
| **TypeScript** | Type-safe development |
| **Vite** | Fast build tool and dev server |
| **Tailwind CSS** | Utility-first styling |
| **Lucide React** | Beautiful icon library |

## 📁 Project Structure

```
github-stats/
├── api/
│   └── stats/
│       └── [username].ts  # Serverless function for SVG generation
├── src/
│   ├── App.tsx          # Main application component
│   ├── main.tsx         # Application entry point
│   ├── index.css        # Global styles
│   ├── types.ts         # TypeScript interfaces
│   ├── components/      # Reusable components
│   └── assets/          # Static assets
├── public/              # Public assets
├── index.html           # HTML entry point
├── package.json         # Project dependencies
├── vercel.json          # Vercel configuration
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
└── eslint.config.js     # ESLint configuration
```

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 📊 How It Works

### User Search
1. Fetches the user's profile from GitHub API
2. Retrieves up to 100 of their most recent public repositories
3. Aggregates repository sizes grouped by primary language
4. Displays top 5 languages with "Other" for the rest

### Repository Search
1. Fetches repository details from GitHub API
2. Gets exact byte counts for every language used
3. Calculates precise percentage breakdown
4. Displays all languages with their exact contributions

## ⚠️ API Rate Limits

This app uses the GitHub public API, which has the following limits for unauthenticated requests:

- **60 requests per hour** per IP address

When the rate limit is exceeded, the app gracefully shows a warning and offers demo data to preview the functionality.

## 🎨 Supported Languages

The app has custom color mappings for 30+ popular languages including:

`JavaScript`, `TypeScript`, `Python`, `Vue`, `React`, `HTML`, `CSS`, `Java`, `C#`, `C++`, `C`, `Go`, `Rust`, `PHP`, `Ruby`, `Swift`, `Kotlin`, `Dart`, `Shell`, `Solidity`, `Lua`, `Svelte`, `Elixir`, `Haskell`, `Scala`, `Perl`, `R`, and more...

Unknown languages are automatically assigned colors based on their name.

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [GitHub API](https://docs.github.com/en/rest) for providing the data
- [Lucide Icons](https://lucide.dev/) for beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) for styling utilities

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/saurav-tiwari03">Saurav Tiwari</a>
</p>
