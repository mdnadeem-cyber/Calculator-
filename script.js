// Simple calculator logic
const displayEl = document.getElementById('display');
const calculator = document.getElementById('calculator');
let expression = '';

function updateDisplay(){
displayEl.textContent = expression === '' ? '0' : expression;
}

function safeEval(expr){
// Allow only digits, parentheses, spaces, decimal point and math operators
const safePattern = /^[0-9+\-*/().\s]+$/;
if(!safePattern.test(expr)) throw new Error('Invalid characters');
// Prevent multiple consecutive operators like '**' or '//' which are JS valid but we prefer simple arithmetic
const badSeq = /[+\-*/]{2,}/;
if(badSeq.test(expr.replace(/\s+/g,''))) throw new Error('Malformed expression');
// Evaluate using Function
// eslint-disable-next-line no-new-func
return Function('return (' + expr + ')')();
}

calculator.addEventListener('click', (e) => {
const target = e.target;
if(!target.matches('button')) return;

const val = target.dataset.value;
const action = target.dataset.action;

if(action === 'clear'){
expression = '';
updateDisplay();
return;
}
if(action === 'back'){
expression = expression.slice(0, -1);
updateDisplay();
return;
}
if(action === 'equals'){
try{
// replace unicode × ÷ if any
const sanitized = expression.replace(/×/g,'*').replace(/÷/g,'/');
const result = safeEval(sanitized);
expression = String(result);
}catch(err){
expression = 'Error';
}
updateDisplay();
return;
}

// normal value button (number, ., operator)
if(val){
// prevent multiple dots in a single number segment
if(val === '.'){
const parts = expression.split(/[^0-9.]/);
const last = parts[parts.length - 1];
if(last.includes('.')) return; // ignore extra dot
}

expression += val;
updateDisplay();
}
});

// Keyboard support
window.addEventListener('keydown', (e) => {
const key = e.key;
if((/^[0-9]$/).test(key)) { expression += key; updateDisplay(); return; }
if(key === '.') { expression += '.'; updateDisplay(); return; }
if(key === 'Backspace'){ expression = expression.slice(0,-1); updateDisplay(); return; }
if(key === 'Enter' || key === '='){
e.preventDefault();
try{
const res = safeEval(expression);
expression = String(res);
}catch(err){ expression = 'Error'; }
updateDisplay();
return;
}
if(['+','-','*','/','(',')'].includes(key)){
expression += key;
updateDisplay();
return;
}
});

// initialize
updateDisplay();
// Append number to expression
function appendNumber(number) {
    expression += number;
    updateDisplay();
}

// Choose operation like + - * /
function chooseOperation(op) {
    expression += op;
    updateDisplay();
}

// Clear all
function clearDisplay() {
    expression = "";
    updateDisplay();
}

// Delete last character
function deleteLast() {
    expression = expression.slice(0, -1);
    updateDisplay();
}

// Calculate result
function calculate() {
    try {
        expression = String(safeEval(expression));
    } catch {
        expression = "Error";
    }
    updateDisplay();
}
