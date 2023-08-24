
$(document).ready(function() {


    ["monday", "tuesday", "wednesday", "thursday", "friday"].forEach(day => {
        document.getElementById(`checkbox-${day}-add`).addEventListener('change', function() {
            const correspondingContainer = document.getElementById(`${day}_enabled-add`);
            if(this.checked) {
                correspondingContainer.style.display = "flex";
            } else {
                correspondingContainer.style.display = "none";
            }
        });
    });

    document.getElementById("everyday").addEventListener('change', function() {
        if(this.checked) {
            document.getElementById("everydaySchedule").style.display = "block";
            document.getElementById("customSchedule").style.display = "none";
        }
    });

    document.getElementById("custom").addEventListener('change', function() {
        if(this.checked) {
            document.getElementById("everydaySchedule").style.display = "none";
            document.getElementById("customSchedule").style.display = "block";
        }
    });


    // edit menu - schedule changer button

    ["monday", "tuesday", "wednesday", "thursday", "friday"].forEach(day => {
        document.getElementById(`checkbox-${day}`).addEventListener('change', function() {
            const correspondingContainer = document.getElementById(`${day}_enabled`);
            if(this.checked) {
                correspondingContainer.style.display = "flex";
            } else {
                correspondingContainer.style.display = "none";
            }
        });
    });


    document.getElementById("edit-everyday").addEventListener('change', function() {
        if(this.checked) {
            document.getElementById("edit-everydaySchedule").style.display = "block";
            document.getElementById("edit-customSchedule").style.display = "none";
        }
    });

    document.getElementById("edit-custom").addEventListener('change', function() {
        if(this.checked) {
            document.getElementById("edit-everydaySchedule").style.display = "none";
            document.getElementById("edit-customSchedule").style.display = "block";
        }
    });

});

function formatTime(time) {
    var timeParts = time.split(":");
    var hours = parseInt(timeParts[0], 10);
    var minutes = timeParts[1];
    if (hours < 10) {
        hours = "0" + hours;
    }
    return hours + ":" + minutes;
}

// Helper function to determine if all days have the same schedule
function hasSameSchedule(schedule) {
    let firstStart = null;
    let firstEnd = null;
    let consistentSchedule = true;

    for (let day in schedule) {
        if (schedule[day].start && schedule[day].end) {
            if (firstStart === null && firstEnd === null) {
                firstStart = schedule[day].start;
                firstEnd = schedule[day].end;
            } else if (schedule[day].start !== firstStart || schedule[day].end !== firstEnd) {
                consistentSchedule = false;
                break;
            }
        }
    }

    return consistentSchedule;
}


function populateEditMenu(buttonElement) {
    var user = JSON.parse(buttonElement.getAttribute('data-person'));
    let isEveryday = hasSameSchedule(user.Schedule);

    // Fixing the IDs for inputs
    document.querySelector('#edit-UUID').value = user.UUID;
    document.querySelector('#edit-name').value = user.name;
    document.querySelector('#edit-contact_number').value = user.phone;
    document.querySelector('#edit-email').value = user.email;
    document.querySelector('#edit-role').value = user.title;

    if (user.join_date.includes("/")) {
        var joinDateParts = user.join_date.split('/');
        document.querySelector('#edit-join_date').value = joinDateParts[0] + '-' + joinDateParts[1] + '-' + joinDateParts[2];
    } else {
        document.querySelector('#edit-join_date').value = user.join_date;
    }

    document.querySelector('#edit-hourly_rate').value = user.hourly;
    document.querySelector('#edit-annual-leave').value = user.annual_leave;

    let noWorkSchedule_days = [];
    let firstDayWithSetHours = null;  // Use this to store the first day with set hours

    for (let day in user.Schedule) {
        if (!user.Schedule[day].start || !user.Schedule[day].end) {
            noWorkSchedule_days.push(day);
        } else if (!firstDayWithSetHours) {
            firstDayWithSetHours = day;
        }
    }
    console.log(user.Schedule);
    // Populate each day's schedule
    for (let day in user.Schedule) {
        const startInput = document.getElementById(`edit-${day.toLowerCase()}_start_time`);
        const endInput = document.getElementById(`edit-${day.toLowerCase()}_end_time`);

        console.log(startInput);

        if (startInput && endInput) {
            startInput.value = user.Schedule[day].start ? formatTime(user.Schedule[day].start) : '';
            console.log("start: "+ user.Schedule[day].start + ": after"+ startInput.value);
            endInput.value = user.Schedule[day].end ? formatTime(user.Schedule[day].end) : '';
        }
    }

    for (const day of noWorkSchedule_days) {
        document.getElementById(`checkbox-${day.toLowerCase()}`).checked = false;
        const correspondingContainer = document.getElementById(`${day.toLowerCase()}_enabled`);
        if (correspondingContainer) {
            correspondingContainer.style.display = "none";
        }
    }

    if (isEveryday) {
        document.getElementById('edit-everyday').checked = true;
        document.getElementById('edit-custom').checked = false;
        document.getElementById('edit-customSchedule').style.display = "none";
        document.getElementById('edit-everydaySchedule').style.display = "block";

        if (firstDayWithSetHours) {
            document.getElementById('edit-start_time').value = formatTime(user.Schedule[firstDayWithSetHours].start);
            document.getElementById('edit-end_time').value = formatTime(user.Schedule[firstDayWithSetHours].end);
        } else {
            document.getElementById('edit-start_time').value = '';
            document.getElementById('edit-end_time').value = '';
        }
    } else {
        document.getElementById('edit-everyday').checked = false;
        document.getElementById('edit-custom').checked = true;
        document.getElementById('edit-everydaySchedule').style.display = "none";
        document.getElementById('edit-customSchedule').style.display = "block";
    }
    document.getElementById("edit-EditUpdateForm").scrollIntoView({
        behavior: "smooth", // smooth scroll
        block: "start",     // align to top
        inline: "nearest"  // for horizontal scrolling if needed
    });





}





function clearEditForm() {
    // Reset all text and number inputs
    let textInputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="number"], input[type="date"], input[type="time"]');
    textInputs.forEach(input => input.value = '');

    // Reset radio buttons and checkboxes to default
    document.querySelector('#edit-everyday').checked = true;
    let checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => checkbox.checked = true);

    // Reset select dropdowns
    let selects = document.querySelectorAll('select');
    selects.forEach(select => select.selectedIndex = 0);
}


function submitFormAddPerson(json) {
    console.log(json);
    fetch("/update-employee", {
        method: "POST",
        body: json,
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.Valid) {
                // Call processEmployee for the new site to handle processing
                processEmployee();

                Promise.all([
                    fetch('/employee-list').then(response => response.json()),
                    fetch('/archived-employee-list').then(response => response.json())
                ]).then(([employees, archived]) => {
                    window.users = employees;
                    window.archived_users = archived;

                    // Update the DOM based on the updated data
                    updateDOM();
                    $('#addPerson').hide();
                });
            } else {
                // Handle error
                console.log(data.Error);
                handleError(data.Error, JSON.parse(json));
            }
        })
        .catch((error) => {
            console.log('Error:', error);
        });
}

$('#updateForm').on('submit', function (e) {
    e.preventDefault();

    let formData = new FormData(this);
    let object = {};
    formData.forEach(function (value, key) {
        object[key] = value;
    });

    if (object['schedule_type'] === "custom") {
        const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday"];

        daysOfWeek.forEach(day => {
            if (!document.getElementById(`checkbox-${day}-add`).checked) {
                object[`${day}_start_time`] = null;
                object[`${day}_end_time`] = null;
            }
        });
    }

    object['add'] = true;
    let json = JSON.stringify(object);

    submitFormAddPerson(json);

    console.log('Form Submitted');
});

