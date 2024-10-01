import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const api = createApi({
	reducerPath: 'jiraApiReducer',
	baseQuery: fetchBaseQuery({
		baseUrl: "https://3676-65-2-63-115.ngrok-free.app/api",
		// baseUrl: "http://localhost:4000/api",
		credentials: 'include',
	}),
	tagTypes: ['Lists', 'Issues', 'Project', 'Members', 'AuthUser', 'Comments'],
	endpoints: (builder) => ({}),
})

export const {} = api
