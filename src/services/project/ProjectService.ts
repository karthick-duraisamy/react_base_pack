// Importing necessary types and services
import { ApiResponse } from "../ServiceTypes";
import { ProjectService } from "@/services/Services";

// Enhancing ProjectService with additional endpoints
const service = ProjectService.injectEndpoints({
    endpoints: (build) => ({
        postProjectData: build.mutation<ApiResponse<any>, { data: any }>({
            query: ({ data }) => ({
                url: "/",
                method: "POST",
                body: data
            })
        }),
        getProjectData: build.query<ApiResponse<any>, void>({
            query: () => ({
                url: "/",
                method: "GET"
            })
        }),
        putProjectData: build.mutation<ApiResponse<any>, { projectName: string, serverName: string, putData: any }>({
            query: ({ projectName, serverName, putData }) => ({
                url: "/" + projectName + "/" + serverName + "/",
                method: "POST",
                body: putData
            })
        }),
        deleteProject: build.mutation<ApiResponse<any>, void>({
            query: (serverName) => ({
                url: `/`,
                method: "DELETE",
                body: serverName
            })
        }),

        getProjectServerData: build.query<ApiResponse<any>, { projectName: string, serverName: string }>({
            query: ({ projectName, serverName }) => ({
                url: "/" + projectName + "/" + serverName + "/",
                method: "GET"
            })
        }),
        postProjectServerData: build.mutation<ApiResponse<any>, { projectName: string, serverName: string, data: any }>({
            query: ({ projectName, serverName, data }) => ({
                url: "/" + projectName + "/" + serverName + "/",
                method: "POST",
                servers: data
            })
        }),

        postServiceData: build.mutation<ApiResponse<any>, { projectName: string, serverName: string, postData: { service:string; data:any; }}>({
            query: ({ projectName, serverName, postData }) => ({
                url: "/" + projectName + "/" + serverName + "/",
                // url: "/RM/local/",
                method: "POST",
                body: postData
            })
        }),
    }),
    overrideExisting: true, // Ensures existing endpoints are overridden if needed
});

// Exporting hooks for each mutation to be used in functional components
export const {
    usePostProjectDataMutation,
    useLazyGetProjectDataQuery,
    useDeleteProjectMutation,
    usePutProjectDataMutation,
    useLazyGetProjectServerDataQuery,
    usePostServiceDataMutation
} = service;
