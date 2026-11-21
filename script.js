const expressionEl = document.getElementById('expression');
const resultEl = document.getElementById('result');
const buttons = document.querySelectorAll('.btn');

let currentInput = '';

function updateDisplay() {
  // Format symbols for cleaner display
  expressionEl.textContent = currentInput
    .replace(/\*/g, '×')
    .replace(/\//g, '÷');

  // Real-time preview calculation
  try {
    // Only evaluate if input ends with a number
    if (currentInput && /[0-9]$/.test(currentInput)) {
      const evaluated = Function('"use strict";return (' + currentInput + ')')();
      resultEl.textContent = Number.isFinite(evaluated) ? evaluated : 'Error';
    } else if (!currentInput) {
      resultEl.textContent = '0';
    }
  } catch {
    // Ignore incomplete expressions while typing
  }
}

function handleInput(value) {
  const operators = ['+', '-', '*', '/'];
  const lastChar = currentInput.slice(-1);

  // Prevent consecutive operators
  if (operators.includes(value) && operators.includes(lastChar)) {
    currentInput = currentInput.slice(0, -1) + value;
  } else if (operators.includes(value) && currentInput === '') {
    return; // Prevent starting with an operator
  } else {
    currentInput += value;
  }
  updateDisplay();
}

function clearScreen() {
  currentInput = '';
  expressionEl.textContent = '';
  resultEl.textContent = '0';
}

function backspace() {
  currentInput = currentInput.slice(0, -1);
  updateDisplay();
}

function calculateFinal() {
  try {
    if (!currentInput) return;
    const evaluated = Function('"use strict";return (' + currentInput + ')')();
    if (!Number.isFinite(evaluated)) {
      resultEl.textContent = 'Cannot divide by 0';
      currentInput = '';
    } else {
      currentInput = String(evaluated);
      expressionEl.textContent = '';
      resultEl.textContent = currentInput;
    }
  } catch {
    resultEl.textContent = 'Error';
    currentInput = '';
  }
}

// Button Click Listeners
buttons.forEach(button => {
  button.addEventListener('click', () => {
    const value = button.dataset.value;
    const action = button.dataset.action;

    if (value) handleInput(value);
    if (action === 'clear') clearScreen();
    if (action === 'backspace') backspace();
    if (action === 'equals') calculateFinal();
  });
});

// Bonus: Keyboard Support
document.addEventListener('keydown', (e) => {
  if ((e.key >= '0' && e.key <= '9') || ['+', '-', '*', '/', '.'].includes(e.key)) {
    handleInput(e.key);
  } else if (e.key === 'Enter' || e.key === '=') {
    e.preventDefault();
    calculateFinal();
  } else if (e.key === 'Backspace') {
    backspace();
  } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
    clearScreen();
  }
});