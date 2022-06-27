import React, { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import * as yup from 'yup';
import { useFormik, Formik, Form } from 'formik';
import InputAdornment from '@mui/material/InputAdornment';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

const Medicine = () => {
    const [open, setOpen] = useState(false);
    const [medicine, setMedicine] = useState(() => {
        let localData = localStorage.getItem("medicine");

        if (localData) {
            return JSON.parse(localData)
        } else {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('medicine', JSON.stringify(medicine))
    }, [medicine])

    const columns = [
        { field: 'id', headerName: 'ID', width: '180' },
        { field: 'name', headerName: 'Name', width: '180' },
        { field: 'quantity', headerName: 'Quantity', width: '180' },
        { field: 'price', headerName: 'Price (₹)', width: '180' },
        { field: 'expiry', headerName: 'Expiry Date', width: '180' },
    ];

    const rows = medicine.map((v, i) => {
        return ({ id: i + 1, name: v.name, quantity: v.quantity, price: v.price, expiry: v.expiry })
    })

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        handleReset();
    };

    let schema = yup.object().shape({
        name: yup.string().required("Please Enter Name"),
        quantity: yup.number().required("Please Enter Quantity").positive("Quantity must be a positive number").integer("Quantity must be an Integer").typeError("Quantity must be a number"),
        price: yup.number().required("Please Enter Price").positive("Price must be a positive number").typeError("Price must be a number"),
        expiry: yup.number().required("Please Select Expiry Date").positive().integer(),
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            quantity: '',
            price: '',
            expiry: '',
        },
        validationSchema: schema,
        onSubmit: (values) => {
            handleClose();
            setMedicine([...medicine, values])
        },
    });

    const { errors, touched, handleSubmit, handleBlur, handleChange, values, handleReset } = formik

    return (
        <>
            <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    checkboxSelection
                />
            </Box>
            <Stack spacing={2} direction="row" sx={{ justifyContent: 'center', m: 3 }}>
                <Button variant="contained" onClick={handleClickOpen}>Add Medicine</Button>
                <Button variant="outlined" color="error">Delete Medicine</Button>
            </Stack>
            <Dialog open={open} onClose={handleClose} fullWidth>
                <DialogTitle>Add Medicine</DialogTitle>
                <Formik values={formik}>
                    <Form onSubmit={handleSubmit}>
                        <DialogContent>
                            <TextField
                                error={errors.name && touched.name}
                                margin="dense"
                                id="name"
                                label={errors.name && touched.name ? errors.name : 'Name'}
                                onChange={handleChange}
                                value={values.name}
                                onBlur={handleBlur}
                                name='name'
                                fullWidth
                            />
                            <TextField
                                error={errors.quantity && touched.quantity}
                                margin="dense"
                                id="quantity"
                                label={errors.quantity && touched.quantity ? errors.quantity : 'Quantity'}
                                onChange={handleChange}
                                value={values.quantity}
                                onBlur={handleBlur}
                                name='quantity'
                                fullWidth
                            />
                            <TextField
                                error={errors.price && touched.price}
                                margin="dense"
                                id="price"
                                label={errors.price && touched.price ? errors.price : 'Price'}
                                onChange={handleChange}
                                value={values.price}
                                onBlur={handleBlur}
                                name='price'
                                InputProps={{ endAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                                fullWidth
                            />
                            <FormControl
                                error={errors.expiry && touched.expiry}
                                margin="dense"
                                fullWidth
                            >
                                <InputLabel id="expiry-date">
                                    {errors.expiry && touched.expiry ? 'Please Select Expiry Date' : 'Expiry Date'}
                                </InputLabel>
                                <Select
                                    labelId="expiry-date"
                                    onChange={handleChange}
                                    value={values.expiry}
                                    onBlur={handleBlur}
                                    id='expiry'
                                    name='expiry'
                                    label={errors.expiry && touched.expiry ? errors.expiry : 'Expiry Date'}
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
                            <Button type='submit'>Submit</Button>
                        </DialogActions>
                    </Form>
                </Formik>
            </Dialog>
        </>
    )
}

export default Medicine