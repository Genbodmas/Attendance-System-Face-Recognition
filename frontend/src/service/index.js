const baseUrl = "http://localhost:3000";
const CAMERA_URL = "http://localhost:3000/camera";

export class Apiservice{

    static async getUserData (params){
        try {
            const res = await fetch(baseUrl+"/receive_data", {
                method: "POST",
                body: JSON.stringify(params),
            })
            return res.data
        } catch (error) {
            throw error;
        }
    }

    static async getStudent (params){
        try {
            const res = await fetch(baseUrl+"/get_student", {
                method: "POST",
                body: JSON.stringify(params),
            })
            return res.data
        } catch (error) {
            throw error;
        }
    }

    static async getAttendance (params){
        try {
            const res = await fetch(baseUrl+"/get_attendance_by_date", {
                method: "POST",
                body: JSON.stringify(params)
            })
            return res.data
        } catch (error) {
            throw error;
        }
    }

    static async getLatestEntries (){
        try {
            const res = await fetch(baseUrl+"/get_5_last_entries", {
                method: "GET",
            })
            return res.data
        } catch (error) {
            throw error;
        }
    }

    static async addStudent (params){
        try {
            const res = await fetch(baseUrl+"/add_student", {
                method: "POST",
                body: JSON.stringify(params)
            })
            return res.data
        } catch (error) {
            throw error;
        }
    }

    static async getAllStudents (){
        try {
            const res = await fetch(baseUrl+"/get_student_list", {
                method: "GET",
            })
            return res.data
        } catch (error) {
            throw error;
        }
    }

    static async deleteStudent (params){
        try {
            const res = await fetch(baseUrl+"/delete_student", {
                method: "POST",
                body: JSON.stringify(params),
            })
            return res.data
        } catch (error) {
            throw error;
        }
    }

    static async sendReportViaEmail (params){
        try {
            const res = await fetch(baseUrl+`/send_attendance_email/${params.email}/${params.frequency}`, {
                method: "GET",
            })
            return res.data
        } catch (error) {
            throw error;
        }
    }
}