import React from 'react';
import {Modal, Button} from 'react-bootstrap';
import {gql, useMutation, useQuery} from "@apollo/client";
import { base_url } from '../api';


const IMAGES = gql`
    query {
        images {
            id
            image
        }
    }
`

const UPLOAD_IMAGE = gql`
    mutation addImage($image: Upload!) {
        addImage(image: $image) {
            id
            image
            success
        }
    }
`

const ADD_PRODUCTS = gql`
    mutation addProduct($title: String!, $image: Upload!) {
        addProduct(title: $title, image: $image)
        {
            id
            title
            success
        }
    }
`;


function ProductForm({show, onHide}) {
    const { loading: image_loading, data: image_list } = useQuery(IMAGES);
    const [addProduct, { data, loading, error }] = useMutation(ADD_PRODUCTS);
    const [uploadImage] = useMutation(UPLOAD_IMAGE);
    const [input_image, setinputImage] = React.useState()
    const [inputs, setInputs] = React.useState({})
    const [selected_image, setSelectedImage] = React.useState([])

    const handleChange = (e)=>{
        const name = e.target.name
        setInputs(prev => ({
            ...prev,
            [name]: name !== 'image' ? e.target.value : e.target.files?.[0]
        }))
    }

    const handleSubmit = (e)=>{
        console.log(inputs)
        e.preventDefault()
        addProduct({variables: {...inputs}})
    }

    const handleImageUpload = ()=>{
        uploadImage({variables: {image: input_image}})
    }

    const handleSelect = (img_data)=>{
        selected_image.some(val=>val.id===img_data.id)
            ? setSelectedImage(selected_image.filter(val=>val.id!==img_data.id))
            : setSelectedImage(prev => ([img_data, ...prev]))
    }


    return(
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    Add new Product
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form noValidate onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Product Title</label>
                        <input type="text" name='title' className="form-control" onChange={handleChange}/>
                    </div>
                    <Button type="submit" disabled={loading}>Add</Button>
                </form>

                <div className="d-flex my-3 align-items-center justify-content-center">
                    <input className="form-control form-control-sm" onChange={(e)=>setinputImage(e.target.files[0])} type="file"/>
                    <Button className='btn-success' size='sm' onClick={handleImageUpload}>Upload</Button>
                </div>

                {image_loading?<h5>Loading ...</h5>:
                    <div className="d-flex flex-wrap mt-2">
                        {image_list.images?.map((img) => 
                            <div key={img.id} className={`btn ${selected_image.some(val=>val.id===img.id) && 'border-danger'}`} onClick={()=>handleSelect(img)}>
                                <img width={100} src={`${base_url}/media/${img.image}`} alt="." />
                            </div>
                        )}
                    </div>
                }

            </Modal.Body>
        </Modal>
    )
}

export default ProductForm;
