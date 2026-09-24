import { Stack } from "@mui/material";

const BaseStack = ({
  colour,
  children,
}: {
  colour: string;
  children: React.ReactNode;
}) => (
  <Stack
    direction="row"
    border={`1px solid ${colour}`}
    borderRadius="50px"
    spacing={1}
    padding="5px"
  >
    {children}
  </Stack>
);

export default BaseStack;
