import { Navbar } from "@diamondlightsource/sci-react-ui";

export const Sidebar = () => {
  return (
    <>
      <Navbar />
      {["12345.nxs", "12346.nxs", "12347.nxs"].map((filename) => (
        <p key={filename}>{filename}</p>
      ))}
    </>
  );
};
