import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/appConfig';
import { useForm } from 'react-hook-form';

export default function EditForm() {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

    // useParams captura los parámetros que mandamos en las rutas
    const { id } = useParams();

    const navigate = useNavigate();

    // Montando el producto seleccionado
    useEffect(() => {
        const getProductById = async () => {
            const productDoc = await getDoc(doc(db, "products", id));
            console.log(productDoc);

            // Validamos si el documento existe
            if (productDoc.exists()) {
                const productData = productDoc.data();
                console.log(productData);

                // Mandar la información del producto al formulario
                setValue('name', productData.name);
                setValue('description', productData.description);
                setValue('price', productData.price);
                setValue('image', productData.image);
            } else {
                console.log("No existe el producto");
            }
        }

        getProductById();
    }, [id, setValue]);

    const editProduct = async (data) => {
        try {
            // Actualizamos el producto, seleccionamos el documento por su id
            await updateDoc(doc(db, "products", id), {
                name: data.name,
                description: data.description,
                price: parseFloat(data.price),
                image: data.image
            });
            // Redireccionamos a la lista de productos
            navigate("/productos");
        } catch (error) {
            console.error('Error al actualizar el producto', error);
        }
    }

    return (
        <div className="container-fluid mt-4">
            <h2 className="row justify-content-start">Edit Product</h2>
            <form onSubmit={handleSubmit(editProduct)} className="row border p-4 rounded col-12" style={{ backgroundColor: '#f8f9fa' }}>
                <div className="mb-3 col-6">
                    <label htmlFor="name" className="form-label">Enter Product</label>
                    <input type="text" {...register('name', { required: 'Product name is required' })} className={`form-control ${errors.name ? 'is-invalid' : ''}`} />
                    {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                </div>

                <div className="mb-3 col-12">
                    <label htmlFor="description" className="form-label">Description</label>
                    <input type="text" {...register('description', { required: 'Description is required' })} className={`form-control ${errors.description ? 'is-invalid' : ''}`} />
                    {errors.description && <div className="invalid-feedback">{errors.description.message}</div>}
                </div>

                <div className="mb-3 col-3">
                    <label htmlFor="price" className="form-label">Price</label>
                    <input type="number" {...register('price', { required: 'Price is required' })} className={`form-control ${errors.price ? 'is-invalid' : ''}`} />
                    {errors.price && <div className="invalid-feedback">{errors.price.message}</div>}
                </div>

                <div className="mb-3 col-9">
                    <label htmlFor="image" className="form-label">Image URL</label>
                    <input type="text" {...register('image', { required: 'Image URL is required' })} className={`form-control ${errors.image ? 'is-invalid' : ''}`} />
                    {errors.image && <div className="invalid-feedback">{errors.image.message}</div>}
                </div>

                <div>
                    <button type='submit' className="btn btn-primary">Save Product</button>
                </div>
            </form>
        </div>
    );
}
