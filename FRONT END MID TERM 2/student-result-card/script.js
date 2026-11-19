// The source records contain only subject marks; all result values are calculated below.
const students = [
  { name: "Anita", maths: 85, science: 90, english: 80 },
  { name: "Rahul", maths: 60, science: 62, english: 65 },
  { name: "Meena", maths: 95, science: 94, english: 94 },
  { name: "Karthik", maths: 40, science: 32, english: 47 },
  { name: "Divya", maths: 70, science: 70, english: 70 }
];

const SUBJECTS = ["maths", "science", "english"];
const MAX_MARKS = SUBJECTS.length * 100;
const PASS_MARK = 35;

const resultsBody = document.querySelector("#results-body");
const generateButton = document.querySelector("#generate-button");
const tableNote = document.querySelector("#table-note");

/** Return a grade for a percentage from 0 to 100. */
function getGrade(percent) {
  if (percent >= 90) return "A+";
  if (percent >= 75) return "A";
  if (percent >= 60) return "B";
  if (percent >= 50) return "C";
  return "D";
}

/** A valid record has a name and a numeric mark from 0 through 100 per subject. */
function hasValidMarks(student) {
  return Boolean(student.name) && SUBJECTS.every((subject) => {
    const mark = student[subject];
    return typeof mark === "number" && Number.isFinite(mark) && mark >= 0 && mark <= 100;
  });
}

function calculateTotal(student) {
  return SUBJECTS.reduce((total, subject) => total + student[subject], 0);
}

function calculatePercentage(total) {
  return (total / MAX_MARKS) * 100;
}

function hasPassed(student) {
  return SUBJECTS.every((subject) => student[subject] >= PASS_MARK);
}

function createResultRow(student) {
  const row = document.createElement("tr");

  if (!hasValidMarks(student)) {
    row.className = "invalid-row";
    row.innerHTML = `
      <td class="student-name">${escapeHTML(student.name || "Unknown student")}</td>
      <td>—</td>
      <td>—</td>
      <td>—</td>
      <td><span class="result-badge">INVALID</span></td>
    `;
    return { row, valid: false };
  }

  const total = calculateTotal(student);
  const percentage = calculatePercentage(total);
  const grade = getGrade(percentage);
  const passed = hasPassed(student);

  row.className = passed ? "pass-row" : "fail-row";
  row.innerHTML = `
    <td class="student-name">${escapeHTML(student.name)}</td>
    <td>${total}</td>
    <td class="percentage-cell">${percentage.toFixed(2)}%</td>
    <td class="grade-cell">${grade}</td>
    <td><span class="result-badge">${passed ? "PASS" : "FAIL"}</span></td>
  `;

  return { row, valid: true, total, percentage, passed, name: student.name };
}

// Student names are inserted into the table as text, never interpreted as markup.
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function updateSummary(results) {
  const validResults = results.filter((result) => result.valid);
  const topper = validResults.reduce((best, result) => (
    !best || result.percentage > best.percentage ? result : best
  ), null);
  const classAverage = validResults.length
    ? validResults.reduce((sum, result) => sum + result.percentage, 0) / validResults.length
    : null;
  const passedCount = validResults.filter((result) => result.passed).length;

  document.querySelector("#topper-value").textContent = topper ? topper.name : "—";
  document.querySelector("#topper-detail").textContent = topper
    ? `${topper.percentage.toFixed(2)}% overall`
    : "No valid student records";
  document.querySelector("#average-value").textContent = classAverage === null
    ? "—"
    : `${classAverage.toFixed(2)}%`;
  document.querySelector("#passed-value").textContent = String(passedCount);
  document.querySelector("#passed-detail").textContent = `Out of ${students.length} students`;
}

function generateResults() {
  const results = students.map(createResultRow);

  // Replacing the body keeps repeated clicks from adding duplicate rows.
  resultsBody.replaceChildren(...results.map((result) => result.row));
  updateSummary(results);

  const invalidCount = results.filter((result) => !result.valid).length;
  tableNote.textContent = invalidCount
    ? `${invalidCount} student record${invalidCount === 1 ? "" : "s"} contain invalid marks and were excluded from the summary.`
    : `${students.length} students · Maths, Science, English`;
}

generateButton.addEventListener("click", generateResults);
