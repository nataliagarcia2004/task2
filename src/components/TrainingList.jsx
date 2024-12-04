import { useState, useEffect } from 'react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { TextField, Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { format } from 'date-fns';
import { toast } from 'sonner';
import api from '../data/api';
import PropTypes from 'prop-types';

const DeleteConfirmDialog = ({ open, onClose, onConfirm, title, content }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>{content}</DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button onClick={onConfirm} color="error" variant="contained">Delete</Button>
    </DialogActions>
  </Dialog>
);

DeleteConfirmDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};

const TrainingList = () => {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTrainingId, setSelectedTrainingId] = useState(null);

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    try {
      const data = await api.getTrainings();
      setTrainings(data);
    } catch (error) {
      console.error('Error fetching trainings:', error);
      toast.error('Failed to load training sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTraining = async () => {
    if (!selectedTrainingId) return;
    try {
      await api.deleteTraining(selectedTrainingId);
      await fetchTrainings();
      setDeleteDialogOpen(false);
      setSelectedTrainingId(null);
      toast.success('Training session deleted successfully');
    } catch (error) {
      console.error('Error deleting training:', error);
      toast.error('Failed to delete training session');
    }
  };

  const columns = [
    {
      field: 'date',
      headerName: 'Date',
      flex: 1,
      renderCell: (params) => {
        try {
          const date = new Date(params.row.date);
          return format(date, 'dd.MM.yyyy HH:mm');
        } catch {
          return 'Invalid date';
        }
      },
    },
    { field: 'duration', headerName: 'Duration (min)', flex: 1 },
    { field: 'activity', headerName: 'Activity', flex: 1 },
    {
      field: 'customer',
      headerName: 'Customer',
      flex: 1,
      renderCell: (params) => {
        const customer = params.row?.customer;
        if (!customer) return 'N/A';
        return `${customer.firstname} ${customer.lastname}`;
      },
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      flex: 1,
      getActions: (params) => [
        <Tooltip title="Delete training session" arrow key={`delete-${params.row.id}`}>
          <span>
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Delete"
              onClick={() => {
                setSelectedTrainingId(params.row.id);
                setDeleteDialogOpen(true);
              }}
              showInMenu={false}
            />
          </span>
        </Tooltip>,
      ],
    },
  ];

  const filteredTrainings = trainings.filter((training) => {
    const searchStr = searchTerm.toLowerCase();
    return (
      training.activity.toLowerCase().includes(searchStr) ||
      (training.customer && `${training.customer.firstname} ${training.customer.lastname}`.toLowerCase().includes(searchStr))
    );
  });

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Trainings
      </Typography>

      <TextField
        label="Search Trainings"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={filteredTrainings}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.id}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
            sorting: {
              sortModel: [{ field: 'date', sort: 'desc' }],
            },
          }}
          pageSizeOptions={[5, 10, 25]}
          disableRowSelectionOnClick
        />
      </Box>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteTraining}
        title="Delete Training"
        content="Are you sure you want to delete this training session?"
      />
    </Box>
  );
};

TrainingList.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};

export default TrainingList;

