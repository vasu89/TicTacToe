# Tic Tac Toe

A simple tic-tac-toe game built with HTML, CSS, and vanilla JavaScript.

## How to Play

Open `tictactoe.html` in a browser. Players take turns clicking cells — X goes first. The game detects wins, draws, and prevents invalid moves. Click **Restart** to reset.

## Running Tests

The project includes Playwright end-to-end tests covering all game behaviors.

```bash
npm install
npx playwright install chromium
npx playwright test
```

## Test Coverage

- Initial board state
- Making moves and alternating turns
- X wins / O wins / Draw detection
- Preventing clicks on taken cells
- Preventing clicks after game over
- Restart functionality
