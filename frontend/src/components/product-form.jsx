import React from 'react';
import {Modal, Button, Alert} from 'react-bootstrap';
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
    mutation addImage($imageFile: Upload!) {
        addImage(imageFile: $imageFile) {
            id
            image
            success
        }
    }
`

const ADD_PRODUCTS = gql`
    mutation addProduct($title: String!, $inputFiles: [ID]!) {
        addProduct(title: $title, inputFiles: $inputFiles) {
            id
            title
            files {
                id
                image
            }
        }
    }
`;


function ProductForm({show, onHide, productRefetch}) {
    const { loading: image_loading, data: image_list, refetch: imageRefetch } = useQuery(IMAGES);
    const [addProduct, { loading, reset }] = useMutation(ADD_PRODUCTS);
    const [uploadImage] = useMutation(UPLOAD_IMAGE);
    const [input_image, setinputImage] = React.useState()
    const [errorMessage, setErrorMessage] = React.useState('')
    const [title, setTitle] = React.useState('')
    const [selected_image, setSelectedImage] = React.useState([])

    const handleChange = (e)=>{
        setTitle(e.target.value)
    }

    const handleSubmit = (e)=>{
        e.preventDefault()
        if(selected_image.length > 0){
            setErrorMessage('')
            addProduct({variables: {title: title, inputFiles: selected_image.map(val => val.id)}})
                .then(resp => {
                    productRefetch()
                    onHide()
                })
                .catch(err => setErrorMessage(err.message))
                .finally(()=>reset())
        } else setErrorMessage('No image has been selected!')
    }

    const handleImageUpload = (e)=>{
        e.preventDefault()
        uploadImage({variables: {imageFile: input_image}})
        .then(resp => {
                imageRefetch()
                e.target.reset()
            })
    }

    const handleSelect = (img_data)=>{
        selected_image.some(val=>val.id===img_data.id)
            ? setSelectedImage(selected_image.filter(val=>val.id!==img_data.id))
            : setSelectedImage(prev => ([img_data, ...prev]))
    }

    const onModalShow = ()=>{
        setTitle('')
        setSelectedImage([])
        setErrorMessage('')
    }


    return(
        <Modal show={show} onHide={onHide} onShow={onModalShow} centered>
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
                    <Alert show={!!errorMessage} variant='danger'>{errorMessage}</Alert>
                    <Button type="submit" disabled={loading}>Add</Button>
                </form>

                <form onSubmit={handleImageUpload}>
                    <div className="d-flex my-3 align-items-center justify-content-center">
                        <input className="form-control form-control-sm" onChange={(e)=>setinputImage(e.target.files[0])} type="file"/>
                        <Button type='submit' className='btn-success' size='sm'>Upload</Button>
                    </div>
                </form>

                {image_loading ? <h5>Loading ...</h5> :
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
