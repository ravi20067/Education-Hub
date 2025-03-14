document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Fetch courses.json
        const response = await fetch("data/courses.json");
        if (!response.ok) throw new Error("Failed to load courses data!");

        const data = await response.json();
        if (!data.courses || data.courses.length === 0) {
            throw new Error("No courses found in JSON!");
        }

        // Get UI Elements
        const navCourses = document.querySelector(".navbar-nav");
        const sidebarChapters = document.querySelector(".sidebar-chapters");
        const videoContainer = document.querySelector(".video-container");
        const pdfEmbed = document.querySelector("embed");
        const descriptionBox = document.querySelector(".description-box");

        // Default Placeholder
        function clearContent() {
            videoContainer.innerHTML = `<img src="assets/img/poster.webp" class="img-fluid rounded shadow-lg" alt="Select a chapter to watch videos">`;
            pdfEmbed.src = "";
            descriptionBox.innerHTML = "<p>Select a mini-chapter to view content.</p>";
        }

        // Populate Navigation Bar
        data.courses.forEach((course) => {
            const courseItem = document.createElement("li");
            courseItem.className = "nav-item";

            const courseLink = document.createElement("a");
            courseLink.className = "nav-link";
            courseLink.href = "#";
            courseLink.textContent = course.name;

            courseLink.addEventListener("click", () => {
                sidebarChapters.innerHTML = "";
                clearContent();

                if (!course.chapters || course.chapters.length === 0) {
                    sidebarChapters.innerHTML = "<p>No chapters available.</p>";
                    return;
                }

                // Populate Chapters
                course.chapters.forEach((chapter) => {
                    const chapterItem = document.createElement("li");
                    chapterItem.className = "nav-item";

                    const chapterLink = document.createElement("a");
                    chapterLink.className = "nav-link text-light fw-bold";
                    chapterLink.href = "#";
                    chapterLink.textContent = chapter.name;

                    // Mini Chapters Container
                    const miniChaptersList = document.createElement("ul");
                    miniChaptersList.className = "nav flex-column ms-3 d-none";

                    chapterLink.addEventListener("click", () => {
                        if (miniChaptersList.classList.contains("d-none")) {
                            miniChaptersList.classList.remove("d-none");
                            clearContent();

                            if (!chapter.miniChapters || chapter.miniChapters.length === 0) {
                                miniChaptersList.innerHTML = "<p>No mini-chapters available.</p>";
                                return;
                            }

                            // Populate Mini Chapters
                            miniChaptersList.innerHTML = ""; // Clear previous mini-chapters
                            chapter.miniChapters.forEach((mini) => {
                                const miniItem = document.createElement("li");
                                miniItem.className = "nav-item";

                                const miniLink = document.createElement("a");
                                miniLink.className = "nav-link text-light";
                                miniLink.href = "#";
                                miniLink.textContent = `- ${mini.name}`;

                                miniLink.addEventListener("click", () => {
                                    // Update Video Player
                                    if (mini.videos?.length > 0) {
                                        videoContainer.innerHTML = `
                                            <div class="ratio ratio-16x9">
                                                <iframe src="${mini.videos[0]}" frameborder="0" allowfullscreen></iframe>
                                            </div>
                                        `;
                                    } else {
                                        videoContainer.innerHTML = `<img src="assets/img/placeholder.jpg" class="img-fluid rounded shadow-lg" alt="No video available">`;
                                    }

                                    // Update PDF Viewer
                                    pdfEmbed.src = mini.pdfs?.length > 0 ? mini.pdfs[0] : "";

                                    // Update Description
                                    const formattedDescription = mini.description ? mini.description.replace(/\n/g, "<br>") : "No description available.";
                                    descriptionBox.innerHTML = `<p>${formattedDescription}</p>`;
                                });

                                miniItem.appendChild(miniLink);
                                miniChaptersList.appendChild(miniItem);
                            });
                        } else {
                            miniChaptersList.classList.add("d-none");
                        }
                    });

                    chapterItem.appendChild(chapterLink);
                    chapterItem.appendChild(miniChaptersList);
                    sidebarChapters.appendChild(chapterItem);
                });
            });

            courseItem.appendChild(courseLink);
            navCourses.appendChild(courseItem);
        });
    } catch (error) {
        console.error("Error loading course data:", error.message);
    }
});