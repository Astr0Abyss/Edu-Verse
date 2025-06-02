// Sample student data
const students = [
    {
        studentId: "STU123456",
        firstName: "John",
        lastName: "Doe",
        date: "Jan 25, 2025",
        length: "1 hour 30 minutes",
        course: "Introduction to Programming"
    },
    {
        studentId: "STU331529",
        firstName: "Shahriar",
        lastName: "Ahmed",
        date: "Mar 10, 2025",
        length: "8 hours",
        course: "Python Programming"
    },
    {
        studentId: "STU331535",
        firstName: "Rahsan Al",
        lastName: "Saymon",
        date: "Dec 15, 2024",
        length: "12 hours",
        course: "C++ Programming"
    },
    {
        studentId: "STU331506",
        firstName: "Abu",
        lastName: "Sayed",
        date: "Jul 20, 2024",
        length: "6 hours 30 minutes",
        course: "JavaScript Fundamentals"
    },
    {
        studentId: "STU331552",
        firstName: "Numan",
        lastName: "Nash",
        date: "Never-Ending",
        length: "Infinity",
        course: "Algorithm by NOYON NATH"
    }
];

// Function to load student data into the form
function loadStudentData(studentId) {
    const student = students.find(s => s.studentId === studentId);
    if (student) {
        document.getElementById("fname").value = student.firstName;
        document.getElementById("lname").value = student.lastName;
        document.getElementById("date").value = student.date;
        document.getElementById("length").value = student.length;
        document.getElementById("course").value = student.course;
        document.getElementById("Generate").disabled = false; // Enable the Generate button
    } else {
        alert("Invalid Student ID! Please enter a valid 9-character Student ID.");
        document.getElementById("Generate").disabled = true; // Disable the Generate button
    }
}

// Event listener for Student ID input
document.getElementById("student-id").addEventListener("input", (e) => {
    const studentId = e.target.value.trim();
    if (studentId.length === 9) { // Check if the input is exactly 9 characters
        loadStudentData(studentId);
    } else {
        // Clear all fields if the input is not 9 characters
        document.getElementById("fname").value = "";
        document.getElementById("lname").value = "";
        document.getElementById("date").value = "";
        document.getElementById("length").value = "";
        document.getElementById("course").value = "";
        document.getElementById("Generate").disabled = true; // Disable the Generate button
    }
});