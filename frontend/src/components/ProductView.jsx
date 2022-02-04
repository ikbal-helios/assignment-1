import React from 'react';
import {useQuery, gql} from "@apollo/client";
import {Modal} from "react-bootstrap";
import { base_url } from '../api';



const GET_PRODUCT_INFO = gql`
    query productById($id: ID!){
        productById(id: $id) {
            title
            files{
                id
                image
            }
        }
    }
`;


function ProductView({onShow, onHide, id}) {
    const { loading, error, data } = useQuery(GET_PRODUCT_INFO, {variables: {id}});
    const [selected_image, handleSelect] = React.useState({})

    React.useEffect(()=>{
        const first_image = data?.productById?.files?.[0] || {}
        handleSelect(first_image)
    }, [data])

    return(
        <Modal show={onShow} onHide={onHide} centered>
            {loading ? <h1 className='text-center'>Loading data...</h1> :
                <React.Fragment>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {data?.productById?.title}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        {selected_image?.image &&
                            <div className='d-flex justify-content-center border border-secondary width-100' style={{height: 250}}>
                                <img className='m-auto' src={`${base_url}/media/${selected_image.image}`} style={{maxWidth: '100%', maxHeight: '100%'}} alt="." />
                            </div>
                        }

                        <div className="d-flex flex-wrap mt-2">
                            {data?.productById?.files?.map((img) => 
                                <div key={img.id} className={`btn ${(selected_image.id===img.id) && 'border-danger'}`} onClick={()=>handleSelect(img)}>
                                    <img width={100} src={`${base_url}/media/${img.image}`} alt="." />
                                </div>
                            )}
                        </div>
                    </Modal.Body>
                </React.Fragment>
            }
        </Modal>
    )
}

export default ProductView;
