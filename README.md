# Rota website

<div id="top"></div>

## Table of Contents
<a name="Table-of-Contents"></a>
1. [Introduction](#introduction)
2. [Installation](#installation)
3. [API Documentation](#api-documentation)
    - [Update Assignment Route](#update-assignment-route)
    - [Delete Assignment Route](#delete-assignment-route)
    - [Role List Route](#role-list-route)
    - [Room List Route](#room-list-routee)
    - [Employee List Route](#employee-list-route)
    - [Archived Employee List Route](#archived-employee-list-route)
    - [Archive Employee Route](#archive-route)
    - [Default Hours Route](#default-hours-route)
    - [Absent API Types Route](#absentApiTypes-route)
    - [Create Role Route](#create-role-route)
    - [Delete Role Route](#delete-role-route)
    - [Create Room Route](#create-room-route)
    - [Delete Room Route](#delete-room-route)
    - [Timetable Route](#timetable-route)
    - [Available staff Route](#available-staff-route)



   
4. [Usage](#usage)
5. [Contributing](#contributing)
6. [License](#license)

## Introduction
<a name="introduction"></a>
This application is an Employee Rota website with custom features allowing you to insert new Employees, Rooms and create a custom timetable with flexibility.

## Installation
<a name="installation"></a>
Installation instructions...

# API Documentation
<a name="api-documentation"></a>


# Rota Page API's
<a name="update-assignment-route"></a>
## `/update-assignment` Route

This Flask route is used to either update existing shift assignments or create new ones. It accepts `POST` requests and processes a JSON payload that contains the necessary information to create or update a shift assignment.

### Request Method

- `POST`

### Request Payload

The payload should be a JSON object containing the following fields:

# Update a shift
### Required Fields:
- `shift`: A boolean. If `true`, it indicates that an existing shift should be updated. If `false`, a new shift will be created.
- `UUID`: A string that represents the unique identifier of the employee.
- `room`: A string that represents the room where the shift will take place.
- `dateDetailed`: A string that represents the date for the shift in the format "YYYY-MM-DD" or "YYYY/MM/DD". (This field will be converted into the format "YYYY/MM/DD" inside the function.)

- `start`: A string that represents the start time of the shift in the format "HH:MM".
- `end`: A string that represents the end time of the shift in the format "HH:MM".
- `breakTime`: A string that represents the break time of the shift in the format "HH:MM".
- `shiftId`: A string that represents the unique identifier of the shift.
### Optional:
- `notes`: A string (optional) for additional notes about the employee.

# Create a shift
### Required Fields:
- `shift`: A boolean. If `true`, it indicates that an existing shift should be updated. If `false`, a new shift will be created.
- `UUID`: A string that represents the unique identifier of the employee.
- `room`: A string that represents the room where the shift will take place.
- `dateDetailed`: A string that represents the date for the shift in the format "YYYY-MM-DD" or "YYYY/MM/DD". (This field will be converted into the format "YYYY/MM/DD" inside the function.)
- `shiftId`: A string that represents the unique identifier of the shift.



### Behavior


The function first retrieves the JSON payload using `request.get_json()`. It then modifies the date formats in the payload for compatibility with the underlying system.

If `shift` is `true` in the payload, it attempts to update an existing shift using the `updateShiftDetails()` function. On success, a JSON object is returned with `status` set to 'success', the `message` field containing any error messages, and `assignment` containing the assignment details.

If `shift` is `false`, it attempts to create a new shift using the `AssignmentFields` class. The returned JSON object also includes the `shiftId` of the newly created shift.


[Back to top](#top)
<a name="delete-assignment-route"></a>
## `/delete-assignment` Route

This route is responsible for deleting an existing shift assignment.

**Endpoint:** `/delete-assignment`

**Method:** `POST`

### Request Payload

The API expects the following parameters in the JSON payload of the `POST` request:

- `dateDetailed`: This is a string in the format "YYYY-MM-DD" representing the date of the shift you want to delete.
- `UUID`: A string that represents the unique identifier of the employee.
- `room`: A string that represents the room where the shift will take place.
- `shiftId`: A string that represents the unique identifier of the shift.

### Detailed Behavior

On receiving a `POST` request, the function retrieves the JSON payload using the `request.get_json()` method.

If `dateDetailed` is provided in the payload, it is reformatted by replacing "-" with "/" .
If `shiftId` is provided in the payload, it is converted into an integer.
The `deleteShift()` function is then called with the formatted data to attempt deletion of the specified shift.

### Response

The function returns a JSON object with the following fields:

- `status`: A string that is set to 'success' if the deletion was successful and 'fail' otherwise.
- `message`: A string that contains any error messages returned from the `deleteShift()` function.

Please note that the request payload necessary to delete a shift may need to be extended with additional fields like `UUID` or `shiftId` depending on the implementation of the `deleteShift()` function. The above documentation assumes a minimal payload based on the provided code snippet.
[Back to top](#top)
<a name="role-list-route"></a>
## `/role-list` Route

This Flask route is used to get a list of all roles from the database.

**Endpoint:** `/role-list`

**Method:** `GET`

### Behavior

When a `GET` request is made to this endpoint, it calls the `getRoles()` method of the `db_Manager` class.

### Response

The function returns a JSON array containing strings that represent various roles in the system. 

Example response:

```json
[ "Nurse" , "Receptionist" , "Practitioner" ]
```
[Back to top](#top)
<a name="room-list-route"></a>
## `/room-list` Route

This Flask route is used to get a list of all rooms from the database.

**Endpoint:** `/room-list`

**Method:** `GET`

### Behavior

When a `GET` request is made to this endpoint, it calls the `getRooms()` method of the `db_Manager` class.

There is a room named Absent which works differently to the other rooms. This is labelled as a room to fit on the timetable as a row but is used to display Employees that are Absent.


If required we can hide Absent room from the API
### Response

The function returns a JSON array containing strings that represent various rooms in the system. 

Example response:

```json
[ "Reception 1" , "Reception 2" , "Surgery 1" , "Surgery 2" , "Surgery 3", "Surgery 4" , "Absent" ]
```
[Back to top](#top)
<a name="employee-list-route"></a>
## `/employee-list` Route

This Flask route is used to get a list of all employees from the database.

**Endpoint:** `/employee-list`

**Method:** `GET`

### Behavior

When a `GET` request is made to this endpoint, it calls the `getSqlEmployees()` method which fetches the list of all employees and their details.

### Response

The function returns a JSON array of employee objects. Each object contains the following fields: 

- `"UUID"`: The unique identifier for the employee.
- `"name"`: The name of the employee.
- `"title"`: The title of the employee.
- `"email"`: The email address of the employee.
- `"phone"`: The phone number of the employee.
- `"join_date"`: The date the employee joined.
- `"hourly"`: The hourly rate of the employee.
- `"annual_leave"`: The annual leave allowance of the employee.
- `"Schedule"`: The schedule of the employee.
- `"active"`: A boolean value representing whether the employee is active.
- `"break"`: The break time of the employee. By default, this is set to "01:00" but can be changed.

Example response:

```json
[
  {
    "UUID": "1a2b3c4d",
    "name": "John Doe",
    "title": "Software Engineer",
    "email": "john.doe@example.com",
    "phone": "1234567890",
    "join_date": "2020-01-01",
    "hourly": 30,
    "annual_leave": 10,
    "Schedule": {
      "Monday": {
        "start": "09:00",
        "end": "17:00"
      },
      ...
    },
    "active": true,
    "break": "01:00"
  },
  ...
]
```
[Back to top](#top)
<a name="archived-employee-list-route"></a>
## `/archived-employee-list` Route

This Flask route is used to get a list of all archived employees from the database.

**Endpoint:** `/archived-employee-list`

**Method:** `GET`

### Behavior

When a `GET` request is made to this endpoint, it calls the `getSqlArchivedEmployees()` method which fetches the list of all archived employees and their details.

### Response

The function returns a JSON array of archived employee objects. Each object contains the following fields: 

- `"UUID"`: The unique identifier for the employee.
- `"name"`: The name of the employee.
- `"title"`: The title of the employee.
- `"email"`: The email address of the employee.
- `"phone"`: The phone number of the employee.
- `"join_date"`: The date the employee joined.
- `"hourly"`: The hourly rate of the employee.
- `"annual_leave"`: The annual leave allowance of the employee.
- `"Schedule"`: The schedule of the employee.
- `"active"`: A boolean value representing whether the employee is active. For archived employees, this will be `false`.
- `"break"`: The break time of the employee. By default, this is set to "01:00" but can be changed.

Example response:

```json
[
  {
    "UUID": "1a2b3c4d",
    "name": "John Doe",
    "title": "Software Engineer",
    "email": "john.doe@example.com",
    "phone": "1234567890",
    "join_date": "2020-01-01",
    "hourly": 30,
    "annual_leave": 10,
    "Schedule": {
      "Monday": {
        "start": "09:00",
        "end": "17:00"
      },
      ...
    },
    "active": false,
    "break": "01:00"
  },
  ...
]
```

[Back to top](#top)
<a name="archive-route"></a>
## `/archive` Route
This Flask route is used to archive or activate an employee based on the `archiveType` specified in the request.

**Endpoint:** `/archive`

**HTTP Method:** `POST`

### Request Payload

The API expects a JSON body with the following keys:

- `archiveType` (Boolean): This field will determine the action taken by the API. If `archiveType` is `true`, the API will archive the employee. If `archiveType` is `false`, the API will activate the employee.
- `user` (Object): This field should contain an object with the `UUID` of the employee. The `UUID` is the unique identifier of the employee.

Example of request payload:

```json
{
  "archiveType": true,
  "user": {
    "UUID": "1a064f58-0edf-4e05-9d4c-4c71b8b6fe79"
  }
}
```
[Back to top](#top)
<a name="default-hours-route"></a>
## `/default-hours` Route

This Flask route is used to get the default work hours.

**Endpoint:** `/default-hours`

**Method:** `GET`

### Behavior

When a `GET` request is made to this endpoint, it calls the `get_default_schedule_time()` method of the `db_Manager` class.

### Usage 
This is used when an employee is not scheduled to work on a day but is being assigned for that day on the schedule.

### Response

The function returns a JSON object representing the default schedule time. This object contains `start`, `end`, and `break` time. If these settings are not found in the database, it returns a default schedule of `start` time as "08:15", `end` time as "17:30", and `break` time as "01:00".

[Back to top](#top)
<a name="absentApiTypes-route"></a>
## `/absentApiTypes` Route

This Flask route is used to fetch all absence types available.

**Endpoint:** `/absentApiTypes`

**Method:** `GET`

### Behavior

When a `GET` request is made to this endpoint, it retrieves a dictionary of the `TYPES` variable from the `AbsentApi` class. This variable is a dictionary that maps each type of absence (either "Paid" or "Unpaid") to a list of respective AbsentType instances.

### Response

The function returns a JSON object containing two keys: "Paid" and "Unpaid". Each key corresponds to a list of absence types that fall under that category.

Example response:

```json
{
  "Paid": ["Holiday", "SSP"],
  "Unpaid": ["Sickness", "Appointments", "Dependants", "Overstaffed"]
}
```
[Back to top](#top)
<a name="create-role-route"></a>

## `/create-role` Route
This route is used to create a new role in the system.

**Endpoint:** `/create-role`

**HTTP Method:** `POST`

### Request Payload

The API expects a JSON body with the following key:

- `role` (String): The name of the role you wish to create.

Example of request payload:

```json
{
  "role": "Nurse"
}
```

### Response

The API returns a JSON object containing two keys:

- `status` (String): Indicates the success (`"success"`) or failure (`"fail"`) of the operation.
- `message` (String): Contains a descriptive message about the operation result.

There are several possible response scenarios:

1. If no `role` or an empty string was provided in the request:

```json
{
  "status": "fail",
  "message": "No role was sent."
}
```

2. If the role already exists:

```json
{
  "status": "fail",
  "message": "Role already exists."
}
```

3. If the role creation was successful:

```json
{
  "status": "success",
  "message": "Role created."
}
```

4. If the role creation failed:

```json
{
  "status": "fail",
  "message": "Failed to create role."
}
```

[Back to top](#top)


<a name="delete-role-route"></a>
## `/delete-role` Route

This route is used to delete a role from the system.

**Endpoint:** `/delete-role`

**HTTP Method:** `POST`

### Request Payload

The API expects a JSON body with the following key:

- `role` (String): The name of the role you wish to delete.

Example of request payload:

```json
{
  "role": "Nurse"
}
```

### Response

The API returns a JSON object containing two keys:

- `status` (String): Indicates the success (`"success"`) or failure (`"fail"`) of the operation.
- `message` (String): Contains a descriptive message about the operation result.

There are several possible response scenarios:

1. If no `role` was provided in the request:

```json
{
  "status": "fail",
  "message": "No role was sent."
}
```

2. If the role deletion was successful:

```json
{
  "status": "success",
  "message": "Role deleted."
}
```

3. If the role exists, but could not be deleted:

```json
{
  "status": "fail",
  "message": "Role could not be deleted but it exists."
}
```

4. If an error occurred on the server:

```json
{
  "status": "fail",
  "message": "Error is logged on the server."
}
```

5. If the role does not exist:

```json
{
  "status": "fail",
  "message": "Role does not exist."
}
```
[Back to top](#top)

<a name="create-room-route"></a>
## `/create-room` Route

This route is used to create a new room in the system.

**Endpoint:** `/create-room`

**HTTP Method:** `POST`

### Request Payload

The API expects a JSON body with the following key:

- `room` (String): The name of the room you wish to create.

Example of request payload:

```json
{
  "room": "Room1"
}
```

### Response

The API returns a JSON object containing two keys:

- `status` (String): Indicates the success (`"success"`) or failure (`"fail"`) of the operation.
- `message` (String): Contains a descriptive message about the operation result.

There are several possible response scenarios:

1. If no `room` was provided in the request:

```json
{
  "status": "fail",
  "message": "No room was sent."
}
```

2. If the room creation was successful:

```json
{
  "status": "success",
  "message": "Room created."
}
```

3. If the room exists, but could not be created:

```json
{
  "status": "fail",
  "message": "Room already exists."
}
```

4. If an error occurred on the server:

```json
{
  "status": "fail",
  "message": "Failed to create room. (Error Occurred)"
}
```

5. If the creation of the room failed:

```json
{
  "status": "fail",
  "message": "Failed to create room."
}
```
[Back to top](#top)

<a name="delete-room-route"></a>
## `/delete-room` Route

This route is used to delete a room from the system.

**Endpoint:** `/delete-room`

**HTTP Method:** `POST`

### Request Payload

The API expects a JSON body with the following key:

- `room` (String): The name of the room you wish to delete.

Example of request payload:

```json
{
  "room": "Room1"
}
```

### Response

The API returns a JSON object containing two keys:

- `status` (String): Indicates the success (`"success"`) or failure (`"fail"`) of the operation.
- `message` (String): Contains a descriptive message about the operation result.

There are several possible response scenarios:

1. If no `room` was provided in the request:

```json
{
  "status": "fail",
  "message": "No room was sent."
}
```

2. If the room deletion was successful:

```json
{
  "status": "success",
  "message": "Room deleted."
}
```

3. If the room exists, but could not be deleted:

```json
{
  "status": "fail",
  "message": "Room could not be deleted but it exists."
}
```

4. If an error occurred on the server:

```json
{
  "status": "fail",
  "message": "Error is logged on the server."
}
```

5. If the room does not exist:

```json
{
  "status": "fail",
  "message": "Room does not exist."
}
```
[Back to top](#top)

<a name="timetable-route"></a>
## `/timetable` Route

This route is used to retrieve the timetable for all rooms, including details about each employee's scheduled time, and any absences.

**Endpoint:** `/timetable`

**HTTP Method:** `GET`

### Request

Simply send a `GET` request to the endpoint to retrieve the timetable.

Example of the request URL:

```
/timetable
```

### Response

The API returns a JSON object with rooms as keys. Each room contains date entries, and each date entry contains plan details. If an entry belongs to the "Absent" room, it will have special fields to mark absences and provide absence details.

Example of a standard room in the response:

```json
{
  "Surgery 1": {
    "1st January": {
      "date": "1st January",
      "date_string": "01/01/2023",
      "room": "Room1",
      "employees": {
        "ShiftID1": {
          "UUID": "...",
          "name": "John",
          "title": "Manager",
          ...
        }
      }
    }
  }
}
```

Example of an absent room in the response:

```json
{
   "Absent": {
    "1st January": {
      "date": "1st January",
      "date_string": "01/01/2023",
      "room": "Absent",
      "employees": {
        "ShiftID1": {
          "UUID": "...",
          "name": "John",
          "title": "Manager",
          ...
        }
      }
    }
  },
   
  "Absent": {
    "1st January": {
      "date": "1st January",
      "date_string": "01/01/2023",
      "room": "Absent",
      "employees": {
        "ShiftID1": {
          "UUID": "...",
          "name": "John",
          "title": "Manager",
          ...
        }
      },
      "absent": true,
      "absentData": {
        "ShiftID1": {
          "absentType": "Sick",
          "notes": "Fever",
          "date": "01/01/2023",
          "employeeUUID": "..."
        }
      }
    }
  }   
}
```

### Data Structures

1. **Normal room map**:
   - Key: `Room` : the room name
   - Value: `Timetable map`
   
2. **Timetable map**:
   
   - Key : `DisplayDate`: The weekday & date as a human readable string


- **There are two possible Values**
  - Value: `planMap`
    - This occurs for all rooms by default
    - `date`: YYYY/MM/DD format of the date.
    - `date_string`: Human readable date string.
    - `room`: The room the plan is assigned to.
    - `employees`: a map containing key: { shiftId (int) : `RotaEmployee` }
  - Value : `AbsentPlanMap`
    - This only occurs for the `Absent` room
    - it will contain the default planMap keys and have an additional 2 keys
    - `absent`: boolean always true for `AbsentPlanMap`
    - `absentData`: a map containing : { EMPLOYEE_UUID : `Absence`}


1. `RotaEmployee` : dynamic shift data.
   - When you Insert a shift anywhere **including absent** it will add a new `RotaEmployee` to the `planMap`
     - `start` : "HH:MM" the start time of the shift.
     - `end` : "HH:MM" the end time of the shift.
     - `notes` : The notes for the shift.
     - `break` : "HH:MM" the break duration for the shift.
     - `room` : the shift room location.
     - `shiftId` : the id relevant to the shift. (Unique for every Date & Room combination)

   
2. `Absence` :

   - `absentType`: Type of absence (e.g., Sick, Vacation).
   - `notes`: Additional notes about the absence.
   - `date`: Date of the absence.
   - `employeeUUID`: UUID of the absent employee.

[Back to top](#top)



<a name="available-staff-route"></a>
## `/available-staff` Route

This route is used to retrieve a list of staff that are timetabled as available for the current month.

**Endpoint:** `/available-staff`

**HTTP Method:** `GET`

### Request

Simply send a `GET` request to the endpoint without any parameters to retrieve the available staff for the current month.

Example of the request URL:

```
/available-staff
```

### Response

The API returns a JSON object for the month containing the available staff. Each entry in the JSON object is keyed by a date string and the associated value is a list of employee objects. Each employee object consists of **static** details like their schedule for the week, UUID, active status, annual leave, break time, email, hourly wage, join date, name, phone, and title.

Example of a response:

```json
{
  "1st January": [
    {
      "Schedule": {
        "Monday": { ... },
        ...
      },
      "UUID": "...",
      ...
      "title": "nurse"
    },
    ...
  ]
  ...
}
```

If no staff is timetabled as available for the current month:

```json
{}
```



[Back to top](#top)


## Usage
<a name="usage"></a>
How to use the project...

## Contributing
<a name="contributing"></a>
Contributing guidelines...

## License
<a name="license"></a>
License information...