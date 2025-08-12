import { ApiResponse } from "../ServiceTypes";
import { RescheduleService } from "../Services";
import { IQueueList } from "./QueueTypes";
const service = RescheduleService.enhanceEndpoints({
  addTagTypes: ["queue"],
}).injectEndpoints({
  endpoints: (build) => ({
    // Get the Queue List
    getQueue: build.query<ApiResponse<IQueueList>, {}>({
      query: (params: { pageNumber: number | string }) => ({
        url: `/queue/?nolimit=Y&page=${params?.pageNumber}`,
        method: "GET",
      }),
      providesTags: ["queue"],
    }),

    // Get the Queue List depends on selected ID
    getEditQueue: build.query<ApiResponse<any>, { queue_id: string | number }>({
      query: ({ queue_id }) => `/queue/${queue_id}/`,
    }),

    // Get masterInfo data for popoup filter
    getQueueMasterInfo: build.query<ApiResponse<IQueueList>, {}>({
      query: () => ({ url: "/queue/masterInfo/", method: "GET" }),
      providesTags: ["queue"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useLazyGetQueueQuery,
  useLazyGetEditQueueQuery,
  useLazyGetQueueMasterInfoQuery,
} = service;
