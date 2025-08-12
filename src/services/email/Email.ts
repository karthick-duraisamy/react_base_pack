import { EmailService } from "../Services";

const service = EmailService.enhanceEndpoints({
  addTagTypes: ["emailApi"],
}).injectEndpoints({
  endpoints: (build) => ({
    sendEmail: build.mutation<any, any[]>({
      query: (data) => {
        return { method: "POST", url: "trigger_servicev3/", body: data };
      },
    }),
  }),
});

export const { useSendEmailMutation } = service;
