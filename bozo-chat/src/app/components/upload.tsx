import { useState, useEffect } from "react";
import ImageUploading from 'react-images-uploading';

export default function Upload() {

  const [images, setImages] = useState([]);
  const [isSelected, setIsSelected] = useState(true);

  const maxNumber = 5;

  const onChange = (imageList: any, addUpdateIndex: any) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
  };

  return (
    <div>
        <ImageUploading
        multiple
        value={images}
        onChange={onChange}
        maxNumber={maxNumber}
        dataURLKey="data_url"
        >
        {({
            imageList,
            onImageUpload,
            onImageRemoveAll,
            onImageUpdate,
            onImageRemove,
            isDragging,
            dragProps,
        }) => (
            // write your building UI
            <div className="upload__image-wrapper w-full h-full">
            {/* <button onClick={onImageRemoveAll}>Remove all images</button> */}
            {imageList.length > 0 ? imageList.map((image, index) => (
                <div key={index} className="image-item w-full justify-center items-center flex">
                <img src={image['data_url']} alt="" className=" w-[150px] h-[150px] rounded-xl object-center" />
                <div className="image-item__btn-wrapper w-full justify-center gap-[60px] flex">
                    <button onClick={() => onImageUpdate(index)} className=" hover:text-[#5680ce]">Update</button>
                    <button onClick={() => onImageRemove(index)} className=" hover:text-[#5680ce]">Remove</button>
                </div>
                </div>
            )) : <button
                style={isDragging ? { color: 'red' } : undefined}
                onClick={onImageUpload}
                className="bg-[#eee] w-full h-full flex justify-center items-center gap-3 flex-col rounded-xl"
                {...dragProps}
            >
                {/* <FaUpload fontSize={25} /> */}
                Click or Drop here
            </button>}
            </div>
        )}
        </ImageUploading>
    </div>
  );
}