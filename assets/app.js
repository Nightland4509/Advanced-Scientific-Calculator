// ترجمه‌های مورد نیاز برای هر زبان
const translations = {
    en: {
        clear: 'C',
        equals: '=',
        numbers: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        operators: ['+', '-', '×', '÷'],
        decimal: '.',
        percent: '%',
        plusMinus: '±'
    },
    fa: {
        clear: 'پاک',
        equals: '=',
        numbers: ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'],
        operators: ['+', '-', '×', '÷'],
        decimal: '٫',
        percent: '٪',
        plusMinus: '±'
    },
    ar: {
        clear: 'مسح',
        equals: '=',
        numbers: ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'],
        operators: ['+', '-', '×', '÷'],
        decimal: '٫',
        percent: '٪',
        plusMinus: '±'
    },
    de: {
        clear: 'C',
        equals: '=',
        numbers: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        operators: ['+', '-', '×', '÷'],
        decimal: ',',
        percent: '%',
        plusMinus: '±'
    }
};

class Calculator {
    constructor() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.language = 'en';
        
        // اجرای تنظیمات اولیه بعد از لود صفحه
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeUI();
        });
    }

    initializeUI() {
        // چک کردن زبان ذخیره شده
        const savedLanguage = localStorage.getItem('calculatorLanguage');
        if (savedLanguage) {
            this.setLanguage(savedLanguage, false);
        } else {
            // نمایش مودال انتخاب زبان برای بار اول
            const modal = document.getElementById('languageModal');
            if (modal) modal.style.display = 'flex';
        }

        // اضافه کردن event listener برای دکمه‌های زبان
        document.querySelectorAll('.lang-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = button.getAttribute('data-lang');
                this.setLanguage(lang, true);
            });
        });

        // اضافه کردن event listener برای دکمه‌های ماشین حساب
        this.setupCalculatorButtons();
    }

    setLanguage(lang, savePreference = true) {
        this.language = lang;
        
        // تنظیم جهت متن بر اساس زبان
        document.documentElement.lang = lang;
        document.documentElement.dir = ['ar', 'fa'].includes(lang) ? 'rtl' : 'ltr';
        
        if (savePreference) {
            localStorage.setItem('calculatorLanguage', lang);
            const modal = document.getElementById('languageModal');
            if (modal) modal.style.display = 'none';
        }

        // آپدیت UI
        this.updateCalculatorUI();
        
        // آپدیت نشانگر زبان فعلی
        const currentLangButton = document.getElementById('currentLang');
        if (currentLangButton) {
            currentLangButton.textContent = lang.toUpperCase();
        }
    }

    updateCalculatorUI() {
        // آپدیت متن دکمه‌ها بر اساس زبان
        const currentTranslations = translations[this.language];
        
        // آپدیت دکمه پاک کردن
        const clearButton = document.querySelector('.special:first-child');
        if (clearButton) clearButton.textContent = currentTranslations.clear;

        // آپدیت نمایشگر
        this.updateDisplay();
    }

    setupCalculatorButtons() {
        // دکمه‌های عددی
        document.querySelectorAll('.number').forEach(button => {
            button.addEventListener('click', () => {
                if (button.textContent === '.' || button.textContent === '٫') {
                    this.appendDecimal();
                } else {
                    this.appendNumber(button.textContent);
                }
            });
        });

        // دکمه‌های عملگر
        document.querySelectorAll('.operator').forEach(button => {
            button.addEventListener('click', () => {
                this.chooseOperation(button.textContent);
            });
        });

        // دکمه مساوی
        const equalsButton = document.querySelector('.equals');
        if (equalsButton) {
            equalsButton.addEventListener('click', () => {
                this.compute();
            });
        }

        // دکمه پاک کردن
        const clearButton = document.querySelector('.special:first-child');
        if (clearButton) {
            clearButton.addEventListener('click', () => {
                this.clear();
            });
        }
    }

    appendNumber(number) {
        if (this.currentOperand === '0') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
        this.updateDisplay();
    }

    appendDecimal() {
        const decimal = translations[this.language].decimal;
        if (!this.currentOperand.includes(decimal)) {
            this.currentOperand += decimal;
            this.updateDisplay();
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        this.updateDisplay();
    }

    compute() {
        let computation;
        const prev = parseFloat(this.convertToEnglishNumbers(this.previousOperand));
        const current = parseFloat(this.convertToEnglishNumbers(this.currentOperand));
        
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                computation = prev / current;
                break;
            default:
                return;
        }

        this.currentOperand = this.formatNumber(computation.toString());
        this.operation = undefined;
        this.previousOperand = '';
        this.updateDisplay();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.updateDisplay();
    }

    convertToEnglishNumbers(str) {
        // تبدیل اعداد فارسی و عربی به انگلیسی
        const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
        const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        
        let result = str;
        for (let i = 0; i < 10; i++) {
            result = result.replace(new RegExp(persianNumbers[i], 'g'), englishNumbers[i])
                         .replace(new RegExp(arabicNumbers[i], 'g'), englishNumbers[i]);
        }
        return result.replace(/٫/g, '.').replace(/،/g, '.');
    }

    formatNumber(number) {
        // تبدیل اعداد به فرمت زبان انتخاب شده
        const parts = number.split('.');
        let integerPart = parts[0];
        const decimalPart = parts[1];

        const currentTranslations = translations[this.language];
        
        // تبدیل اعداد به فرمت مورد نظر
        if (this.language === 'fa' || this.language === 'ar') {
            integerPart = integerPart.split('').map(digit => 
                currentTranslations.numbers[parseInt(digit)] || digit
            ).join('');
        }

        if (decimalPart) {
            return `${integerPart}${currentTranslations.decimal}${decimalPart}`;
        }
        return integerPart;
    }

    updateDisplay() {
        const currentOperandText = document.querySelector('.current-operand');
        const previousOperandText = document.querySelector('.previous-operand');
        
        if (currentOperandText) {
            currentOperandText.textContent = this.currentOperand;
        }
        
        if (previousOperandText) {
            previousOperandText.textContent = this.operation ? 
                `${this.previousOperand} ${this.operation}` : '';
        }
    }
}

// ایجاد نمونه از کلاس Calculator
const calculator = new Calculator();
// اضافه کردن این کد به انتهای app.js

function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    
    const diameter = Math.max(rect.width, rect.height);
    const radius = diameter / 2;
    
    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${event.clientX - rect.left - radius}px`;
    ripple.style.top = `${event.clientY - rect.top - radius}px`;
    
    ripple.classList.add('ripple');
    button.appendChild(ripple);
    
    ripple.addEventListener('animationend', () => {
        ripple.remove();
    });
}

// اضافه کردن افکت ریپل به همه دکمه‌ها
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', createRipple);
});
class ScientificCalculator {
    constructor() {
        this.expression = '';
        this.result = '0';
        this.angleMode = 'deg';
        this.isScientificMode = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateDisplay();
    }

    setupEventListeners() {
        // Mode Toggle
        document.getElementById('standardMode').addEventListener('click', () => this.setMode('standard'));
        document.getElementById('scientificMode').addEventListener('click', () => this.setMode('scientific'));

        // Angle Mode
        document.querySelectorAll('.angle-btn').forEach(btn => {
            btn.addEventListener('click', () => this.setAngleMode(btn.dataset.mode));
        });

        // Numbers
        document.querySelectorAll('.number').forEach(button => {
            button.addEventListener('click', () => this.appendNumber(button.textContent));
        });

        // Operators
        document.querySelectorAll('.operator').forEach(button => {
            button.addEventListener('click', () => this.appendOperator(button.textContent));
        });

        // Functions
        document.querySelectorAll('.function').forEach(button => {
            button.addEventListener('click', () => this.applyFunction(button.dataset.fn));
        });

        // Special Buttons
        document.querySelector('.equals').addEventListener('click', () => this.calculate());
        document.querySelector('.special:first-child').addEventListener('click', () => this.clear());

        // Theme Toggle
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());
    }

    setMode(mode) {
        this.isScientificMode = mode === 'scientific';
        document.querySelector('.scientific-keys').classList.toggle('hidden', !this.isScientificMode);
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.id === `${mode}Mode`);
        });
    }

    setAngleMode(mode) {
        this.angleMode = mode;
        document.querySelectorAll('.angle-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });
    }

    appendNumber(number) {
        if (this.result === '0' && number !== '.') {
            this.result = number;
        } else {
            this.result += number;
        }
        this.updateDisplay();
    }

    appendOperator(operator) {
        this.expression = this.result + ' ' + operator + ' ';
        this.result = '0';
        this.updateDisplay();
    }

    applyFunction(fn) {
        let value = parseFloat(this.result);
        let angle = value;

        // Convert angle if needed
        if (['sin', 'cos', 'tan'].includes(fn)) {
            if (this.angleMode === 'deg') {
                angle = value * (Math.PI / 180);
            } else if (this.angleMode === 'grad') {
                angle = value * (Math.PI / 200);
            }
        }

        switch (fn) {
            case 'sin':
                this.result = Math.sin(angle).toString();
                break;
            case 'cos':
                this.result = Math.cos(angle).toString();
                break;
            case 'tan':
                this.result = Math.tan(angle).toString();
                break;
            case 'sinh':
                this.result = Math.sinh(value).toString();
                break;
            case 'cosh':
                this.result = Math.cosh(value).toString();
                break;
            case 'tanh':
                this.result = Math.tanh(value).toString();
                break;
            case 'log':
                this.result = Math.log10(value).toString();
                break;
            case 'ln':
                this.result = Math.log(value).toString();
                break;
            case 'sqrt':
                this.result = Math.sqrt(value).toString();
                break;
            case 'cbrt':
                this.result = Math.cbrt(value).toString();
                break;
            case 'pi':
                this.result = Math.PI.toString();
                break;
            case 'e':
                this.result = Math.E.toString();
                break;
            case 'abs':
                this.result = Math.abs(value).toString();
                break;
            case 'fact':
                this.result = this.factorial(value).toString();
                break;
        }
        this.updateDisplay();
    }

    factorial(n) {
        if (n < 0) return NaN;
        if (n === 0) return 1;
        let result = 1;
        for (let i = 1; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    calculate() {
        try {
            const fullExpression = this.expression + this.result;
            this.result = eval(fullExpression).toString();
            this.expression = '';
        } catch (error) {
            this.result = 'Error';
        }
        this.updateDisplay();
    }

    clear() {
        this.expression = '';
        this.result = '0';
        this.updateDisplay();
    }

    updateDisplay() {
        document.querySelector('.expression').textContent = this.expression;
        document.querySelector('.result').textContent = this.result;
    }

    toggleTheme() {
        document.body.classList.toggle('dark-theme');
        const icon = document.getElementById('themeToggle');
        icon.textContent = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';
    }
}

// Initialize calculator
document.addEventListener('DOMContentLoaded', () => {
    const calculator = new ScientificCalculator();
});