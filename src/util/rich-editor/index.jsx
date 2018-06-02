


import React from 'react';
import Simditor from 'simditor';

import 'simditor/styles/simditor.scss';
import './index.scss';

// Generic rich text editor, relying on jQuery
class RichEditor extends React.Component{
    constructor(props){
        super(props);
    }
    componentDidMount(){
        this.loadEditor();
    }
    componentWillReceiveProps(nextProps){
        if(this.props.defaultDetail !== nextProps.defaultDetail){
            this.simditor.setValue(nextProps.defaultDetail);
        }
    }
    loadEditor(){
        let element = this.refs['textarea'];
        this.simditor = new Simditor({
            textarea:$(element),
            defaultValue:this.props.placeholder || 'Please enter content',
            upload:{
                url:'/manage/product/richtext_img_upload.do',
                defaultImage:'',
                fileKey:'upload_file'
            }
        });
        this.bindEditorEvent();

    }
    // Initialize rich text editor events
    bindEditorEvent(){
        this.simditor.on('valuechanged', e => {
            this.props.onValueChange(this.simditor.getValue());
        })
    }
    render(){
        return(
            <div className="rich-editor">
                <textarea ref="textarea"></textarea>
            </div>
        );
    }
}

export default RichEditor;