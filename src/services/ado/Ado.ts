import { ApiResponse } from "../ServiceTypes";
import { AdoService } from "../Services";

const service = AdoService.enhanceEndpoints({
  addTagTypes: ["ado"],
}).injectEndpoints({
  endpoints: (build) => ({
    getAncillaries: build.query<ApiResponse<any>, void>({
      query: () => ({
        url: "/addAncillaries/",
        method: "GET",
      }),
      providesTags: ["ado"],
    }),
    retrieveAncillary: build.query<ApiResponse<any>, string | number>({
      query: (id) => ({
        url: `/addAncillaries/id=${id}/`,
        method: "GET",
      }),
      providesTags: ["ado"],
    }),
    postAncillary: build.mutation<ApiResponse<any>, { ancillary: any }>({
      query: ({ ancillary }) => ({
        url: "/addAncillaries/",
        method: "POST",
        body: ancillary,
      }),
      invalidatesTags: ["ado"],
    }),
    putAncillary: build.mutation<ApiResponse<any>, { id: string | number; putData: any }>({
      query: ({ id, putData }) => ({
        url: `/addAncillaries/${id}/.`,
        method: "PUT",
        body: putData,
      }),
      invalidatesTags: ["ado"],
    }),
    deleteAncillary: build.mutation<ApiResponse<any>, string | number>({
      query: (id) => ({
        url: `/addAncillaries/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["ado"],
    }),
    getBundles: build.query<ApiResponse<any>, void>({
      query: () => ({
        url: "/createBundle/",
        method: "GET",
      }),
      providesTags: ["ado"],
    }),
    retrieveBundle: build.query<ApiResponse<any>, string | number>({
      query: (id) => ({
        url: `/createBundle/${id}/`,
        method: "GET",
      }),
      providesTags: ["ado"],
    }),
    postBundle: build.mutation<ApiResponse<any>, { bundle: any }>({
      query: ({ bundle }) => ({
        url: "/createBundle/",
        method: "POST",
        body: bundle,
      }),
      invalidatesTags: ["ado"],
    }),
    putBundle: build.mutation<ApiResponse<any>, { id: string | number; putData: any }>({
      query: ({ id, putData }) => ({
        url: `/createBundle/${id}/`,
        method: "PUT",
        body: putData,
      }),
      invalidatesTags: ["ado"],
    }),
    deleteBundle: build.mutation<ApiResponse<any>, string | number>({
      query: (id) => ({
        url: `/createBundle/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["ado"],
    }),
    getPolicies: build.query<ApiResponse<any>, void>({
      query: () => ({
        url: "/policies/",
        method: "GET",
      }),
      providesTags: ["ado"],
    }),
    retrievePolicy: build.query<ApiResponse<any>, string | number>({
      query: (id) => ({
        url: `/policies/${id}/`,
        method: "GET",
      }),
      providesTags: ["ado"],
    }),
    postPolicy: build.mutation<ApiResponse<any>, { policy: any }>({
      query: ({ policy }) => ({
        url: "/policies/",
        method: "POST",
        body: policy,
      }),
      invalidatesTags: ["ado"],
    }),
    putPolicy: build.mutation<ApiResponse<any>, { id: string | number; putData: any }>({
      query: ({ id, putData }) => ({
        url: `/policies/${id}/`,
        method: "PUT",
        body: putData,
      }),
      invalidatesTags: ["ado"],
    }),
    deletePolicy: build.mutation<ApiResponse<any>, string | number>({
      query: (id) => ({
        url: `/policies/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["ado"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useLazyGetAncillariesQuery,
  useLazyRetrieveAncillaryQuery,
  usePutPolicyMutation,
  usePutAncillaryMutation,
  usePutBundleMutation,
  useLazyGetPoliciesQuery,
  useLazyGetBundlesQuery,
  usePostAncillaryMutation,
  usePostBundleMutation,
  usePostPolicyMutation,
  useDeleteAncillaryMutation,
  useDeleteBundleMutation,
  useDeletePolicyMutation,
  useLazyRetrieveBundleQuery,
  useLazyRetrievePolicyQuery,
} = service;
