import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const api = createApi({
	reducerPath: 'jiraApiReducer',
	baseQuery: fetchBaseQuery({
		baseUrl: "http://ec2-65-2-63-115.ap-south-1.compute.amazonaws.com:8080/api",
		// baseUrl: "http://localhost:4000/api",
		credentials: 'include',
	}),
	tagTypes: ['Lists', 'Issues', 'Project', 'Members', 'AuthUser', 'Comments'],
	endpoints: (builder) => ({}),
})

export const {} = api
