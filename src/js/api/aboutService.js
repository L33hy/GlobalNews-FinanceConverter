// src/js/api/aboutService.js

/**
 * Loads team members from the employees.json file and displays them.
 */
export async function loadTeamMembers() {
    const teamContainer = document.getElementById("team-members");
    // Clear existing content to prevent duplicates if function is called multiple times
    teamContainer.innerHTML = ""; 

    try {
        const response = await fetch("/employees.json");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const employees = await response.json();

        if (employees && employees.length > 0) {
            employees.forEach(employee => {
                const employeeCard = document.createElement("div");
                employeeCard.classList.add("team-member-card");

                employeeCard.innerHTML = `
                    <img src="${employee.image}" alt="${employee.name}" onerror="this.onerror=null;this.src='https://placehold.co/150x150/cccccc/ffffff?text=Image+Not+Found';">
                    <h3>${employee.name}</h3>
                    <p class="role">${employee.role}</p>
                    <p class="description">${employee.description}</p>
                `;
                teamContainer.appendChild(employeeCard);
            });
        } else {
            teamContainer.innerHTML = "<p class='error-message'>No team members found.</p>";
        }

    } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to load team members:", error);
        teamContainer.innerHTML = "<p class='error-message'>Failed to load team members. Please try again later.</p>";
    }
}

/**
 * Initializes the About Us module.
 * Currently, this only sets up the function to load team members.
 * It's kept as an export for consistency with other service modules.
 */
export function initAbout() {
    // You could add other initializations for the About Us section here if needed.
    // For now, loading team members is triggered by navigation.
}