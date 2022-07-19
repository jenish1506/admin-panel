import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import * as yup from "yup";
import { Formik, Form, useFormik } from "formik";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import Container from "@mui/material/Container";
import SearchIcon from "@mui/icons-material/Search";

const Medicine = () => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [dOpen, setDOpen] = useState(false);
  const [did, setDid] = useState("");
  const [update, setUpdate] = useState(false);
  const [selectionModel, setSelectionModel] = useState([]);
  const [deleteAll, setDeleteAll] = useState(false);
  const [filterData, setFilterData] = useState([]);

  const loadData = () => {
    let localData = JSON.parse(localStorage.getItem("medicine"));
    if (localData !== null) {
      setData(localData);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClickDOpen = () => {
    setDOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDOpen(false);
    resetForm();
    setUpdate(false);
    setDeleteAll(false);
  };

  const handleInsert = (values) => {
    let localData = JSON.parse(localStorage.getItem("medicine"));

    let data = { id: new Date().getTime().toString(), ...values };

    if (localData) {
      localData.push(data);
      localStorage.setItem("medicine", JSON.stringify(localData));
    } else {
      localStorage.setItem("medicine", JSON.stringify([data]));
    }

    loadData();
    handleClose();
  };

  const handleDelete = () => {
    let localData = JSON.parse(localStorage.getItem("medicine"));

    let fData;
    if (deleteAll) {
      fData = localData.filter((v) => !selectionModel.includes(v.id));
    } else {
      fData = localData.filter((v) => v.id !== did);
    }

    localStorage.setItem("medicine", JSON.stringify(fData));

    loadData();
    handleClose();
  };

  const handleEdit = (params) => {
    handleClickOpen();
    setValues(params.row);
    setUpdate(true);
  };

  const handleUpdate = (values) => {
    let localData = JSON.parse(localStorage.getItem("medicine"));

    const updateData = localData.map((v) => {
      if (v.id === values.id) {
        return values;
      } else {
        return v;
      }
    });

    localStorage.setItem("medicine", JSON.stringify(updateData));

    loadData();
    handleClose();
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 183,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "name",
      headerName: "Medicine Name",
      width: 183,
      headerAlign: "center",
    },
    {
      field: "quantity",
      headerName: "Quantity",
      width: 183,
      headerAlign: "center",
      align: "right",
    },
    {
      field: "price",
      headerName: "Price (₹)",
      width: 183,
      headerAlign: "center",
      align: "right",
    },
    {
      field: "expiry",
      headerName: "Expiry Date",
      width: 183,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "action",
      headerName: "Action",
      width: 183,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Stack direction="row" spacing={3}>
          <IconButton
            aria-label="edit"
            onClick={() => {
              handleEdit(params);
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label="delete"
            onClick={() => {
              handleClickDOpen();
              setDid(params.id);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
      ),
    },
  ];

  let schema = yup.object().shape({
    name: yup.string().required("Please Enter Name"),
    quantity: yup
      .number()
      .required("Please Enter Quantity")
      .positive("Quantity must be a positive number")
      .integer("Quantity must be an Integer")
      .typeError("Quantity must be a number"),
    price: yup
      .number()
      .required("Please Enter Price")
      .positive("Price must be a positive number")
      .typeError("Price must be a number"),
    expiry: yup.number().required("Please Select Expiry Date"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      quantity: "",
      price: "",
      expiry: "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      if (update) {
        handleUpdate(values);
      } else {
        handleInsert(values);
      }
    },
  });

  const {
    errors,
    touched,
    handleSubmit,
    handleBlur,
    handleChange,
    values,
    resetForm,
    setValues,
  } = formik;

  const handleSearch = (val) => {
    let localData = JSON.parse(localStorage.getItem("medicine"));

    let sData = localData.filter((s) => {
      return (
        s.name.toLowerCase().includes(val.toLowerCase()) ||
        s.price.toString().includes(val) ||
        s.quantity.toString().includes(val) ||
        s.expiry.toString().includes(val)
      );
    });
    setFilterData(sData);
  };

  const finalData = filterData.length > 0 ? filterData : data;

  return (
    <>
      <Container maxWidth="lg">
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleClickOpen}
          >
            Add Medicine
          </Button>
          <Button
            disabled={selectionModel.length === 0}
            variant="outlined"
            color="error"
            onClick={() => {
              handleClickDOpen();
              setDeleteAll(true);
            }}
          >
            Delete
          </Button>
        </Stack>
        <TextField
          sx={{ mb: 3 }}
          fullWidth
          id="search"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          variant="outlined"
          onChange={(e) => handleSearch(e.target.value)}
        />
        <Box sx={{ height: 579 }}>
          <DataGrid
            rows={finalData}
            columns={columns}
            pageSize={9}
            rowsPerPageOptions={[9]}
            checkboxSelection
            onSelectionModelChange={(newSelectionModel) => {
              setSelectionModel(newSelectionModel);
            }}
            selectionModel={selectionModel}
            {...data}
          />
        </Box>
        <Dialog open={open} onClose={handleClose} fullWidth>
          {update ? (
            <DialogTitle>Update Medicine</DialogTitle>
          ) : (
            <DialogTitle>Add Medicine</DialogTitle>
          )}
          <Formik values={formik}>
            <Form onSubmit={handleSubmit}>
              <DialogContent>
                <TextField
                  error={errors.name && touched.name}
                  margin="dense"
                  id="name"
                  label={errors.name && touched.name ? errors.name : "Name"}
                  onChange={handleChange}
                  value={values.name}
                  onBlur={handleBlur}
                  name="name"
                  fullWidth
                />
                <TextField
                  error={errors.quantity && touched.quantity}
                  margin="dense"
                  id="quantity"
                  label={
                    errors.quantity && touched.quantity
                      ? errors.quantity
                      : "Quantity"
                  }
                  onChange={handleChange}
                  value={values.quantity}
                  onBlur={handleBlur}
                  name="quantity"
                  fullWidth
                />
                <TextField
                  error={errors.price && touched.price}
                  margin="dense"
                  id="price"
                  label={errors.price && touched.price ? errors.price : "Price"}
                  onChange={handleChange}
                  value={values.price}
                  onBlur={handleBlur}
                  name="price"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
                  }}
                  fullWidth
                />
                <FormControl
                  error={errors.expiry && touched.expiry}
                  margin="dense"
                  fullWidth
                >
                  <InputLabel id="expiry-date">
                    {errors.expiry && touched.expiry
                      ? "Please Select Expiry Date"
                      : "Expiry Date"}
                  </InputLabel>
                  <Select
                    labelId="expiry-date"
                    onChange={handleChange}
                    value={values.expiry}
                    onBlur={handleBlur}
                    id="expiry"
                    name="expiry"
                    label={
                      errors.expiry && touched.expiry
                        ? errors.expiry
                        : "Expiry Date"
                    }
                  >
                    <MenuItem value={2022}>2022</MenuItem>
                    <MenuItem value={2023}>2023</MenuItem>
                    <MenuItem value={2024}>2024</MenuItem>
                    <MenuItem value={2025}>2025</MenuItem>
                  </Select>
                </FormControl>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                {update ? (
                  <Button type="submit">Update</Button>
                ) : (
                  <Button type="submit">Submit</Button>
                )}
              </DialogActions>
            </Form>
          </Formik>
        </Dialog>
        <Dialog
          open={dOpen}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {deleteAll
              ? "Are you sure to Delete Selected Rows?"
              : "Are you sure to Delete?"}
          </DialogTitle>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button variant="contained" onClick={handleDelete} autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default Medicine;
