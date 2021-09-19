// React
import { useState } from 'react'

// AuthHoc
import AuthHoc from '../../hoc/authHoc'


// filestack
import * as filestack from 'filestack-js'

// Product Model
import Product from '../../models/product'


// validator
import validator from '../../utils/validator'

// react hot toast
import { toast, Toaster } from 'react-hot-toast'

// nanoid
import { customAlphabet } from 'nanoid'

// useRouter
import {useRouter} from 'next/router'




// init client
const client = filestack.init('AiW2ZzsYdQkaGyXsBvkSUz')



// init nanoid
const nanoid = customAlphabet('1234567890', 10)








// init createAds component
const CreateAds = ({authUser}) => {

    // init router
    const router = useRouter()


    // init imageFiles
    const [imageFiles, setImageFiles] = useState([])

    // init title state 
    const [title, setTitle] = useState("")

    // init price state 
    const [price, setPrice] = useState("")

    // init category state 
    const [category, setCategory] = useState("")

    // init description
    const [description, setDescription] = useState("")

    // init youtube link state 
    const [youtubeLink, setYoutubeLink] = useState("")



    // init handleOpenWidget func
    const handleOpenWidget = () => {

        // init options
        const options = {
            maxFiles: 3,
            uploadInBackground: false,
            accept: ['image/*'],
            onOpen: () => console.log('opened!'),
            onUploadDone: (res) => {
                console.log("RESPONSE", res.filesUploaded)

                // update imageFiles state
                setImageFiles(res.filesUploaded)
            }
        };

        // open file picker
        client.picker(options).open()
    }




    // init handleSubmit func
    const handleSubmit = async() => {

        // init productData
        const productData = {
            _id: nanoid(),
            title: title,
            images: imageFiles,
            youtubeLink: youtubeLink,
            description: description,
            price: price,
            category: category,
            userId: authUser._id,
            status: "pending",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }


        // validate product data
        const error = validator.createAds(productData)


        // if error
        if(error) {
            return toast.error(error)
        }

        // create product
        const response = await Product.createProduct(productData)


        // check if errors
        if(!response.result.ok) {
            console.log(response)
            return toast.error("Oops! Error, cannot submit Ad")
        }

        //show success message
        toast.success("Ad created successfully")

        
        // reload page 
        return router.reload()

    }


    return (
        <>
        <Toaster/>
            <section className="pt-5">
                <div className="container">
                    <div className="row">
                        <h1 className="mb-3 fs-3">Create Ads</h1>

                        <form>
                            {/* title */}
                            <div className="mb-4">
                                <input type="text" value={title} onChange={(event) => setTitle(event.target.value)} className="form-control" id="title" placeholder="Title" />
                            </div>

                            {/* price */}
                            <div className="mb-4">
                                <input type="number" value={price} onChange={(event) => setPrice(event.target.value)} className="form-control" id="price" placeholder="Price" />
                            </div>

                            {/* description*/}
                            <div className="mb-4">
                                <textarea type="text" value={description} onChange={(event) => setDescription(event.target.value)} cols="5" rows="5" className="form-control" id="description" placeholder="Description" />
                            </div>

                            {/* category */}
                            <div className="mb-4">
                                <select onChange={(event) => setCategory(event.target.value)} className="form-select" aria-label="Default select example">
                                    <option value="">Select Category</option>
                                    <option value="farm_machinery">Farm Machinery &amp; Equipments</option>
                                    <option value="feeds_supplements_seeds">Feeds, Supplements &amp; Seeds</option>
                                    <option value="livestock_poultry">Live Stock &amp; Poultry</option>
                                    <option value="drinks">Drinks</option>
                                </select>
                            </div>


                            {/* Youtube link */}
                            <div className="mb-4">
                                <input type="text" value={youtubeLink} onChange={(event) => setYoutubeLink(event.target.value)} className="form-control" id="title" placeholder="Youtube Video Link (optional)" />
                                <small>If you have a video of your product, you can upload to youtube and paste the link here.</small>
                            </div>


                            {/* image  */}
                            <div className="mb-4 d-grid gap-2">
                                {imageFiles.length > 0 ? <button type="button" onClick={() => handleOpenWidget()} className="btn btn-outline-secondary p-3 upload-image-btn">{`${imageFiles.length} ${imageFiles.length === 1 ? `image` : `images`} uploaded successfully`}</button> :
                                    <button type="button" onClick={() => handleOpenWidget()} className="btn btn-outline-secondary p-3 upload-image-btn">Upload Images of your Product</button>
                                }

                                <small>Note: You can only upload maximum of 3 images</small>
                            </div>



                            <button onClick={() => handleSubmit()} type="button" className="btn btn-primary">Submit</button>
                        </form>


                    </div>
                </div>
            </section>

        </>
    )
}

export default AuthHoc(CreateAds)
