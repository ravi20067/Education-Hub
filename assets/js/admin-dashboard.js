document.addEventListener("DOMContentLoaded", () => {
    const manageUsersSection = document.getElementById("manageUsersSection");
    const manageCoursesSection = document.getElementById("manageCoursesSection");
    const userTableBody = document.getElementById("userTableBody");
    const courseTableBody = document.getElementById("courseTableBody");
    const dashboardContent = document.getElementById("dashboardContent");

    // Fetch data from JSON files
    let users = [];
    let courses = [];

    fetch("data/users.json")
        .then(response => response.json())
        .then(data => users = data);

    fetch("data/courses.json")
        .then(response => response.json())
        .then(data => courses = data.courses);

    // Event Listeners for Sidebar Links
    document.getElementById("manageUsers").addEventListener("click", () => {
        dashboardContent.classList.add("d-none");
        manageUsersSection.classList.remove("d-none");
        manageCoursesSection.classList.add("d-none");
        loadUsers();
    });

    document.getElementById("manageCourses").addEventListener("click", () => {
        dashboardContent.classList.add("d-none");
        manageUsersSection.classList.add("d-none");
        manageCoursesSection.classList.remove("d-none");
        loadCourses();
    });

    // Add User Button
    document.getElementById("addUserBtn").addEventListener("click", () => {
        const username = prompt("Enter username:");
        const password = prompt("Enter password:");
        const role = prompt("Enter role (admin/user):");

        if (username && password && role) {
            users.push({ id: username, password, role });
            saveUsers();
            loadUsers();
        }
    });

    // Add Course Button
    document.getElementById("addCourseBtn").addEventListener("click", () => {
        const courseName = prompt("Enter course name:");

        if (courseName) {
            courses.push({
                id: `course${courses.length + 1}`,
                name: courseName,
                chapters: []
            });
            saveCourses();
            loadCourses();
        }
    });

    // Load Users into Table
    function loadUsers() {
        userTableBody.innerHTML = "";
        users.forEach((user, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${user.id}</td>
                <td><input type="password" value="${user.password}" class="form-control password-input" data-index="${index}" id="password-${index}"/></td>
                <td>${user.role}</td>
                <td><button class="btn btn-warning btn-sm edit-user" data-index="${index}">Edit</button></td>
                <td><button class="btn btn-danger btn-sm delete-user" data-index="${index}">Delete</button></td>
            `;
            userTableBody.appendChild(row);
        });
        attachUserEventListeners();
    }

    // Attach Event Listeners for User Actions
    function attachUserEventListeners() {
        document.querySelectorAll(".edit-user").forEach(button => {
            button.addEventListener("click", (e) => {
                const index = e.target.dataset.index;
                users[index].password = document.querySelector(`.password-input[data-index='${index}']`).value;
                saveUsers();
                loadUsers();
            });
        });

        document.querySelectorAll(".delete-user").forEach(button => {
            button.addEventListener("click", (e) => {
                const index = e.target.dataset.index;
                users.splice(index, 1);
                saveUsers();
                loadUsers();
            });
        });
    }

    // Save Users to JSON
    function saveUsers() {
        fetch("data/users.json", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(users)
        });
    }

    // Load Courses into Table
    function loadCourses() {
        courseTableBody.innerHTML = "";
        courses.forEach((course, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td><input type="text" value="${course.name}" class="form-control course-name-input" data-index="${index}" id="course-name-${index}"/></td>
                <td><button class="btn btn-warning btn-sm edit-course-name" data-index="${index}">Edit Name</button></td>
                <td><button class="btn btn-info btn-sm edit-course-details" data-index="${index}">Edit Details</button></td>
            `;
            courseTableBody.appendChild(row);
        });
        attachCourseEventListeners();
    }

    // Attach Event Listeners for Course Actions
    function attachCourseEventListeners() {
        document.querySelectorAll(".edit-course-name").forEach(button => {
            button.addEventListener("click", (e) => {
                const index = e.target.dataset.index;
                courses[index].name = document.querySelector(`.course-name-input[data-index='${index}']`).value;
                saveCourses();
            });
        });

        document.querySelectorAll(".edit-course-details").forEach(button => {
            button.addEventListener("click", (e) => {
                const index = e.target.dataset.index;
                editCourseDetails(index);
            });
        });
    }

    // Save Courses to JSON
    function saveCourses() {
        fetch("data/courses.json", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ courses })
        });
    }

    // Edit Course Details
    function editCourseDetails(courseIndex) {
        const course = courses[courseIndex];
        const courseDetails = document.createElement("div");
        courseDetails.innerHTML = `
            <h3>${course.name}</h3>
            <button class="btn btn-primary btn-sm add-chapter" data-index="${courseIndex}">Add Chapter</button>
            <hr/>
            <table class="table table-dark table-striped">
                <thead>
                    <tr>
                        <th>Chapter Name</th>
                        <th>Edit Chapter</th>
                        <th>Edit Mini-Chapters</th>
                    </tr>
                </thead>
                <tbody>
                    ${course.chapters.map((chapter, chapterIndex) => `
                        <tr>
                            <td><input type="text" value="${chapter.name}" class="form-control chapter-name-input" data-course="${courseIndex}" data-chapter="${chapterIndex}" id="chapter-name-${courseIndex}-${chapterIndex}"/></td>
                            <td><button class="btn btn-warning btn-sm edit-chapter-name" data-course="${courseIndex}" data-chapter="${chapterIndex}">Edit Chapter</button></td>
                            <td><button class="btn btn-info btn-sm edit-mini-chapters" data-course="${courseIndex}" data-chapter="${chapterIndex}">Edit Mini-Chapters</button></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        dashboardContent.innerHTML = "";
        dashboardContent.appendChild(courseDetails);

        attachEditChapterEvents(courseIndex);
        attachAddMiniEvents(courseIndex);
    }

    // Add Chapter
    function addChapter(courseIndex) {
        const chapterName = prompt("Enter chapter name:");
        if (chapterName) {
            courses[courseIndex].chapters.push({
                id: `chapter${courses[courseIndex].chapters.length + 1}`,
                name: chapterName,
                miniChapters: []
            });
            saveCourses();
            editCourseDetails(courseIndex);
        }
    }

    // Attach Event Listeners for Chapter and Mini-Chapter Actions
    function attachEditChapterEvents(courseIndex) {
        document.querySelectorAll(".edit-chapter-name").forEach(button => {
            button.addEventListener("click", (e) => {
                const chapterIndex = e.target.dataset.chapter;
                const newName = prompt("Enter new chapter name:", courses[courseIndex].chapters[chapterIndex].name);
                if (newName) {
                    courses[courseIndex].chapters[chapterIndex].name = newName;
                    saveCourses();
                    editCourseDetails(courseIndex);
                }
            });
        });

        document.querySelectorAll(".edit-mini-chapters").forEach(button => {
            button.addEventListener("click", (e) => {
                const chapterIndex = e.target.dataset.chapter;
                // Add logic to edit mini-chapters
            });
        });
    }

    // Attach Event Listeners for Chapter and Mini-Chapter Actions
    function attachAddMiniEvents(courseIndex) {
        document.querySelectorAll(".edit-mini-name").forEach(button => {
            button.addEventListener("click", (e) => {
                const chapterIndex = e.target.dataset.chapter;
                const miniIndex = e.target.dataset.mini;
                const newName = prompt("Enter new mini-chapter name:", courses[courseIndex].chapters[chapterIndex].miniChapters[miniIndex].name);
                if (newName) {
                    courses[courseIndex].chapters[chapterIndex].miniChapters[miniIndex].name = newName;
                    saveCourses();
                    editCourseDetails(courseIndex);
                }
            });
        });

        document.querySelectorAll(".edit-mini-details").forEach(button => {
            button.addEventListener("click", (e) => {
                const chapterIndex = e.target.dataset.chapter;
                const miniIndex = e.target.dataset.mini;
                const miniChapter = courses[courseIndex].chapters[chapterIndex].miniChapters[miniIndex];
                const newVideoLink = prompt("Enter new video link:", miniChapter.videos[0]);
                const newPdfLink = prompt("Enter new PDF link:", miniChapter.pdfs[0]);
                if (newVideoLink && newPdfLink) {
                    miniChapter.videos[0] = newVideoLink;
                    miniChapter.pdfs[0] = newPdfLink;
                    saveCourses();
                    editCourseDetails(courseIndex);
                }
            });
        });
    }
});