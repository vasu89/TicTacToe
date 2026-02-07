const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('/tictactoe.html?mode=local');
});

// Helper: click the cell at the given index (0-8)
async function clickCell(page, index) {
  await page.locator(`.cell[data-index="${index}"]`).click();
}

test('initial state — 9 empty cells and X\'s turn', async ({ page }) => {
  const cells = page.locator('.cell');
  await expect(cells).toHaveCount(9);
  for (let i = 0; i < 9; i++) {
    await expect(cells.nth(i)).toHaveText('');
  }
  await expect(page.locator('#status')).toHaveText("X's turn");
});

test('make a move — clicking a cell shows X, status switches to O\'s turn', async ({ page }) => {
  await clickCell(page, 0);
  await expect(page.locator('.cell[data-index="0"]')).toHaveText('X');
  await expect(page.locator('#status')).toHaveText("O's turn");
});

test('alternating turns — X then O then X', async ({ page }) => {
  await clickCell(page, 0);
  await expect(page.locator('.cell[data-index="0"]')).toHaveText('X');

  await clickCell(page, 1);
  await expect(page.locator('.cell[data-index="1"]')).toHaveText('O');

  await clickCell(page, 2);
  await expect(page.locator('.cell[data-index="2"]')).toHaveText('X');
  await expect(page.locator('#status')).toHaveText("O's turn");
});

test('X wins — top row', async ({ page }) => {
  // X: 0, 1, 2  O: 3, 4
  await clickCell(page, 0); // X
  await clickCell(page, 3); // O
  await clickCell(page, 1); // X
  await clickCell(page, 4); // O
  await clickCell(page, 2); // X wins

  await expect(page.locator('#status')).toHaveText('X wins!');

  // Winning cells should have the 'win' class
  for (const idx of [0, 1, 2]) {
    await expect(page.locator(`.cell[data-index="${idx}"]`)).toHaveClass(/win/);
  }
});

test('O wins — left column', async ({ page }) => {
  // O: 0, 3, 6  X: 1, 4, 8
  await clickCell(page, 1); // X
  await clickCell(page, 0); // O
  await clickCell(page, 4); // X
  await clickCell(page, 3); // O
  await clickCell(page, 8); // X
  await clickCell(page, 6); // O wins

  await expect(page.locator('#status')).toHaveText('O wins!');
});

test('draw — fill the board with no winner', async ({ page }) => {
  // X O X
  // X X O
  // O X O
  await clickCell(page, 0); // X
  await clickCell(page, 1); // O
  await clickCell(page, 2); // X
  await clickCell(page, 5); // O
  await clickCell(page, 3); // X
  await clickCell(page, 6); // O
  await clickCell(page, 4); // X
  await clickCell(page, 8); // O
  await clickCell(page, 7); // X — draw

  await expect(page.locator('#status')).toHaveText("It's a draw!");
});

test('can\'t click a taken cell', async ({ page }) => {
  await clickCell(page, 4); // X
  await clickCell(page, 4); // click same cell again

  await expect(page.locator('.cell[data-index="4"]')).toHaveText('X');
  await expect(page.locator('#status')).toHaveText("O's turn");
});

test('can\'t click after game over', async ({ page }) => {
  // X wins via top row
  await clickCell(page, 0); // X
  await clickCell(page, 3); // O
  await clickCell(page, 1); // X
  await clickCell(page, 4); // O
  await clickCell(page, 2); // X wins

  await expect(page.locator('#status')).toHaveText('X wins!');

  // Try clicking an empty cell — should be ignored
  await clickCell(page, 8);
  await expect(page.locator('.cell[data-index="8"]')).toHaveText('');
  await expect(page.locator('#status')).toHaveText('X wins!');
});

test('restart resets the board and status', async ({ page }) => {
  await clickCell(page, 0); // X
  await clickCell(page, 1); // O

  await page.locator('#restart').click();

  const cells = page.locator('.cell');
  await expect(cells).toHaveCount(9);
  for (let i = 0; i < 9; i++) {
    await expect(cells.nth(i)).toHaveText('');
  }
  await expect(page.locator('#status')).toHaveText("X's turn");
});
