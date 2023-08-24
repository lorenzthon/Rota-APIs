function createTableHeader(letter) {
    return '<tr><td class="sticky" colspan="8"><h3>' + letter.toUpperCase() + '</h3></td></tr>';
}
function createUserRow(user, isArchived) {



    var archiveText = isArchived ? '<i class="fa fa-share-square" aria-hidden="true"></i>' : '<i class="fa fa-archive" aria-hidden="true"></i>';
    var archiveCol = isArchived ? 'white' : 'orange';

    var archiveType = isArchived ? false : true;


    var scheduleTable = appendScheduleTable(user);

    var row = `
      <tr>
        <td>
          <div class="flex-column">
            <div><b>Employee</b></div>
            <div>${user.name}</div>
            <div>${user.title}</div>
          </div>
        </td>
        <td>
          <div class="flex-column">
            <div><b>Annual leave hours left</b></div>
            <div>${user.annual_leave}</div>
          </div>
        </td>
        <td>
          <div class="flex-column">
            <div><b>Contact</b></div>
            <div>${user.phone}</div>
            <div>${user.email}</div>
          </div>
        </td>
        <td>
          <div class="flex-column">
            <div><b>Hourly rate</b></div>
            <div>${user.hourly}</div>
          </div>
        </td>
        <td>
          <div class="flex-column">
            <div><b>Join date</b></div>
            <div>${user.join_date}</div>
          </div>
        </td>
        <td>${scheduleTable}</td>
        <td>
          <button class="employeeButton EditoremployeeButton" style="font-size: 1em;margin:1.5em;" data-person='${JSON.stringify(user)}' onclick="populateEditMenu(this)">Edit</button>

        </td>
        <td>
          <button onclick="handleArchiveEmployee(${archiveType}, '${user.UUID}')"

           class="employeeButton ArchiveButton" style="font-size: 1em;margin:1.5em;color:${archiveCol}"
            data-person='${JSON.stringify(user)}'>${archiveText}

            </button>
            
            
        </td>
      </tr>
    `;
    return row;
}
function appendScheduleTable(user) {
    var scheduleTable = '<div class="flex-row">';
    hasSchedule = false;
    $.each(user.Schedule, function(day, times) {

        if (times.start && times.end)
        {
            hasSchedule = true;
            scheduleTable += '<div><strong>' + day + '</strong><div>' + times.start + '</div><div>' + times.end + '</div></div>';
        }

    });
    if (!hasSchedule)
    {
        scheduleTable += '<div><strong>No days set</strong></div>';
    }
    scheduleTable += '</div>';
    return scheduleTable;
}
function populateTable(usersArray, tableBodyId) {
    var currentFirstLetter = '';
    var tableBody = $(tableBodyId);
    tableBody.empty();

    usersArray.sort(function(a, b) {
        return a.name.localeCompare(b.name);
    });

    usersArray.forEach(function(user) {
        var firstLetter = user.name.charAt(0);

        if (firstLetter !== currentFirstLetter) {
            currentFirstLetter = firstLetter;
            tableBody.append(createTableHeader(currentFirstLetter));
        }

        // Determine if the user is archived based on the table we're populating
        var isArchived = tableBodyId === '#archived-table-body';
        var row = createUserRow(user, isArchived);
        tableBody.append(row);
    });
}
