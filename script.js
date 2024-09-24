

const form = document.getElementById("studentForm");
const studentRecords = document.getElementById("studentRecords");

document.addEventListener("DOMContentLoaded", loadFromLocalStorage);

// Handle form submission
form.addEventListener("submit", function(event) {
    event.preventDefault();

    // Get form values
    const studentName = document.getElementById("studentName").value.trim();
    const studentId = document.getElementById("studentId").value.trim();
    const email = document.getElementById("email").value.trim();
    const contactNo = document.getElementById("contactNo").value.trim();


    // Validate form inputs
    const nameValid = validateName(studentName);
    const contactValid = validateContact(contactNo);
    const emailValid = validateEmail(email);

    if (!nameValid) {
        alert("Name must contain only alphabetic characters (a-z, A-Z). No numbers or special characters allowed.");
        return;
    }

    if (!contactValid) {
        alert("Contact number must be a 10-digit number.");
        return;
    }

    if (!emailValid) {
        alert("Invalid email address. Email must contain '@' and be in the correct format (e.g., example@example.com).");
        return;
    }

    // Check for duplicate student ID
    if (checkDuplicateID(studentId)) {
        alert("Student ID already exists. Please enter a unique Student ID.");
        return;
    }

    addStudent(studentName, studentId, email, contactNo);
    saveToLocalStorage(); // Save to localStorage after adding the student
    form.reset();
});

// Function to add a student to the table and local storage
function addStudent(name, id, email, contact) {
    const row = document.createElement("tr");

    row.innerHTML = `
        <td data-label="Student Name">${name}</td>
        <td data-label="Student ID">${id}</td>
        <td data-label="Email ID">${email}</td>
        <td data-label="Contact No.">${contact}</td>
        <td data-label="Actions">
            <button class="edit" onclick="editStudent(this)">Edit</button>
            <button class="delete" onclick="deleteStudent(this)">Delete</button>
        </td>
    `;
    studentRecords.appendChild(row);
}

// Validate inputs


// Validate name: only alphabetic characters (a-z, A-Z)
function validateName(name) {
    const namePattern = /^[a-zA-Z\s]+$/; // Name should only contain letters (a-z, A-Z) and spaces
    return namePattern.test(name);
}

// Validate contact: must be a 10-digit number
function validateContact(contact) {
    const contactPattern = /^\d{10}$/;  // Contact number must be exactly 10 digits
    return contactPattern.test(contact);
}

// Validate email: should follow standard email format
function validateEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
}


// Check for duplicate student ID
function checkDuplicateID(id) {
    const rows = studentRecords.querySelectorAll("tr");
    for (let row of rows) {
        const cells = row.getElementsByTagName("td");
        if (cells[1] && cells[1].textContent === id) {
            return true;  // Duplicate ID found
        }
    }
    return false;  // No duplicate found
}

// Edit student
function editStudent(button) {
    const row = button.parentElement.parentElement;
    const cells = row.getElementsByTagName("td");

    const studentName = cells[0].textContent;
    const studentId = cells[1].textContent;
    const email = cells[2].textContent;
    const contactNo = cells[3].textContent;

    document.getElementById("studentName").value = studentName;
    document.getElementById("studentId").value = studentId;
    document.getElementById("email").value = email;
    document.getElementById("contactNo").value = contactNo;

    row.remove();
    saveToLocalStorage();
}

// Delete student
function deleteStudent(button) {
    button.parentElement.parentElement.remove();
    saveToLocalStorage();
}

// Save student data to local storage
function saveToLocalStorage() {
    const studentData = [];
    studentRecords.querySelectorAll("tr").forEach(row => {
        const cells = row.getElementsByTagName("td");
        studentData.push({
            name: cells[0].textContent,
            id: cells[1].textContent,
            email: cells[2].textContent,
            contact: cells[3].textContent
        });
    });
    localStorage.setItem("students", JSON.stringify(studentData));
}

// Load student data from local storage
function loadFromLocalStorage() {
    const storedData = localStorage.getItem("students");
    if (storedData) {
        const students = JSON.parse(storedData);
        students.forEach(student => {
            addStudent(student.name, student.id, student.email, student.contact);
        });
    }
}

