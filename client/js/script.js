/* =========================================================
   UNIVERSITY FINANCIAL TRANSPARENCY PORTAL
   Frontend JavaScript
   ========================================================= */

// =========================
// DEMO ADMIN CREDENTIALS
// =========================
// Production me in credentials ko frontend me mat rakhna.
const DEMO_USERNAME = "admin";
const DEMO_PASSWORD = "admin123";


// =========================
// LOCAL STORAGE KEYS
// =========================

const STORAGE_KEYS = {
    income: "universityIncome",
    expenses: "universityExpenses",
    budget: "universityBudget",
    reports: "universityReports",
    settings: "universitySettings",
    loggedIn: "universityAdminLoggedIn"
};


// =========================
// DEFAULT DATA
// =========================

const defaultIncome = [
    {
        id: 1,
        source: "Government Grants",
        amount: 92,
        year: "2025–26"
    },
    {
        id: 2,
        source: "Student Fees",
        amount: 38.5,
        year: "2025–26"
    },
    {
        id: 3,
        source: "Research Grants",
        amount: 18.7,
        year: "2025–26"
    },
    {
        id: 4,
        source: "Hostel & Other Services",
        amount: 12.4,
        year: "2025–26"
    },
    {
        id: 5,
        source: "Endowment / Donations",
        amount: 9.6,
        year: "2025–26"
    },
    {
        id: 6,
        source: "Other Receipts",
        amount: 10,
        year: "2025–26"
    }
];


const defaultExpenses = [
    {
        id: 1,
        category: "Faculty & Staff Salaries",
        amount: 72,
        department: "Administration",
        year: "2025–26"
    },
    {
        id: 2,
        category: "Infrastructure & Construction",
        amount: 28.5,
        department: "Infrastructure",
        year: "2025–26"
    },
    {
        id: 3,
        category: "Research & Development",
        amount: 17.8,
        department: "Research",
        year: "2025–26"
    },
    {
        id: 4,
        category: "Student Welfare & Scholarships",
        amount: 13.25,
        department: "Student Welfare",
        year: "2025–26"
    },
    {
        id: 5,
        category: "Utilities & Maintenance",
        amount: 11.6,
        department: "Maintenance",
        year: "2025–26"
    },
    {
        id: 6,
        category: "Administration",
        amount: 9.4,
        department: "Administration",
        year: "2025–26"
    },
    {
        id: 7,
        category: "Library / Labs / IT",
        amount: 8.7,
        department: "Academic",
        year: "2025–26"
    },
    {
        id: 8,
        category: "Other Expenses",
        amount: 7.5,
        department: "General",
        year: "2025–26"
    }
];


const defaultBudget = {
    amount: 186.4,
    capital: 42.3,
    operational: 126.45,
    year: "2025–26"
};


const defaultReports = [
    {
        id: 1,
        title: "Annual Financial Statement",
        year: "2025–26",
        fileName: "",
        fileUrl: "#"
    },
    {
        id: 2,
        title: "Annual Budget Report",
        year: "2025–26",
        fileName: "",
        fileUrl: "#"
    }
];


const defaultSettings = {
    universityName: "University Financial Portal",
    email: "admin@university.edu",
    headName: "University Head",
    phone: ""
};


// =========================
// GLOBAL CHART VARIABLES
// =========================

let incomeChart = null;
let expenseChart = null;
let budgetChart = null;
let adminIncomeChart = null;
let adminExpenseChart = null;


// =========================
// STORAGE FUNCTIONS
// =========================

function getData(key, fallback) {
    const data = localStorage.getItem(key);

    if (!data) {
        localStorage.setItem(key, JSON.stringify(fallback));
        return fallback;
    }

    try {
        return JSON.parse(data);
    } catch (error) {
        return fallback;
    }
}


function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}


// =========================
// GET CURRENT DATA
// =========================

function getIncome() {
    return getData(STORAGE_KEYS.income, defaultIncome);
}


function getExpenses() {
    return getData(STORAGE_KEYS.expenses, defaultExpenses);
}


function getBudget() {
    return getData(STORAGE_KEYS.budget, defaultBudget);
}


function getReports() {
    return getData(STORAGE_KEYS.reports, defaultReports);
}


function getSettings() {
    return getData(STORAGE_KEYS.settings, defaultSettings);
}


// =========================
// NUMBER FORMAT
// =========================

function formatCurrency(amount) {
    const number = Number(amount) || 0;

    return "₹" + number.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }) + " Cr";
}


function formatNumber(amount) {
    const number = Number(amount) || 0;

    return number.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}


// =========================
// HTML SECURITY
// =========================

function escapeHTML(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// =========================
// CALCULATIONS
// =========================

function calculateTotalIncome() {
    return getIncome().reduce((total, item) => {
        return total + Number(item.amount || 0);
    }, 0);
}


function calculateTotalExpenses() {
    return getExpenses().reduce((total, item) => {
        return total + Number(item.amount || 0);
    }, 0);
}


function calculateBalance() {
    return calculateTotalIncome() - calculateTotalExpenses();
}


function calculatePercentage(amount, total) {
    if (!total) return 0;

    return ((Number(amount) / Number(total)) * 100).toFixed(1);
}


// =========================
// ADMIN LOGIN
// =========================

function openAdminLogin() {
    const modal = document.getElementById("adminLoginModal");

    if (modal) {
        modal.classList.add("show");
    }
}


function closeAdminLogin() {
    const modal = document.getElementById("adminLoginModal");

    if (modal) {
        modal.classList.remove("show");
    }

    const error = document.getElementById("loginError");

    if (error) {
        error.textContent = "";
    }
}


function adminLogin(event) {
    event.preventDefault();

    const username = document.getElementById("adminUsername").value.trim();
    const password = document.getElementById("adminPassword").value;

    const error = document.getElementById("loginError");

    if (username === DEMO_USERNAME && password === DEMO_PASSWORD) {

        localStorage.setItem(STORAGE_KEYS.loggedIn, "true");

        closeAdminLogin();

        document.getElementById("publicWebsite").style.display = "none";
        document.getElementById("adminPanel").classList.add("active");

        showAdminSection("dashboard");

        renderAdminDashboard();

    } else {

        if (error) {
            error.textContent = "Invalid username or password.";
        }
    }
}


function adminLogout() {

    localStorage.removeItem(STORAGE_KEYS.loggedIn);

    document.getElementById("adminPanel").classList.remove("active");

    document.getElementById("publicWebsite").style.display = "block";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// =========================
// ADMIN SECTION NAVIGATION
// =========================

function showAdminSection(section) {

    const sections = document.querySelectorAll(".admin-section");

    sections.forEach(item => {
        item.classList.remove("active");
    });


    const navigationLinks = document.querySelectorAll(".admin-navigation a");

    navigationLinks.forEach(link => {
        link.classList.remove("active");
    });


    let targetId = "";
    let pageTitle = "Financial Dashboard";

    if (section === "dashboard") {
        targetId = "adminDashboard";
        pageTitle = "Financial Dashboard";
    }

    if (section === "income") {
        targetId = "incomeManagement";
        pageTitle = "Income Management";
        renderAdminIncomeTable();
    }

    if (section === "expenses") {
        targetId = "expenseManagement";
        pageTitle = "Expense Management";
        renderAdminExpenseTable();
    }

    if (section === "budget") {
        targetId = "budgetManagement";
        pageTitle = "Budget Management";
        loadBudgetForm();
    }

    if (section === "reports") {
        targetId = "reportManagement";
        pageTitle = "Financial Reports";
        renderAdminReports();
    }

    if (section === "settings") {
        targetId = "settings";
        pageTitle = "Portal Settings";
        loadSettingsForm();
    }


    const target = document.getElementById(targetId);

    if (target) {
        target.classList.add("active");
    }


    const title = document.getElementById("adminPageTitle");

    if (title) {
        title.textContent = pageTitle;
    }


    navigationLinks.forEach(link => {

        const onclickValue = link.getAttribute("onclick");

        if (onclickValue && onclickValue.includes(`'${section}'`)) {
            link.classList.add("active");
        }

    });
}


// =========================
// PUBLIC WEBSITE
// =========================

function renderPublicWebsite() {

    const totalIncome = calculateTotalIncome();
    const totalExpenses = calculateTotalExpenses();
    const balance = totalIncome - totalExpenses;

    const budget = getBudget();

    const publicTotalIncome = document.getElementById("publicTotalIncome");
    const publicTotalExpense = document.getElementById("publicTotalExpense");
    const publicBalance = document.getElementById("publicBalance");
    const publicTotalBudget = document.getElementById("publicTotalBudget");
    const publicDevelopment = document.getElementById("publicDevelopment");

    if (publicTotalIncome) {
        publicTotalIncome.textContent = formatCurrency(totalIncome);
    }

    if (publicTotalExpense) {
        publicTotalExpense.textContent = formatCurrency(totalExpenses);
    }

    if (publicBalance) {
        publicBalance.textContent = formatCurrency(balance);
    }

    if (publicTotalBudget) {
        publicTotalBudget.textContent = formatCurrency(budget.amount);
    }

    if (publicDevelopment) {
        publicDevelopment.textContent = formatCurrency(budget.capital);
    }


    renderPublicIncomeTable();
    renderPublicExpenseTable();

    renderPublicBudget();

    renderPublicCharts();

    renderPublicReports();

    updateLastUpdated();
}


// =========================
// PUBLIC INCOME TABLE
// =========================

function renderPublicIncomeTable() {

    const table = document.getElementById("publicIncomeTable");

    if (!table) return;

    const income = getIncome();

    const totalIncome = income.reduce((total, item) => {
        return total + Number(item.amount || 0);
    }, 0);


    if (income.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="3">No income data available.</td>
            </tr>
        `;

        return;
    }


    table.innerHTML = income.map(item => {

        const percentage = calculatePercentage(item.amount, totalIncome);

        return `
            <tr>
                <td>${escapeHTML(item.source)}</td>
                <td>${formatCurrency(item.amount)}</td>
                <td>${percentage}%</td>
            </tr>
        `;

    }).join("");
}


// =========================
// PUBLIC EXPENSE TABLE
// =========================

function renderPublicExpenseTable() {

    const table = document.getElementById("publicExpenseTable");

    if (!table) return;

    const expenses = getExpenses();

    const totalExpenses = expenses.reduce((total, item) => {
        return total + Number(item.amount || 0);
    }, 0);


    if (expenses.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="3">No expense data available.</td>
            </tr>
        `;

        return;
    }


    table.innerHTML = expenses.map(item => {

        const percentage = calculatePercentage(item.amount, totalExpenses);

        return `
            <tr>
                <td>${escapeHTML(item.category)}</td>
                <td>${formatCurrency(item.amount)}</td>
                <td>${percentage}%</td>
            </tr>
        `;

    }).join("");
}


// =========================
// PUBLIC BUDGET
// =========================

function renderPublicBudget() {

    const budget = getBudget();

    const actual = calculateTotalExpenses();

    const remaining = Number(budget.amount) - actual;


    const approvedBudget = document.getElementById("approvedBudget");
    const actualExpenditure = document.getElementById("actualExpenditure");
    const remainingBudget = document.getElementById("remainingBudget");


    if (approvedBudget) {
        approvedBudget.textContent = formatCurrency(budget.amount);
    }

    if (actualExpenditure) {
        actualExpenditure.textContent = formatCurrency(actual);
    }

    if (remainingBudget) {
        remainingBudget.textContent = formatCurrency(remaining);
    }
}


// =========================
// PUBLIC CHARTS
// =========================

function renderPublicCharts() {

    if (typeof Chart === "undefined") {
        console.warn("Chart.js is not loaded.");
        return;
    }


    const income = getIncome();
    const expenses = getExpenses();
    const budget = getBudget();


    // -------------------------
    // INCOME CHART
    // -------------------------

    const incomeCanvas = document.getElementById("incomeChart");

    if (incomeCanvas) {

        if (incomeChart) {
            incomeChart.destroy();
        }

        incomeChart = new Chart(incomeCanvas, {
            type: "doughnut",

            data: {
                labels: income.map(item => item.source),

                datasets: [{
                    data: income.map(item => Number(item.amount)),
                    borderWidth: 2
                }]
            },

            options: {
                responsive: true,

                plugins: {
                    legend: {
                        position: "bottom"
                    }
                }
            }
        });
    }


    // -------------------------
    // EXPENSE CHART
    // -------------------------

    const expenseCanvas = document.getElementById("expenseChart");

    if (expenseCanvas) {

        if (expenseChart) {
            expenseChart.destroy();
        }

        expenseChart = new Chart(expenseCanvas, {
            type: "doughnut",

            data: {
                labels: expenses.map(item => item.category),

                datasets: [{
                    data: expenses.map(item => Number(item.amount)),
                    borderWidth: 2
                }]
            },

            options: {
                responsive: true,

                plugins: {
                    legend: {
                        position: "bottom"
                    }
                }
            }
        });
    }


    // -------------------------
    // BUDGET CHART
    // -------------------------

    const budgetCanvas = document.getElementById("budgetChart");

    if (budgetCanvas) {

        if (budgetChart) {
            budgetChart.destroy();
        }


        const departmentData = {};

        expenses.forEach(item => {

            const department = item.department || "General";

            if (!departmentData[department]) {
                departmentData[department] = 0;
            }

            departmentData[department] += Number(item.amount || 0);

        });


        const departments = Object.keys(departmentData);

        const expenditure = departments.map(
            department => departmentData[department]
        );


        const departmentBudget = departments.map(() => {
            return departments.length
                ? Number(budget.amount) / departments.length
                : 0;
        });


        budgetChart = new Chart(budgetCanvas, {

            type: "bar",

            data: {

                labels: departments,

                datasets: [
                    {
                        label: "Budget",
                        data: departmentBudget,
                        borderWidth: 1
                    },
                    {
                        label: "Expenditure",
                        data: expenditure,
                        borderWidth: 1
                    }
                ]

            },

            options: {
                responsive: true,

                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}


// =========================
// INCOME FORM
// =========================

function openIncomeForm() {

    const form = document.getElementById("incomeFormCard");

    if (form) {
        form.style.display = "block";
    }
}


function closeIncomeForm() {

    const form = document.getElementById("incomeFormCard");

    if (form) {
        form.style.display = "none";
    }

    const incomeForm = document.getElementById("incomeForm");

    if (incomeForm) {
        incomeForm.reset();
    }
}


function addIncome(event) {

    event.preventDefault();


    const source = document.getElementById("incomeSource").value.trim();

    const amount = Number(
        document.getElementById("incomeAmount").value
    );

    const year = document.getElementById("incomeYear").value;


    if (!source || amount <= 0) {
        alert("Please enter a valid income source and amount.");
        return;
    }


    const income = getIncome();


    const newIncome = {
        id: Date.now(),
        source: source,
        amount: amount,
        year: year
    };


    income.push(newIncome);

    saveData(STORAGE_KEYS.income, income);


    closeIncomeForm();

    renderAdminIncomeTable();

    refreshEverything();

    alert("Income added successfully.");
}


// =========================
// EDIT INCOME
// =========================

function editIncome(id) {

    const income = getIncome();

    const item = income.find(i => i.id === id);

    if (!item) return;


    const source = prompt(
        "Enter income source:",
        item.source
    );

    if (source === null) return;


    const amount = prompt(
        "Enter amount in ₹ Crore:",
        item.amount
    );

    if (amount === null) return;


    const year = prompt(
        "Enter financial year:",
        item.year
    );

    if (year === null) return;


    item.source = source.trim();
    item.amount = Number(amount);
    item.year = year.trim();


    saveData(STORAGE_KEYS.income, income);


    renderAdminIncomeTable();

    refreshEverything();
}


// =========================
// DELETE INCOME
// =========================

function deleteIncome(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this income record?"
    );

    if (!confirmed) return;


    const income = getIncome();

    const updatedIncome = income.filter(item => item.id !== id);


    saveData(STORAGE_KEYS.income, updatedIncome);


    renderAdminIncomeTable();

    refreshEverything();
}


// =========================
// ADMIN INCOME TABLE
// =========================

function renderAdminIncomeTable() {

    const table = document.getElementById("adminIncomeTable");

    if (!table) return;


    const income = getIncome();


    if (income.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="5">No income records found.</td>
            </tr>
        `;

        return;
    }


    table.innerHTML = income.map((item, index) => {

        return `
            <tr>
                <td>${index + 1}</td>

                <td>
                    ${escapeHTML(item.source)}
                </td>

                <td>
                    ${escapeHTML(item.year)}
                </td>

                <td>
                    ${formatCurrency(item.amount)}
                </td>

                <td>
                    <button
                        class="edit-btn"
                        onclick="editIncome(${item.id})">
                        Edit
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteIncome(${item.id})">
                        Delete
                    </button>
                </td>
            </tr>
        `;

    }).join("");
}


// =========================
// EXPENSE FORM
// =========================

function openExpenseForm() {

    const form = document.getElementById("expenseFormCard");

    if (form) {
        form.style.display = "block";
    }
}


function closeExpenseForm() {

    const form = document.getElementById("expenseFormCard");

    if (form) {
        form.style.display = "none";
    }

    const expenseForm = document.getElementById("expenseForm");

    if (expenseForm) {
        expenseForm.reset();
    }
}


function addExpense(event) {

    event.preventDefault();


    const category = document
        .getElementById("expenseCategory")
        .value
        .trim();


    const amount = Number(
        document.getElementById("expenseAmount").value
    );


    const department = document
        .getElementById("expenseDepartment")
        .value
        .trim();


    const year = document.getElementById("expenseYear").value;


    if (!category || amount <= 0) {
        alert("Please enter a valid expense category and amount.");
        return;
    }


    const expenses = getExpenses();


    const newExpense = {

        id: Date.now(),

        category: category,

        amount: amount,

        department: department || "General",

        year: year
    };


    expenses.push(newExpense);


    saveData(
        STORAGE_KEYS.expenses,
        expenses
    );


    closeExpenseForm();

    renderAdminExpenseTable();

    refreshEverything();


    alert("Expense added successfully.");
}


// =========================
// EDIT EXPENSE
// =========================

function editExpense(id) {

    const expenses = getExpenses();

    const item = expenses.find(i => i.id === id);

    if (!item) return;


    const category = prompt(
        "Enter expense category:",
        item.category
    );

    if (category === null) return;


    const amount = prompt(
        "Enter amount in ₹ Crore:",
        item.amount
    );

    if (amount === null) return;


    const department = prompt(
        "Enter department:",
        item.department
    );

    if (department === null) return;


    const year = prompt(
        "Enter financial year:",
        item.year
    );

    if (year === null) return;


    item.category = category.trim();

    item.amount = Number(amount);

    item.department = department.trim();

    item.year = year.trim();


    saveData(
        STORAGE_KEYS.expenses,
        expenses
    );


    renderAdminExpenseTable();

    refreshEverything();
}


// =========================
// DELETE EXPENSE
// =========================

function deleteExpense(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this expense record?"
    );

    if (!confirmed) return;


    const expenses = getExpenses();


    const updatedExpenses = expenses.filter(
        item => item.id !== id
    );


    saveData(
        STORAGE_KEYS.expenses,
        updatedExpenses
    );


    renderAdminExpenseTable();

    refreshEverything();
}


// =========================
// ADMIN EXPENSE TABLE
// =========================

function renderAdminExpenseTable() {

    const table = document.getElementById(
        "adminExpenseTable"
    );

    if (!table) return;


    const expenses = getExpenses();


    if (expenses.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="6">
                    No expense records found.
                </td>
            </tr>
        `;

        return;
    }


    table.innerHTML = expenses.map((item, index) => {

        return `
            <tr>

                <td>
                    ${index + 1}
                </td>

                <td>
                    ${escapeHTML(item.category)}
                </td>

                <td>
                    ${escapeHTML(item.department || "General")}
                </td>

                <td>
                    ${escapeHTML(item.year)}
                </td>

                <td>
                    ${formatCurrency(item.amount)}
                </td>

                <td>

                    <button
                        class="edit-btn"
                        onclick="editExpense(${item.id})">
                        Edit
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteExpense(${item.id})">
                        Delete
                    </button>

                </td>

            </tr>
        `;

    }).join("");
}


// =========================
// BUDGET MANAGEMENT
// =========================

function loadBudgetForm() {

    const budget = getBudget();


    const budgetAmount =
        document.getElementById("budgetAmount");

    const capitalBudget =
        document.getElementById("capitalBudget");

    const operationalBudget =
        document.getElementById("operationalBudget");

    const budgetYear =
        document.getElementById("budgetYear");


    if (budgetAmount) {
        budgetAmount.value = budget.amount || "";
    }

    if (capitalBudget) {
        capitalBudget.value = budget.capital || "";
    }

    if (operationalBudget) {
        operationalBudget.value =
            budget.operational || "";
    }

    if (budgetYear) {
        budgetYear.value = budget.year || "2025–26";
    }
}


function updateBudget(event) {

    event.preventDefault();


    const amount = Number(
        document.getElementById("budgetAmount").value
    );


    const capital = Number(
        document.getElementById("capitalBudget").value
    );


    const operational = Number(
        document.getElementById("operationalBudget").value
    );


    const year =
        document.getElementById("budgetYear").value;


    if (amount <= 0) {

        alert(
            "Please enter a valid approved budget."
        );

        return;
    }


    const budget = {

        amount: amount,

        capital: capital || 0,

        operational: operational || 0,

        year: year
    };


    saveData(
        STORAGE_KEYS.budget,
        budget
    );


    refreshEverything();


    alert(
        "University budget updated successfully."
    );
}


// =========================
// ADMIN DASHBOARD
// =========================

function renderAdminDashboard() {

    const totalIncome = calculateTotalIncome();

    const totalExpenses =
        calculateTotalExpenses();

    const balance =
        totalIncome - totalExpenses;

    const budget = getBudget();


    const adminTotalIncome =
        document.getElementById(
            "adminTotalIncome"
        );


    const adminTotalExpenses =
        document.getElementById(
            "adminTotalExpenses"
        );


    const adminApprovedBudget =
        document.getElementById(
            "adminApprovedBudget"
        );


    const adminBalance =
        document.getElementById(
            "adminBalance"
        );


    if (adminTotalIncome) {
        adminTotalIncome.textContent =
            formatCurrency(totalIncome);
    }


    if (adminTotalExpenses) {
        adminTotalExpenses.textContent =
            formatCurrency(totalExpenses);
    }


    if (adminApprovedBudget) {
        adminApprovedBudget.textContent =
            formatCurrency(budget.amount);
    }


    if (adminBalance) {
        adminBalance.textContent =
            formatCurrency(balance);
    }


    renderAdminCharts();
}


// =========================
// ADMIN CHARTS
// =========================

function renderAdminCharts() {

    if (typeof Chart === "undefined") {
        return;
    }


    const income = getIncome();

    const expenses = getExpenses();


    // ADMIN INCOME CHART

    const incomeCanvas =
        document.getElementById(
            "adminIncomeChart"
        );


    if (incomeCanvas) {

        if (adminIncomeChart) {
            adminIncomeChart.destroy();
        }


        adminIncomeChart = new Chart(
            incomeCanvas,
            {
                type: "bar",

                data: {

                    labels:
                        income.map(
                            item => item.source
                        ),

                    datasets: [{
                        label: "Income (₹ Crore)",

                        data:
                            income.map(
                                item =>
                                    Number(item.amount)
                            ),

                        borderWidth: 1
                    }]
                },

                options: {

                    responsive: true,

                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            }
        );
    }


    // ADMIN EXPENSE CHART

    const expenseCanvas =
        document.getElementById(
            "adminExpenseChart"
        );


    if (expenseCanvas) {

        if (adminExpenseChart) {
            adminExpenseChart.destroy();
        }


        adminExpenseChart = new Chart(
            expenseCanvas,
            {
                type: "bar",

                data: {

                    labels:
                        expenses.map(
                            item =>
                                item.category
                        ),

                    datasets: [{
                        label: "Expenses (₹ Crore)",

                        data:
                            expenses.map(
                                item =>
                                    Number(item.amount)
                            ),

                        borderWidth: 1
                    }]
                },

                options: {

                    responsive: true,

                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            }
        );
    }
}


// =========================
// REPORT MANAGEMENT
// =========================

function renderPublicReports() {

    const container =
        document.getElementById(
            "publicReports"
        );


    if (!container) return;


    const reports = getReports();


    if (reports.length === 0) {

        container.innerHTML = `
            <p>No financial reports published yet.</p>
        `;

        return;
    }


    container.innerHTML =
        reports.map(report => {

            const viewLink =
                report.fileUrl &&
                report.fileUrl !== "#"
                    ? report.fileUrl
                    : "#";


            return `
                <div class="report-item">

                    <div class="report-icon">
                        PDF
                    </div>

                    <div class="report-info">

                        <h3>
                            ${escapeHTML(
                                report.title
                            )}
                        </h3>

                        <p>
                            Financial Year
                            ${escapeHTML(
                                report.year
                            )}
                        </p>

                    </div>

                    <a
                        href="${viewLink}"
                        class="view-report-btn"
                        target="_blank">

                        View

                    </a>

                </div>
            `;

        }).join("");
}


function renderAdminReports() {

    const container =
        document.getElementById(
            "adminReportsList"
        );


    if (!container) return;


    const reports = getReports();


    if (reports.length === 0) {

        container.innerHTML =
            "<p>No reports uploaded.</p>";

        return;
    }


    container.innerHTML =
        reports.map(report => {

            return `
                <div class="report-item">

                    <div class="report-icon">
                        PDF
                    </div>

                    <div class="report-info">

                        <h3>
                            ${escapeHTML(
                                report.title
                            )}
                        </h3>

                        <p>
                            ${escapeHTML(
                                report.year
                            )}
                        </p>

                    </div>

                    <button
                        class="delete-btn"
                        onclick="deleteReport(${report.id})">

                        Delete

                    </button>

                </div>
            `;

        }).join("");
}


function uploadReport(event) {

    event.preventDefault();


    const title =
        document.getElementById(
            "reportTitle"
        ).value.trim();


    const year =
        document.getElementById(
            "reportYear"
        ).value;


    const fileInput =
        document.getElementById(
            "reportFile"
        );


    const file =
        fileInput.files[0];


    if (!title) {

        alert(
            "Please enter report title."
        );

        return;
    }


    let fileUrl = "#";

    let fileName = "";


    /*
       Demo purpose:
       Object URL works during current browser session.
       Permanent file storage needs backend/server storage.
    */

    if (file) {

        if (
            file.type !== "application/pdf"
        ) {

            alert(
                "Please upload a PDF file."
            );

            return;
        }


        fileUrl =
            URL.createObjectURL(file);

        fileName = file.name;
    }


    const reports = getReports();


    reports.push({

        id: Date.now(),

        title: title,

        year: year,

        fileName: fileName,

        fileUrl: fileUrl
    });


    saveData(
        STORAGE_KEYS.reports,
        reports
    );


    document
        .getElementById("reportForm")
        .reset();


    renderAdminReports();

    renderPublicReports();


    alert(
        "Financial report added successfully."
    );
}


function deleteReport(id) {

    const confirmed =
        confirm(
            "Delete this financial report?"
        );


    if (!confirmed) return;


    const reports =
        getReports().filter(
            report => report.id !== id
        );


    saveData(
        STORAGE_KEYS.reports,
        reports
    );


    renderAdminReports();

    renderPublicReports();
}


// =========================
// SETTINGS
// =========================

function loadSettingsForm() {

    const settings =
        getSettings();


    const form =
        document.getElementById(
            "universitySettingsForm"
        );


    if (!form) return;


    const inputs =
        form.querySelectorAll(
            "input"
        );


    if (inputs.length >= 4) {

        inputs[0].value =
            settings.universityName || "";

        inputs[1].value =
            settings.email || "";

        inputs[2].value =
            settings.headName || "";

        inputs[3].value =
            settings.phone || "";
    }
}


function saveSettings(event) {

    event.preventDefault();


    const inputs =
        event.target.querySelectorAll(
            "input"
        );


    const settings = {

        universityName:
            inputs[0].value.trim(),

        email:
            inputs[1].value.trim(),

        headName:
            inputs[2].value.trim(),

        phone:
            inputs[3].value.trim()
    };


    saveData(
        STORAGE_KEYS.settings,
        settings
    );


    alert(
        "University settings saved successfully."
    );


    updateUniversityBrand();
}


function updateUniversityBrand() {

    const settings =
        getSettings();


    const heading =
        document.querySelector(
            ".university-brand h1"
        );


    if (
        heading &&
        settings.universityName
    ) {

        heading.textContent =
            settings.universityName;
    }
}


// =========================
// LAST UPDATED
// =========================

function updateLastUpdated() {

    const element =
        document.getElementById(
            "lastUpdated"
        );


    if (!element) return;


    const now = new Date();


    const formatted =
        now.toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );


    element.textContent =
        formatted;
}


// =========================
// REFRESH EVERYTHING
// =========================

function refreshEverything() {

    renderPublicWebsite();

    renderAdminDashboard();

    renderAdminIncomeTable();

    renderAdminExpenseTable();

    renderAdminReports();

    updateUniversityBrand();
}


// =========================
// INITIALIZE WEBSITE
// =========================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        // Initialize storage
        getIncome();
        getExpenses();
        getBudget();
        getReports();
        getSettings();


        // Public website
        renderPublicWebsite();


        // Admin tables
        renderAdminIncomeTable();

        renderAdminExpenseTable();

        renderAdminReports();


        // Admin dashboard
        renderAdminDashboard();


        // Settings
        loadSettingsForm();


        // Update university name
        updateUniversityBrand();


        // -------------------------
        // LOGIN FORM
        // -------------------------

        const loginForm =
            document.getElementById(
                "adminLoginForm"
            );


        if (loginForm) {

            loginForm.addEventListener(
                "submit",
                adminLogin
            );
        }


        // -------------------------
        // INCOME FORM
        // -------------------------

        const incomeForm =
            document.getElementById(
                "incomeForm"
            );


        if (incomeForm) {

            incomeForm.addEventListener(
                "submit",
                addIncome
            );
        }


        // -------------------------
        // EXPENSE FORM
        // -------------------------

        const expenseForm =
            document.getElementById(
                "expenseForm"
            );


        if (expenseForm) {

            expenseForm.addEventListener(
                "submit",
                addExpense
            );
        }


        // -------------------------
        // BUDGET FORM
        // -------------------------

        const budgetForm =
            document.getElementById(
                "budgetForm"
            );


        if (budgetForm) {

            budgetForm.addEventListener(
                "submit",
                updateBudget
            );
        }


        // -------------------------
        // REPORT FORM
        // -------------------------

        const reportForm =
            document.getElementById(
                "reportForm"
            );


        if (reportForm) {

            reportForm.addEventListener(
                "submit",
                uploadReport
            );
        }


        // -------------------------
        // SETTINGS FORM
        // -------------------------

        const settingsForm =
            document.getElementById(
                "universitySettingsForm"
            );


        if (settingsForm) {

            settingsForm.addEventListener(
                "submit",
                saveSettings
            );
        }


        // -------------------------
        // CLOSE MODAL ON OUTSIDE CLICK
        // -------------------------

        const modal =
            document.getElementById(
                "adminLoginModal"
            );


        if (modal) {

            modal.addEventListener(
                "click",
                function (event) {

                    if (
                        event.target === modal
                    ) {

                        closeAdminLogin();

                    }

                }
            );
        }


        // -------------------------
        // CHECK LOGIN STATUS
        // -------------------------

        const isLoggedIn =
            localStorage.getItem(
                STORAGE_KEYS.loggedIn
            );


        if (isLoggedIn === "true") {

            document.getElementById(
                "publicWebsite"
            ).style.display = "none";


            document
                .getElementById("adminPanel")
                .classList.add("active");


            showAdminSection(
                "dashboard"
            );

        }

    }
);