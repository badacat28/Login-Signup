document.addEventListener('DOMContentLoaded', () => {
    // In-memory user database (resets on page refresh)
    let userDatabase = [
        { username: 'player1', email: 'player1@game.com', password: '1234' }
    ];

    // Form containers
    const loginFormContainer = document.getElementById('login-form-container');
    const signupFormContainer = document.getElementById('signup-form-container');
    const findPasswordFormContainer = document.getElementById('find-password-form-container');

    // Forms
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const findPasswordForm = document.getElementById('find-password-form');

    // Form switch buttons
    const showSignupBtn = document.getElementById('show-signup');
    const showFindPasswordBtn = document.getElementById('show-find-password');
    const showLoginFromSignupBtn = document.getElementById('show-login-from-signup');
    const showLoginFromFindBtn = document.getElementById('show-login-from-find');

    // Loader
    const loaderContainer = document.getElementById('loader-container');

    // Login form elements
    const loginUsernameInput = document.getElementById('login-username');
    const loginPasswordInput = document.getElementById('login-password');
    const usernameError = document.getElementById('username-error');
    const passwordError = document.getElementById('password-error');

    // Register form elements
    const signupUsernameInput = document.getElementById('signup-username');
    const checkUsernameButton = document.getElementById('check-username-button');
    const usernameStatusMessage = document.getElementById('username-status-message');
    const signupPasswordInput = document.getElementById('signup-password');
    const signupConfirmPasswordInput = document.getElementById('signup-confirm-password');
    const confirmPasswordError = document.getElementById('confirm-password-error');
    const signupSubmitButton = document.getElementById('signup-submit-button');

    // Password condition elements
    const conditionLength = document.getElementById('condition-length');
    const conditionNumber = document.getElementById('condition-number');
    const conditionSpecial = document.getElementById('condition-special');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

    // Register form state variables
    let isUsernameChecked = false;
    let isUsernameAvailable = false;
    let isPasswordLengthMet = false;
    let isPasswordNumberMet = false;
    let isPasswordSpecialMet = false;
    let doPasswordsMatch = false;

    function showForm(formToShow) {
        loginFormContainer.classList.add('hidden');
        signupFormContainer.classList.add('hidden');
        findPasswordFormContainer.classList.add('hidden');

        if (formToShow === 'login') {
            loginFormContainer.classList.remove('hidden');
        } else if (formToShow === 'signup') {
            signupFormContainer.classList.remove('hidden');
            // Reset register form state when switching to it
            resetSignupFormState();
        } else if (formToShow === 'find-password') {
            findPasswordFormContainer.classList.remove('hidden');
        }
    }

    function resetSignupFormState() {
        signupUsernameInput.value = '';
        signupForm.querySelector('#signup-email').value = '';
        signupPasswordInput.value = '';
        signupConfirmPasswordInput.value = '';

        usernameStatusMessage.textContent = '';
        usernameStatusMessage.classList.remove('success-message', 'error-message');
        confirmPasswordError.textContent = '';

        isUsernameChecked = false;
        isUsernameAvailable = false;
        isPasswordLengthMet = false;
        isPasswordNumberMet = false;
        isPasswordSpecialMet = false;
        doPasswordsMatch = false;

        // Reset password condition display
        conditionLength.classList.remove('met', 'unmet');
        conditionNumber.classList.remove('met', 'unmet');
        conditionSpecial.classList.remove('met', 'unmet');

        updateSignupButtonState();
    }

    // --- Password Toggle Function ---
    function setupPasswordToggle(passwordInputId, toggleIconId) {
        const passwordInput = document.getElementById(passwordInputId);
        const toggleIcon = document.getElementById(toggleIconId);

        if (passwordInput && toggleIcon) {
            const eyeOpen = toggleIcon.querySelector('.eye-open');
            const eyeClosed = toggleIcon.querySelector('.eye-closed');

            toggleIcon.addEventListener('click', () => {
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    eyeOpen.classList.add('hidden');
                    eyeClosed.classList.remove('hidden');
                } else {
                    passwordInput.type = 'password';
                    eyeOpen.classList.remove('hidden');
                    eyeClosed.classList.add('hidden');
                }
            });
        }
    }

    // Apply toggle function to password fields
    setupPasswordToggle('login-password', 'toggle-login-password');
    setupPasswordToggle('signup-password', 'toggle-signup-password');
    setupPasswordToggle('signup-confirm-password', 'toggle-signup-confirm-password');


    // --- Form Switch Event Listeners ---
    showSignupBtn.addEventListener('click', (e) => { e.preventDefault(); showForm('signup'); });
    showFindPasswordBtn.addEventListener('click', (e) => { e.preventDefault(); showForm('find-password'); });
    showLoginFromSignupBtn.addEventListener('click', (e) => { e.preventDefault(); showForm('login'); });
    showLoginFromFindBtn.addEventListener('click', (e) => { e.preventDefault(); showForm('login'); });

    // --- Update Register Button State ---
    function updateSignupButtonState() {
        signupSubmitButton.disabled = !(
            isUsernameChecked &&
            isUsernameAvailable &&
            isPasswordLengthMet &&
            isPasswordNumberMet &&
            isPasswordSpecialMet &&
            doPasswordsMatch
        );
    }

    // --- Username Duplication Check Logic ---
    signupUsernameInput.addEventListener('input', () => {
        isUsernameChecked = false;
        isUsernameAvailable = false;
        usernameStatusMessage.textContent = '';
        usernameStatusMessage.classList.remove('success-message', 'error-message');
        updateSignupButtonState();
    });

    checkUsernameButton.addEventListener('click', () => {
        const username = signupUsernameInput.value.trim();
        if (username === '') {
            alert('Please enter a username.');
            return;
        }

        const userExists = userDatabase.some(u => u.username === username);
        isUsernameChecked = true;

        if (userExists) {
            usernameStatusMessage.className = 'error-message';
            usernameStatusMessage.textContent = 'Username already taken.';
            isUsernameAvailable = false;
        } else {
            usernameStatusMessage.className = 'success-message';
            usernameStatusMessage.textContent = 'Username available.';
            isUsernameAvailable = true;
        }
        updateSignupButtonState();
    });

    // --- Password Conditions and Confirmation Logic ---
    signupPasswordInput.addEventListener('input', () => {
        const password = signupPasswordInput.value;

        // Length condition
        isPasswordLengthMet = password.length >= 8;
        conditionLength.classList.toggle('met', isPasswordLengthMet);
        conditionLength.classList.toggle('unmet', !isPasswordLengthMet && password.length > 0);

        // Number condition
        isPasswordNumberMet = /\d/.test(password);
        conditionNumber.classList.toggle('met', isPasswordNumberMet);
        conditionNumber.classList.toggle('unmet', !isPasswordNumberMet && password.length > 0);

        // Special character condition
        isPasswordSpecialMet = specialCharRegex.test(password);
        conditionSpecial.classList.toggle('met', isPasswordSpecialMet);
        conditionSpecial.classList.toggle('unmet', !isPasswordSpecialMet && password.length > 0);

        // Also check password confirmation match
        checkConfirmPasswordMatch();
        updateSignupButtonState();
    });

    signupConfirmPasswordInput.addEventListener('input', () => {
        checkConfirmPasswordMatch();
        updateSignupButtonState();
    });

    function checkConfirmPasswordMatch() {
        const password = signupPasswordInput.value;
        const confirmPassword = signupConfirmPasswordInput.value;

        if (confirmPassword.length > 0 && password !== confirmPassword) {
            confirmPasswordError.textContent = 'Passwords do not match.';
            doPasswordsMatch = false;
        } else {
            confirmPasswordError.textContent = '';
            doPasswordsMatch = (password === confirmPassword && password.length > 0);
        }
    }


    // --- Login Form Submission Logic ---
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        usernameError.textContent = '';
        passwordError.textContent = '';
        loginUsernameInput.classList.remove('input-error');
        loginPasswordInput.classList.remove('input-error');

        loaderContainer.classList.remove('hidden');

        setTimeout(() => {
            loaderContainer.classList.add('hidden');

            const username = loginUsernameInput.value;
            const password = loginPasswordInput.value;

            if (username.trim() === '' || password.trim() === '') {
                alert('Please enter both username and password!');
                return;
            }

            const user = userDatabase.find(u => u.username === username);

            if (!user) {
                loginUsernameInput.classList.add('input-error');
                usernameError.textContent = 'Unregistered username.';
            } else if (user.password !== password) {
                loginPasswordInput.classList.add('input-error');
                passwordError.textContent = 'Incorrect password.';
            } else {
                alert(`Welcome, ${username}!`);
            }
        }, 1500);
    });

    // --- Register Form Submission Logic ---
    signupForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Button is disabled, so this is mostly for safety

        const username = signupUsernameInput.value;
        const email = signupForm.querySelector('#signup-email').value;
        const password = signupPasswordInput.value;

        // Final validation (should pass if button is enabled)
        if (!isUsernameChecked || !isUsernameAvailable) {
            alert('Please check username availability.');
            return;
        }
        if (!isPasswordLengthMet || !isPasswordNumberMet || !isPasswordSpecialMet) {
            alert('Please meet all password requirements.');
            return;
        }
        if (!doPasswordsMatch) {
            alert('Password confirmation does not match.');
            return;
        }
        if (email.trim() === '' || !emailRegex.test(email)) {
            alert('Please enter a valid email.');
            return;
        }

        // Add new user to the database
        userDatabase.push({ username, email, password });
        console.log('Updated User Database:', userDatabase); // Log for debugging

        alert('Registration successful! Please log in.');
        showForm('login');
    });

    // --- Forgot Password Form Submission Logic ---
    findPasswordForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const email = event.target.email.value;

        if (email.trim() === '') {
            alert('Please enter your email.');
            return;
        }
        if (!emailRegex.test(email)) {
            alert('Invalid email format.');
            return;
        }

        const userExists = userDatabase.some(u => u.email === email);
        if (userExists) {
            alert('A password reset link has been sent to your email.');
        } else {
            alert('Unregistered email.');
        }
        showForm('login');
    });

    // Initial update of register button state
    updateSignupButtonState();
});