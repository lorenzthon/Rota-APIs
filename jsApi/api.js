class API {
    constructor(baseURL = 'http://localhost:5000') {
        this.baseURL = baseURL;
        this.headers = new Headers({
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': true
        });
    }

    async createAndEditEmployee(employee_payload) {
        const response = await fetch(`${this.baseURL}/update-employee`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(employee_payload),
        });
        // (response.Valid === true) Successfully created/updated Employee
        // (response.Valid === false) Failed to created/updated employee
        return response.json();
    }

    async archiveEmployee(UUID, archive) {
        const response = await fetch(`${this.baseURL}/archive`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({ UUID: UUID, archiveType: archive })
        });

        return response.json();
    }

    async getEmployees() {
        const response = await fetch(`${this.baseURL}/employee-list`, {
            method: 'GET',
            headers: this.headers,
        });
        return response.json();
    }

    async getArchivedEmployees() {
        const response = await fetch(`${this.baseURL}/archived-employee-list`, {
            method: 'GET',
            headers: this.headers,
        });
        return response.json();
    }

    async getRoles() {
        const response = await fetch(`${this.baseURL}/role-list`, {
            method: 'GET',
            headers: this.headers,
        });
        return response.json();
    }






}


