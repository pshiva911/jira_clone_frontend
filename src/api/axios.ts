import axios from 'axios'

const axiosDf = axios.create({
	baseURL: "https://jiramini.site:8080/",
	// baseURL: "http://localhost:4000/",
	withCredentials: true,
})

export default axiosDf
