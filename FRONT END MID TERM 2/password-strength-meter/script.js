const passwordInput = document.querySelector("#password-input");
const showPasswordCheckbox = document.querySelector("#show-password");
const strengthFill = document.querySelector("#strength-fill");
const strengthTrack = document.querySelector("#strength-track");
const strengthLabel = document.querySelector("#strength-label");
const rulesCount = document.querySelector("#rules-count");

// Each rule pairs a checklist key with a regular expression tested against the input.
const passwordRules = [
  { key: "length", expression: /^[\s\S]{8,}$/ },
  { key: "uppercase", expression: /[A-Z]/ },
  { key: "lowercase", expression: /[a-z]/ },
  { key: "number", expression: /[0-9]/ },
  { key: "special", expression: /[^A-Za-z0-9\s]/ }
];

function checkPasswordStrength() {
  const password = passwordInput.value;
  const results = passwordRules.map((rule) => ({
    key: rule.key,
    passed: rule.expression.test(password)
  }));
  const passedCount = results.filter((result) => result.passed).length;

  updateChecklist(results);
  updateStrengthBar(passedCount, password.length > 0);
}

function updateChecklist(results) {
  results.forEach(({ key, passed }) => {
    const item = document.querySelector(`[data-rule="${key}"]`);
    const icon = item.querySelector(".rule-icon");

    item.classList.toggle("is-met", passed);
    icon.textContent = passed ? "✓" : "×";
  });

  const passedCount = results.filter((result) => result.passed).length;
  rulesCount.textContent = `${passedCount} / ${passwordRules.length}`;
}

function updateStrengthBar(passedCount, hasPassword) {
  const strengthClass = passedCount <= 2 ? "weak" : passedCount <= 4 ? "medium" : "strong";
  const label = passedCount <= 2 ? "Weak" : passedCount <= 4 ? "Medium" : "Strong";
  const stateClasses = ["weak", "medium", "strong"];

  strengthFill.style.width = hasPassword
    ? `${(passedCount / passwordRules.length) * 100}%`
    : "0%";
  strengthFill.classList.remove(...stateClasses);
  strengthLabel.classList.remove(...stateClasses);
  strengthTrack.setAttribute("aria-valuenow", String(hasPassword ? passedCount : 0));

  if (!hasPassword) {
    strengthLabel.textContent = "";
    return;
  }

  strengthFill.classList.add(strengthClass);
  strengthLabel.classList.add(strengthClass);
  strengthLabel.textContent = label;
}

function togglePasswordVisibility() {
  passwordInput.type = showPasswordCheckbox.checked ? "text" : "password";
}

passwordInput.addEventListener("input", checkPasswordStrength);
showPasswordCheckbox.addEventListener("change", togglePasswordVisibility);
