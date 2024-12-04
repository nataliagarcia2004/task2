import { useState, useEffect } from 'react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { TextField, Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import api from '../data/api';
import PropTypes from 'prop-types';
import { toast } from 'sonner';



const defaultFormData = {
  firstname: '',
  lastname: '',
  email: '',
  phone: '',
  streetaddress: '',
  postcode: '',
  city: '',
};


const CustomerDialog = ({ open, onClose, onSave, customer, title }) => {
  const [formData, setFormData] = useState(defaultFormData);

 
  useEffect(() => {
    setFormData(customer || defaultFormData);
  }, [customer, open]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField name="firstname" label="First Name" value={formData.firstname} onChange={handleChange} required />
            <TextField name="lastname" label="Last Name" value={formData.lastname} onChange={handleChange} required />
            <TextField name="email" label="Email" type="email" value={formData.email} onChange={handleChange} required />
            <TextField name="phone" label="Phone" value={formData.phone} onChange={handleChange} required />
            <TextField name="streetaddress" label="Street Address" value={formData.streetaddress} onChange={handleChange} required />
            <TextField name="postcode" label="Postcode" value={formData.postcode} onChange={handleChange} required />
            <TextField name="city" label="City" value={formData.city} onChange={handleChange} required />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">Save</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};


CustomerDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  customer: PropTypes.object,
  title: PropTypes.string.isRequired,
};

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


const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [customerDialogOpen, setCustomerDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedCustomerUrl, setSelectedCustomerUrl] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const customers = await api.getCustomers();
      setCustomers(customers);
    } catch (error) {
      toast.error('Failed to fetch customers');
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

 
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCustomers = customers.filter((customer) => {
    const searchStr = searchTerm.toLowerCase();
    return (
      customer.firstname.toLowerCase().includes(searchStr) ||
      customer.lastname.toLowerCase().includes(searchStr) ||
      customer.email.toLowerCase().includes(searchStr) ||
      customer.city.toLowerCase().includes(searchStr)
    );
  });

  
  const handleAddCustomer = async (customer) => {
    try {
      await api.addCustomer(customer);
      setCustomers([...customers, customer]);
      setCustomerDialogOpen(false);
    } catch (error) {
      console.error('Failed to add customer:', error);
    }
  };

  
  const handleEditCustomer = async (customer) => {
    try {
      await api.updateCustomer(selectedCustomerUrl, customer);
      setCustomers(customers.map((c) => (c.id === customer.id ? customer : c)));
      setCustomerDialogOpen(false);
      setSelectedCustomer(null);
    } catch (error) {
      console.error('Failed to edit customer:', error);
    }
  };

  
  const handleDeleteCustomer = async () => {
    try {
      await api.deleteCustomer(selectedCustomerUrl);
      setCustomers(customers.filter((c) => c.id !== selectedCustomer.id));
      setDeleteDialogOpen(false);
      setSelectedCustomerUrl('');
    } catch (error) {
      console.error('Failed to delete customer:', error);
    }
  };

  
  const columns = [
    { field: 'firstname', headerName: 'First Name', flex: 1 },
    { field: 'lastname', headerName: 'Last Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'phone', headerName: 'Phone', flex: 1 },
    { field: 'streetaddress', headerName: 'Address', flex: 1 },
    { field: 'postcode', headerName: 'Postcode', flex: 1 },
    { field: 'city', headerName: 'City', flex: 1 },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      flex: 1,
      getActions: (params) => [
        <Tooltip title="Edit customer" arrow key={`edit-${params.row.id}`}>
          <span>
            <GridActionsCellItem
              icon={<EditIcon />}
              label="Edit"
              onClick={() => {
                setSelectedCustomer(params.row);
                setIsEditing(true);
                setCustomerDialogOpen(true);
              }}
            />
          </span>
        </Tooltip>,
        <Tooltip title="Delete customer" arrow key={`delete-${params.row.id}`}>
          <span>
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Delete"
              onClick={() => {
                setSelectedCustomerUrl(params.row._links.self.href);
                setDeleteDialogOpen(true);
              }}
            />
          </span>
        </Tooltip>,
      ],
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Customers</Typography>

      <TextField
        label="Search Customers"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={handleSearch}
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setIsEditing(false);
            setSelectedCustomer(null);
            setCustomerDialogOpen(true);
          }}
        >
          Add Customer
        </Button>
      </Box>

      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={filteredCustomers}
          columns={columns}
          loading={loading}
          pageSize={5}
          pageSizeOptions={[5, 10, 25]}
          disableRowSelectionOnClick
        />
      </Box>

      <CustomerDialog
        open={customerDialogOpen}
        onClose={() => setCustomerDialogOpen(false)}
        onSave={isEditing ? handleEditCustomer : handleAddCustomer}
        customer={selectedCustomer}
        title={isEditing ? 'Edit Customer' : 'Add Customer'}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteCustomer}
        title="Delete Customer"
        content="Are you sure you want to delete this customer? This will also delete all associated trainings."
      />
    </Box>
  );
};

export default CustomerList;
