import axios from 'axios'

const axiosDf = axios.create({
	baseURL: "https://3676-65-2-63-115.ngrok-free.app/",
	// baseURL: "http://localhost:4000/",
	withCredentials: true,
})

export default axiosDf
