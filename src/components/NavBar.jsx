import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

function NavBar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Personal Trainer
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}> 
          <Button color="inherit" component={Link} to="/customers">
            Customers
          </Button>
          <Button color="inherit" component={Link} to="/trainings">
            Trainings
          </Button>
          <Button color="inherit" component={Link} to="/add-customer"> 
            Add Customer
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
