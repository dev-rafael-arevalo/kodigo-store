import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase/appConfig';
import toastr from 'toastr';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import 'toastr/build/toastr.min.css';

export default function RegisterProduct() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate(); // Initialize navigate

    const saveProduct = async (data) => {
        const { name, description, price, image } = data;

        try {
            // Create a new FormData object
            const formData = new FormData();
            formData.append('file', image[0]); // Make sure this is defined correctly
            formData.append('upload_preset', 'kodigofsj24a'); // Your upload preset

            // Make the request to Cloudinary
            const response = await axios.post(`https://api.cloudinary.com/v1_1/dsbkl6a44/image/upload`, formData);

            // Get the URL of the uploaded image
            const imageURL = response.data.secure_url;

            // Save the product in Firestore
            await addDoc(collection(db, "products"), {
                name,
                description,
                price: parseFloat(price), // Save price as a number
                image: imageURL, // Save the image URL
            });

            // Success message
            toastr.success('Product saved successfully!');
            
            // Redirect to the root of the site
            navigate('/'); // Redirect to the home page or root
        } catch (error) {
            console.error("Error saving the product:", error);
            // Error message
            toastr.error('Error saving the product. Please try again.');
        }
    };

    useEffect(() => {
        toastr.options = {
            positionClass: 'toast-top-right',
            timeOut: 3000,
            closeButton: true,
            progressBar: true,
        };
    }, []);

    return (
        <div className="container-fluid min-vw-100 mt-4">
            <h2 className='row justify-content-start'>Product Registration</h2>
            <form onSubmit={handleSubmit(saveProduct)} className="mt-3">
                <div className="mb-3 row">
                    <label className="col-sm-2 col-form-label">Product:</label>
                    <div className="col-sm-3">
                        <input
                            type="text"
                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                            {...register('name', { required: true })}
                        />
                        {errors.name && <div className="invalid-feedback">This field is required.</div>}
                    </div>
                </div>

                <div className="mb-3 row">
                    <label className="col-sm-2 col-form-label">Description:</label>
                    <div className="col-sm-3">
                        <input
                            type="text"
                            className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                            {...register('description', { required: true })}
                        />
                        {errors.description && <div className="invalid-feedback">This field is required.</div>}
                    </div>
                </div>

                <div className="mb-3 row">
                    <label className="col-sm-2 col-form-label">Price (USD):</label>
                    <div className="col-sm-3">
                        <input
                            type="number"
                            step="0.01"
                            className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                            {...register('price', { required: true })}
                        />
                        {errors.price && <div className="invalid-feedback">This field is required.</div>}
                    </div>
                </div>

                <div className="mb-3 row">
                    <label className="col-sm-2 col-form-label">Image:</label>
                    <div className="col-sm-3">
                        <input
                            type="file"
                            accept="image/*"
                            className={`form-control ${errors.image ? 'is-invalid' : ''}`}
                            {...register('image', { required: true })}
                        />
                        {errors.image && <div className="invalid-feedback">This field is required.</div>}
                    </div>
                </div>

                <button type="submit" className="btn btn-primary">Save Product</button>
            </form>
        </div>
    );
}
