/**
 ADD - EMPLOYEE - FUNCTIONS
 */


/**
 * Sets the default employee payload.
 * @param {boolean} conflict - Indicates if a conflict was detected in last request & User wants to bypass warning
 * @param {string} [UUID] - An optional UUID. If provided, this will update the existing employee.
 * @returns {object} The employee payload.
 */
function addEmployeePayload(conflict = false) {
    return {
        "conflict_confirm": conflict,
        "full_name": document.querySelector('#name').value,
        "contact_number": document.querySelector('#contact_number').value,
        "contact_email": document.querySelector('#email').value,
        "role": document.querySelector('#role').value,
        "join_date": document.querySelector('#join_date').value,
        "hourly_rate": document.querySelector('#hourly_rate').value,
        "annual-leave": document.querySelector('#annual-leave').value,
        "add": true,
    };
}


/**
 * Adds the schedule type to the employee payload based on the selected option.
 * This data will be collected from the Create Employee Form
 */
function addScheduleToPayload(payload) {
    let scheduleType = document.querySelector('input[name="schedule_type"]:checked').value;
    payload.schedule_type = scheduleType;

    if (scheduleType === 'everyday') {
        payload.everyday_start_time = document.querySelector('#start_time').value;
        payload.everyday_end_time = document.querySelector('#end_time').value;
    } else {
        let days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
        days.forEach(day => {
            payload[`${day}_start_time`] = document.querySelector(`#${day}_start_time`).value;
            payload[`${day}_end_time`] = document.querySelector(`#${day}_end_time`).value;
        });
    }
}



/**
 * Handle API response errors.
 * @param {object} data - The API response data.
 */
function handleApiErrors(data) {
    if (data.error) {
        // Handle missing fields
        if (data.error['Missing fields']) {
            console.log("You are missing the following fields:");
            data.error['Missing fields'].forEach(field => console.log(field));
        }

        // Handle conflict
        if (data.error['Conflict']) {
            console.log("Employee conflict raised due to fields existing for the following employees:");


            // Warning message with a prompt for the user.
            let conflict_message = "Existing employee shares fields. Would you like to add your employee anyway?\nConflicts:\n";
            for (let field in data.error['Conflict']) {
                console.log(field, data.error['Conflict'][field]);

                // If the field itself is a key in the conflict object, grab its value.
                if(data.error['Conflict'][field][field]) {
                    conflict_message += field + ": " + data.error['Conflict'][field][field] + "\n";
                }
            }
            const userConfirmed = confirm(conflict_message);
            // This confirm() dialog box should be replaced with a Html/CSS/Js Dialog box
            if(userConfirmed) {
                create_employee_example(true); // bypass warning message & Add new employee anyway
            }
        }

        // Handle generic message
        if (data.error['Message']) {
            console.log("Standard error message: Field may have been sent but format may have been wrong or unexpected data received.");
            console.log(data.error['Message']);
        }
    }
}

/**
 * Create or edit an employee based on the given data.
 * @param {boolean} conflict - Indicates if a conflict was detected.
 * @param {string} [UUID] - An optional UUID. If provided, this will update the existing employee.
 */
function createEmployee(conflict = false) {
    let employeePayload = addEmployeePayload(conflict);
    addScheduleToPayload(employeePayload);

    window.api.createAndEditEmployee(employeePayload).then(data => {
        console.log(data);
        if (data.Valid) {
            console.log(`Employee has been created`);

            getEmployees();
            getArchivedEmployees();
            document.getElementById("active-employees-title").scrollIntoView({
                behavior: "smooth", // smooth scroll
                block: "start",     // align to top
                inline: "nearest"  // for horizontal scrolling if needed
            });

            return;
        }
        handleApiErrors(data);
    }).catch(error => console.error(error));
}

/**
 EDIT & UPDATE - EMPLOYEE - FUNCTIONS
 */

function editEmployee() {
    let employeePayload = editEmployeePayload(); // Get the employee details payload
    editScheduleToPayload(employeePayload);      // Add schedule details to the payload

    window.api.createAndEditEmployee(employeePayload).then(data => {
        console.log(data);
        if (data.Valid) {
            console.log(`Employee has been edited`);
            getEmployees();
            getArchivedEmployees();
            document.getElementById("active-employees-title").scrollIntoView({
                behavior: "smooth", // smooth scroll
                block: "start",     // align to top
                inline: "nearest"  // for horizontal scrolling if needed
            });
            return;
        }
        handleApiErrors(data);
    }).catch(error => console.error(error));
}


function editEmployeePayload() {
    return {
        "UUID": document.querySelector('#edit-UUID').value,
        "full_name": document.querySelector('#edit-name').value,
        "contact_number": document.querySelector('#edit-contact_number').value,
        "contact_email": document.querySelector('#edit-email').value,
        "role": document.querySelector('#edit-role').value,
        "join_date": document.querySelector('#edit-join_date').value,
        "hourly_rate": document.querySelector('#edit-hourly_rate').value,
        "annual-leave": document.querySelector('#edit-annual-leave').value, // Note: Fixed "annual-leave" to "annual_leave" to keep it consistent with the naming convention
    };
}


function editScheduleToPayload(payload) {
    if (document.getElementById("edit-everyday").checked) {
        payload.everyday_start_time = document.querySelector('#edit-start_time').value;
        payload.everyday_end_time = document.querySelector('#edit-end_time').value;
        payload.schedule_type = "everyday";
    } else {
        let days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
        days.forEach(day => {
            if (document.querySelector(`#checkbox-${day}`).checked) {
                payload[`${day}_start_time`] = document.querySelector(`#edit-${day}_start_time`).value;
                payload[`${day}_end_time`] = document.querySelector(`#edit-${day}_end_time`).value;
            }
        });
        payload.schedule_type = "custom";
    }
}





/**
 * Create or edit an employee based on the given data.
 * @param {boolean} archiveType - true = Archive Employee , false = Unarchive Employee
 * @param {string} [UUID] - Employee UUID - This selects which employee you are changing.
 */
async function handleArchiveEmployee(archiveType,UUID) {

    // Simple validation
    console.log(UUID);
    if (!UUID) {
        alert("Please provide employee uuid!");
        return;
    }

    try {
        const data = await window.api.archiveEmployee(UUID, archiveType);
        console.log(data);
        if (data.Valid) {
            console.log(`Employee with UUID ${UUID} has been archived with type ${archiveType}`);
            getEmployees();
            getArchivedEmployees();
        } else {
            // Using the existing error handler
            handleApiErrors(data);
        }
    } catch (error) {
        console.error("Error while sending request:", error);
        alert("Error while archiving employee. Check console for more details.");
    }
}

/**
 * Get the employees from API into page & fill the table
 */
function getEmployees() {
    window.api.getEmployees().then(data => {
        window.users = data;
        const activeTableBody = document.querySelector('#active-table-body');
        if (activeTableBody) { // Check if '#active-table-body' exists in the page
            populateTable(data, '#active-table-body');
        }
    }).catch(error => console.error(error));
}

function getArchivedEmployees() {
    window.api.getArchivedEmployees().then(data => {
        window.archivedUsers = data;
        const archivedTableBody = document.querySelector('#archived-table-body');
        if (archivedTableBody) { // Check if '#archived-table-body' exists in the page
            populateTable(window.archivedUsers, '#archived-table-body');
        }
    }).catch(error => console.error(error));
}



document.onreadystatechange = async function () {
    if (document.readyState === "complete") {
        window.api = new API("https://48ca-108-170-31-44.ngrok-free.app");
        window.roles = await window.api.getRoles();

        //processEmployee(false,"a1a1d786-dab1-484e-a627-59c830bbc07f"); // edit Employee
        getEmployees();
        getArchivedEmployees();

        const roleSelect = document.getElementById('role');
        window.roles.forEach(role => {
            const option = document.createElement('option');
            option.value = role.toLowerCase();
            option.textContent = role;
            roleSelect.appendChild(option);
        });
        const roleSelectEdit = document.getElementById('edit-role');
        window.roles.forEach(role => {
            const option = document.createElement('option');
            option.value = role.toLowerCase();
            option.textContent = role;
            roleSelectEdit.appendChild(option);
        });



    }
};