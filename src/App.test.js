import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";

jest.mock("axios", () => ({
  __esModule: true,
  default: {
    get: jest.fn(() => Promise.resolve({ data: { results: [] } })),
  },
}));

test("renders Movie Carousel navigation", async () => {
  render(<App />);
  expect(screen.getAllByText(/Movie Carousel/i).length).toBeGreaterThan(0);
  expect(screen.getByRole("link", { name: /Favourites/i })).toBeInTheDocument();
  await waitFor(() => {
    expect(screen.getByText(/No movies to show/i)).toBeInTheDocument();
  });
});
