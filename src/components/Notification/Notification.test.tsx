import { render, screen } from "@testing-library/react";
import { Notification } from "./Notification";
import Testwrapper from "@/components/CommonTestWrapper/CommonTestWrapper";

describe("renders Notification", () => {
  test("it should mount", () => {
    render(
      <Testwrapper>
        <Notification />
      </Testwrapper>
    );

    expect(screen.getByTestId("Notification")).toBeInTheDocument();
  });
});
