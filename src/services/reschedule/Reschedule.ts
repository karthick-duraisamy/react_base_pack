// import { ApiResponse } from "../ServiceTypes";
import { ChatBotSerice, CommonService } from "../Services";
import {
  AvailableFlight,
  // IPnrListRequest,
  // IPnrListResponse,
} from "./RescheduleTypes";

const LocalJsonService = ChatBotSerice.enhanceEndpoints({}).injectEndpoints({
  endpoints: (build) => ({
    getAttentionData: build.mutation<any[], {}>({
      query: () => "staticResponse/AttentionData.json"
    }),
    getBarChartData: build.mutation<any[], {}>({
      query: () => "staticResponse/BarChartData.json"
    }),
    getDashboardAdhocData: build.mutation<any[], {}>({
      query: () => "staticResponse/DashboardAdhoc.json"
    }),
    getDashboardPaxData: build.mutation<any[], {}>({
      query: () => "staticResponse/DashboardPax.json"
    }),
    getLineChartData: build.mutation<any[], {}>({
      query: () => "staticResponse/LineChartData.json"
    }),
    getNotificationData: build.mutation<any[], {}>({
      query: () => "staticResponse/NotificationData.json"
    }),
    getTurnAroundTimeData: build.mutation<any[], {}>({
      query: () => "staticResponse/TurnAroundTimeData.json"
    }),
  }),
  overrideExisting: true, // Ensures existing endpoints are overridden if needed
});


const service = CommonService.enhanceEndpoints({
  addTagTypes: ["reschedule"],
}).injectEndpoints({
  endpoints: (build) => ({
    postDataService: build.mutation({
      query: (body) => ({
        url: "",
        method: "PUT",
        body
      }),
    }),
    // getPnrsList: build.query<ApiResponse<IPnrListResponse[]>, IPnrListRequest>({
    //   query: (param) => ({ method: "GET", url: `preplannedPNRs`, params: param }),
    //   providesTags: ["reschedule"],
    // }),
    

    
    
    getSampleMailerData: build.mutation<any[], {}>({
      query: () => "SampleMailerData/"
    }),

    
    getRecentAction: build.mutation<any[], {}>({
      query: () => "recent_data/"
    }),
    getUpcomingEvent: build.mutation<any[], {}>({
      query: () => "upcomingevent/"
    }),
    getChartData: build.mutation<any[], {}>({
      query: (userType) => ({
        url: "db_chart",
        method: "GET",
        params: userType
      })
    }),
    getFlightSchedule: build.mutation<any[], {}>({
      query: () => "disruption_data/"
    }),
    getPnrDetail: build.mutation<any[], {}>({
      query: () => "pnr_history_data/"
    }),
    getFlightSearchResponse: build.mutation<any[], {}>({
      query: () => "searchFlightList/"
    }),
    getAvailableFlight: build.mutation<AvailableFlight[], {}>({
      query: () => "availableFlights/"
    }),
    getSyncQueue: build.mutation<any[], {}>({
      query: () => "syncQueue/"
    }),
    getUsersList: build.mutation<any[], {}>({
      query: () => "usersList/"
    }),
    getCreateScoreData: build.mutation<any[], {}>({
      query: () => "createScore/"
    }),
    getScoreList: build.mutation<any[], {}>({
      query: () => "scoreListOld/"
    }),
    // getAdhocFlightList: build.mutation<PnrHistoryData[], {}>({
    //   query: () => "adhocFlightList",
    // }),
    // getPreplannedPnrList: build.mutation<any[], {}>({
    //   query: () => "preplannedPNRList",
    // }),
  }),
  overrideExisting: true,
});

export const {
  usePostDataServiceMutation,
  // useLazyGetPnrsListQuery, // Gets PNR Data From PlanB Submission Using Param
  useGetSyncQueueMutation, // Gets Sync Flights/PNR Data Using Param
  useGetRecentActionMutation,
  useGetUpcomingEventMutation,
  
  useGetSampleMailerDataMutation,
  useGetFlightSearchResponseMutation,
  useGetFlightScheduleMutation, //rescheduled flight list
  useGetPnrDetailMutation, //single pnr detail
  useGetChartDataMutation,
  useGetAvailableFlightMutation,
   // Dashboard JSONs
  
  
  
  
  useGetUsersListMutation, // Gets User List Table Data
  useGetCreateScoreDataMutation, // Gets Create Score Data
  useGetScoreListMutation, // Gets Score List Table Data
  // useGetAdhocFlightListMutation, // Gets Adhoc Flight List Table Data
  // useGetPreplannedPnrListMutation, // Gets Pre-planned list table data
} = service;

export const {
  useGetAttentionDataMutation,
  useGetNotificationDataMutation,
  useGetTurnAroundTimeDataMutation,
  useGetBarChartDataMutation,
  useGetDashboardAdhocDataMutation,
  useGetDashboardPaxDataMutation,
  useGetLineChartDataMutation

} = LocalJsonService;
