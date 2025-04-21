# QuickClip -Desktop Application -Early BETA Version

QuickClip is a cross-platform desktop application that functions as a sticky notes tool, allowing users to save, manage, search, copy, and delete text snippets. The app stays on top of other windows and provides a clean, modern interface with both light and dark themes.

## Features

- Save and manage text snippets
- Real-time search functionality
- Copy snippets to clipboard with one click
- Light and dark theme support
- Always-on-top window
- System tray integration
- Cross-platform support (Windows, macOS, Linux)
- Persistent storage of snippets
- Modern, clean UI with smooth animations

## Installation

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

### Development Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the application:
   ```bash
   npm start
   ```

### Building the Application

To build the application for your platform:

```bash
npm run build
```

The built application will be available in the `dist` directory.

## Usage

- Enter text in the textarea and press Enter or click Save to create a new snippet
- Use Shift+Enter for new lines in the textarea
- Search through your snippets using the search box
- Click the Copy button to copy a snippet to your clipboard
- Click the Delete button to remove a snippet
- Toggle between light and dark themes using the switch in the header
- Click the minimize button (-) to minimize to system tray
- Click the system tray icon to show/hide the application

## Development

The application is built using Electron and follows a simple architecture:

- `main.js`: Main Electron process
- `popup.html`: Main UI
- `popup.js`: Frontend logic
- `styles.css`: Styling for light/dark themes

## License

ISC 
