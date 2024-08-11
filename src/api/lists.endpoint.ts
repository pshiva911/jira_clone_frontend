import { api } from './api';
import { List, ReorderList } from './apiTypes';

export const extendedApi = api.injectEndpoints({
  endpoints: (builder) => ({
    lists: builder.query<List[], number>({
      query: (projectId) => ({
        url: `project/${projectId}/lists`,
        credentials: 'include',
      }),
      providesTags: ['Lists'],
    }),
    reorderLists: builder.mutation<void, ReorderList>({
      query: (body) => ({
        url: 'list/reorder',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Lists'],
      async onQueryStarted({ order, newOrder, projectId }, { dispatch, queryFulfilled }) {
        const result = dispatch(
          extendedApi.util.updateQueryData('lists', projectId, (oldLists) =>
            updateListOrderLocally(oldLists, { s: order - 1, d: newOrder - 1 })
          )
        );
      },
    }),
  }),
  overrideExisting: false,
});

export const { useListsQuery, useReorderListsMutation } = extendedApi;

// selector
export const selectLists = (projectId: number) =>
  extendedApi.useListsQuery(projectId, { selectFromResult: ({ data }) => ({ lists: data }) });

// helpers
function updateListOrderLocally(array: List[], { s, d }: { s: number; d: number }) {
  const source = array.slice(0);
  const draggedIssue = source.splice(s, 1)[0]; // remove dragged item from its source list
  source.splice(d, 0, draggedIssue); // insert dragged item into target list
  return source;
}
