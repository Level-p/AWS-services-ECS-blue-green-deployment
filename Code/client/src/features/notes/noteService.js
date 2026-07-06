import axios from "axios";

// const API_URL = 'https://support-ticket-backend-03qy.onrender.com/api/tickets/'
const API_URL = '/api/tickets/'

// Get  ticket notes
const getAllNotes = async (ticketId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.get(API_URL + ticketId + '/notes', config)

    return response.data
}

// Create  ticket notes
const createNote = async (noteText, ticketId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.post(API_URL + ticketId + '/notes', {text:  noteText}, config)

    return response.data
}

const noteService = {
    getAllNotes,
    createNote
}

export default noteService