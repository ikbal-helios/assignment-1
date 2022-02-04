import React from 'react';
import {useQuery, gql, useMutation} from "@apollo/client";
import {base_url} from '../api';
import ProductForm from '../components/product-form';
import ProductView from '../components/ProductView';



const GET_PRODUCTS = gql`
    query {
        productsByUser {
            id
            title
            files {
                id
                image
            }
        }
    }
`;

const DELETE_PRODUCT = gql`
    mutation deleteProduct($id: ID!) {
        deleteProduct(id: $id)
        {
            success
        }
    }
`


function Products() {
    const [product_modal, setProductModal] = React.useState(false)
    const [view_id, setViewID] = React.useState('')
    const { loading, data, refetch: productRefetch } = useQuery(GET_PRODUCTS);
    const [deleteProduct] = useMutation(DELETE_PRODUCT);

    const handleDelete = (id)=>{
        deleteProduct({variables: {id: id}})
        productRefetch()
    }

    const handleViewProduct = (id)=>{
        setViewID(id)
    }


    return(
        <div className='mt-4'>
            <div className="d-flex justify-content-between">
                <h3>Products</h3>
                <button type="button" className="btn btn-primary btn-sm" onClick={()=>setProductModal(true)}>
                    Add Product
                </button>
                <ProductForm show={product_modal} onHide={()=>setProductModal(false)} productRefetch={productRefetch}/>
            </div>
            {loading ? <h4 className='text-center'>Getting products...</h4> : 
                <div className="row row-cols-1 row-cols-md-4 g-4 mt-3">
                    {data.productsByUser.map((product, idx)=>(
                        <div key={idx} className="col">
                            <div className="card shadow-lg">
                                <img height={150} src={`${base_url}/media/${product.files?.[0]?.image}`} className="card-img-top" alt=""/>
                                <div className="card-body">
                                    <h5 className="card-title">{product.title}</h5>
                                </div>
                                <div className="card-footer d-flex justify-content-around">
                                    <button className='btn btn-secondary btn-sm' onClick={()=>handleViewProduct(product.id)}>View</button>
                                    <button onClick={()=>handleDelete(product.id)} className='btn btn-danger btn-sm'>Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            }
            {!!view_id &&
                <ProductView onShow={!!view_id} onHide={()=>handleViewProduct('')} id={view_id}/>
            }
        </div>
    )
}

export default Products;
