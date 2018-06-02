
import React from 'react';
import FileUpload from './react-fileupload.jsx';

class FileUploader extends React.Component{

    render(){
        /*set properties*/
        const options={
            baseUrl:'/manage/product/upload.do',
            fileFieldName:'upload_file',
            dataType:'json',
            chooseAndUpload:true,
            uploadSuccess:(res) => {this.props.onSuccess(res.data)},
            uploadError:(err) => {this.props.onError(err.message || 'Error uploading pictures')}
        }

        return (
            <FileUpload options={options}>
                <button className="btn btn-xs btn-default" ref="chooseAndUpload">Please select a picture</button>
            </FileUpload>
        )
    }
}

export default FileUploader;