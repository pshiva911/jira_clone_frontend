import axios from 'axios'

const axiosDf = axios.create({
	// baseURL: 'https://jira-clone.onrender.com/',
	baseURL: "http://ec2-65-2-63-115.ap-south-1.compute.amazonaws.com/:8080/",
	// baseURL: "http://localhost:4000/",
	withCredentials: true,
})

export default axiosDf
