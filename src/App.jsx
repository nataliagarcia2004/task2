import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { Container, TextField } from '@mui/material';
import NavBar from './components/NavBar';
import CustomerList from './components/CustomerList';
import TrainingList from './components/TrainingList';

function App() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Router>
      <NavBar />
      <Container sx={{ marginTop: 4 }}>
        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </Container>
      <Routes>
        <Route path="/customers" element={<CustomerList searchTerm={searchTerm} />} />
        <Route path="/trainings" element={<TrainingList searchTerm={searchTerm} />} />
      </Routes>
    </Router>
  );
}

export default App;
