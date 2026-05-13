import {
  Card,
  CardActionArea,
  CardContent,
  Container,
  Divider,
  Grid2,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

type AppCardProps = {
  name: string;
  desc: string;
  linkTarget: string;
};

const AppCard = ({ name, desc, linkTarget }: AppCardProps) => {
  return (
    <Card variant="outlined" sx={{ margin: 2 }}>
      <CardActionArea component={Link} to={linkTarget}>
        <CardContent sx={{ margin: 2 }}>
          <Typography gutterBottom variant="h5">
            {name}
          </Typography>
          <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
          <Typography variant="body2">{desc}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

const Dashboard: React.FC = () => {
  return (
    <>
      <Container>
        <Typography fontSize={30} display="flex" justifyContent="center">
          ImagingHub
        </Typography>
        <Grid2 display="flex">
          <AppCard
            name="Tomography"
            desc="Web app for HTTomo"
            linkTarget="tomography"
          />
          <AppCard name="I14" desc="I14 workflow submission" linkTarget="i14" />
        </Grid2>
      </Container>
    </>
  );
};

export default Dashboard;
