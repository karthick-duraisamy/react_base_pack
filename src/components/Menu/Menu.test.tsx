import { screen, render } from "@testing-library/react";
import Testwrapper from "../CommonTestWrapper/CommonTestWrapper";
// import { SideBar } from "./Menu";
import MenuBar from "./Menu";
describe("Menu Testing", () => {
  test("renders Menu", async () => {
    render(
      <Testwrapper>
        <MenuBar position={"inline"} />
      </Testwrapper>
    );
    const getMenuData = await screen.findAllByRole("menu");
    expect(getMenuData).not.toHaveLength(0);
    // await waitFor(() => expect(screen.getByText(/Dashboard/i)).toBeInTheDocument());
  });
});
