import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db, auth_user } from '../firebase/appConfig';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

export default function ListProducts() {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(db, "products"),
            (snapshot) => {
                const array_products = snapshot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id,
                }));

                setProducts(array_products);
            },
            (error) => {
                console.error("Error getting products:", error);
                setProducts([]);
            }
        );

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const unsubscribe = auth_user.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    const deleteProduct = async (id) => {
        try {
            const result = await Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!",
            });

            if (result.isConfirmed) {
                await deleteDoc(doc(db, "products", id));
                toastr.success('Product deleted successfully!');
            }
        } catch (error) {
            console.error("Error deleting a product", error);
            toastr.error('An error occurred while deleting the product.');
        }
    };

    const openModal = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    return (
        <div className="container-fluid mt-5">
            <h2 className="row justify-content-lg-start">Kodigo Store</h2>
            <h6 className="row justify-content-lg-start bg bg-primary p-2 text-white">A non ordinary stuff inspired by Minecraft game</h6>
            <div className="row" style={{ overflowY: 'auto', maxHeight: '80vh' }}>
                {products.length > 0 ? (
                    products.map((product) => (
                        <div key={product.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                            <div className="card text-center" style={{ backgroundColor: '#e6e6e6', borderRadius: '10px', height: '100%' }}>
                                <img
                                    src={product.image}
                                    className="card-img-top"
                                    alt={product.name}
                                    style={{ borderRadius: '10px 10px 0 0', height: '200px', objectFit: 'cover', cursor: 'pointer' }}
                                    onClick={() => openModal(product)}
                                />
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">{product.name}</h5>
                                    <p className="card-text" style={{
                                        display: '-webkit-box',
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        WebkitLineClamp: 3 // Muestra aproximadamente 3 líneas
                                    }}>
                                        {product.description}
                                    </p>
                                    <p className="card-text"><strong>Price: ${product.price.toFixed(2)}</strong></p>
                                    <div className="mt-auto">
                                        {user ? (
                                            <>
                                                <Link to={`/editar/${product.id}`} className="btn btn-warning me-2">Edit</Link>
                                                <button className="btn btn-danger" onClick={() => deleteProduct(product.id)}>Delete</button>
                                            </>
                                        ) : (
                                            <button className="btn btn-primary">Buy</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No products available at the moment</p>
                )}
            </div>
    
            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>{selectedProduct?.name}</h2>
                        <img src={selectedProduct?.image} alt={selectedProduct?.name} className="img-fluid mb-3" />
                        <p>{selectedProduct?.description}</p>
                        <p><strong>Price: ${selectedProduct?.price.toFixed(2)}</strong></p>
                        <button onClick={closeModal} className="btn btn-secondary">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}    