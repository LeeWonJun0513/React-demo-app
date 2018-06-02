
/**
* React file upload component, compatible with IE8+
  * Modern browsers use AJAX (XHR2+File API) uploads. Low version browsers upload using form+iframe.
  * Use to ES6, need to translate by babel
 */


import React from 'react';
import PT from 'prop-types';

const emptyFunction = function() {};
/* Current IE upload group id*/
let currentIEID = 0;
/*Stores the current IE upload group availability*/
const IEFormGroup = [true];
/* array of current xhr (only xhr after upload has started)*/
let xhrList = [];
let currentXHRID = 0;


class FileUpload extends React.Component{
    constructor(props){
        super(props);
        this.state ={
            chooseBtn: {},       //Select the button. If chooseAndUpload=true represents the selection and upload.
            uploadBtn: {},       //Upload button. It is invalid if chooseAndUpload=true.
            before: [],      // Stores elements in props.children before chooseBtn
            middle: [],      // Stores elements in props.children after chooseBtn and before uploadBtn
            after: []        // Store the elements in props.children after uploadBtn.,
        }
    }


    /* Update components based on props*/
    _updateProps(props) {
        this.isIE = !(this.checkIE() < 0 || this.checkIE() >= 10)
        const options = props.options
        this.baseUrl = options.baseUrl     //domain name
        this.param = options.param     //get parameter
        this.chooseAndUpload = options.chooseAndUpload || false      //Will upload immediately after the user selects the file
        this.paramAddToField = options.paramAddToField || undefined  //The object that needs to be added to FormData. Does not support IE
        /*Upload success returns the format of the resp*/
        this.dataType = 'json'
        options.dataType && (options.dataType.toLowerCase() == 'text') && (this.dataType = 'text')
        this.wrapperDisplay = options.wrapperDisplay || 'inline-block'     //The display of the div wrapping either chooseBtn or uploadBtn
        this.timeout = (typeof options.timeout == 'number' && options.timeout > 0) ? options.timeout : 0     //overtime time
        this.accept = options.accept || ''  //Limit file suffix
        this.multiple = options.multiple || false
        this.numberLimit = options.numberLimit || false //Allow multiple file uploads, limit the number of selected files
        this.fileFieldName = options.fileFieldName || false //When the file is attached to formData, the passed string specifies a file's property name, which is the value of its property. Does not support IE
        this.withCredentials = options.withCredentials || false //Whether to use authentication information across domains
        this.requestHeaders = options.requestHeaders || false //Request header key value pair to set
        /*Life cycle function*/
        /**
         * beforeChoose() : The user chooses to execute before, returns true to continue, false prevents the user from selecting
         * @param  null
         * @return  {boolean} Allow users to choose
         */
        this.beforeChoose = options.beforeChoose || emptyFunction
        /**
         * chooseFile(file) : User-selected file triggered callback function
         * @param file {File | string} Modern browser returns File object, IE returns file name
         * @return
         */
        this.chooseFile = options.chooseFile || emptyFunction
        /**
         * beforeUpload(file,mill) : Performed before the user uploads, returns true, false prevents the user from selecting
         * @param file {File | string} Modern browser returns File object, IE returns file name
         * @param mill {long} The number of milliseconds, if the File object has a number of milliseconds then return the same
         * @return  {boolean || object} Whether to allow users to upload (hack:If obj{
         *     assign:boolean Default is true
         *     param:object
         * }), Then we deal with this param
         */
        this.beforeUpload = options.beforeUpload || emptyFunction
        /**
         * doUpload(file,mill) : Upload action(xhr send | form submit)Upload action...
         * @param file {File | string} Modern browser returns File object, IE returns file name
         * @param mill {long} The number of milliseconds, if the File object has a number of milliseconds then return the same
         * @return
         */
        this.doUpload = options.doUpload || emptyFunction
        /**
         * uploading(progress) : The browser will continue to trigger this function when uploading files. IE uses false triggers triggered every 200ms
         * @param progress {Progress} Progress object, which contains properties such as upload progress and file size total
         * @return
         */
        this.uploading = options.uploading || emptyFunction
        /**
         * uploadSuccess(resp) : Callback executed after successful upload (for AJAX)
         * @param resp {json | string} According to options.dataType specifies the format of the returned data
         * @return
         */
        this.uploadSuccess = options.uploadSuccess || emptyFunction
        /**
         * uploadError(err) : Callback to execute after upload error (for AJAX)
         * @param err {Error | object} If you return a catched error, it has a type and a message attribute
         * @return
         */
        this.uploadError = options.uploadError || emptyFunction
        /**
         * uploadFail(resp) : Callbacks performed after a failed upload (for AJAX)
         * @param resp {string} Failure information
         */
        this.uploadFail = options.uploadFail || emptyFunction
        /**
         * onabort(mill, xhrID) : Actively cancel the response of the xhr process
         * @param mill {long} The number of milliseconds, this upload time
         * @param xhrID {int} The xhr representative ID returned by doUpload
         */
        this.onabort = options.onabort || emptyFunction

        this.files = options.files || this.files || false        //Save the file you need to upload
        /*Special content*/

        /*In the case of IE, because the upload button is hidden by the input, the disabled button cannot be processed.
         * So when disabledIEChoose is true (or func returns true), IE uploads are prohibited.
         */
        this.disabledIEChoose = options.disabledIEChoose || false

        this._withoutFileUpload = options._withoutFileUpload || false      //Without file upload, in order to use the second pass function, does not affect IE
        this.filesToUpload = options.filesToUpload || []       //Use the filesToUpload() method instead
        this.textBeforeFiles = options.textBeforeFiles || false //make this true to add text fields before file data
        /*Use the filesToUpload() method instead*/
        if (this.filesToUpload.length && !this.isIE) {
            this.filesToUpload.forEach( file => {
                this.files = [file]
                this.commonUpload()
            })
        }

        /*Place virtual DOM*/
        let chooseBtn, uploadBtn, flag = 0
        const before = [], middle = [], after = []
        if (this.chooseAndUpload) {
            React.Children.forEach(props.children, (child)=> {
                if (child && child.ref == 'chooseAndUpload') {
                    chooseBtn = child
                    flag++
                } else {
                    flag == 0 ? before.push(child) : flag == 1 ? middle.push(child) : ''
                }
            })
        } else {
            React.Children.forEach(props.children, (child)=> {
                if (child && child.ref == 'chooseBtn') {
                    chooseBtn = child
                    flag++
                } else if (child && child.ref == 'uploadBtn') {
                    uploadBtn = child
                    flag++
                } else {
                    flag == 0 ? before.push(child) : flag == 1 ? middle.push(child) : after.push(child)
                }
            })
        }
        this.setState({
            chooseBtn,
            uploadBtn,
            before,
            middle,
            after
        })
    }

    /*Trigger hidden input box selection*/
    /*Trigger beforeChoose*/
    commonChooseFile() {
        const jud = this.beforeChoose()
        if (jud != true && jud != undefined) return
        this.refs['ajax_upload_file_input'].click()
    }
    /*Modern browser input change event. File API save file*/
    /*Trigger chooseFile*/
    commonChange(e) {
        let files
        e.dataTransfer ? files = e.dataTransfer.files :
            e.target ? files = e.target.files : ''

        /*If you limit the number of files when uploading*/
        const numberLimit = typeof this.numberLimit === 'function' ? this.numberLimit() : this.numberLimit
        if(this.multiple && numberLimit && files.length > numberLimit) {
            const newFiles = {}
            for(let i = 0; i< numberLimit; i++) newFiles[i] = files[i]
            newFiles.length = numberLimit
            files = newFiles
        }
        this.files = files
        this.chooseFile(files)
        this.chooseAndUpload && this.commonUpload()
    }

    /*Perform upload*/
    commonUpload() {
        /*The mill parameter is the current time in milliseconds. When the file is uploaded for the first time, 
        it will be added as a file attribute, or it may be added in beforeUpload. 
        After that, the milliseconds of the same file will not be changed, as the identification id of the file.*/
        const mill = (this.files.length && this.files[0].mill) || (new Date).getTime()
        const jud = this.beforeUpload(this.files, mill)
        if (jud != true && jud != undefined && typeof jud != 'object') {
            /*Clear the input value*/
            this.refs['ajax_upload_file_input'].value = ''
            return
        }



        if (!this.files) return
        if (!this.baseUrl) throw new Error('baseUrl missing in options')

        /*Something used to store the current scope*/
        const scope = {}
        /*Assemble FormData*/
        let formData = new FormData()
        /*If we need to add fields before file data append here*/
        if(this.textBeforeFiles){
            formData = this.appendFieldsToFormData(formData);
        }
        if (!this._withoutFileUpload) {
            const fieldNameType = typeof this.fileFieldName

            /*What is the form of judgment as formdata Item of name*/
            Object.keys(this.files).forEach(key => {
                if(key == 'length') return

                if(fieldNameType == 'function') {
                    const file = this.files[key]
                    const fileFieldName = this.fileFieldName(file)
                    formData.append(fileFieldName, file)
                }else if(fieldNameType == 'string') {
                    const file = this.files[key]
                    formData.append(this.fileFieldName, file)
                }else {
                    const file = this.files[key]
                    formData.append(file.name, file)
                }
            })

        }
        /*If we need to add fields after file data append here*/
        if(!this.textBeforeFiles){
            formData = this.appendFieldsToFormData(formData);
        }
        const baseUrl = this.baseUrl

        /*Url parameter*/
        /*If param is a function*/
        const param = typeof this.param === 'function' ? this.param(this.files) : this.param

        let paramStr = ''

        if (param) {
            const paramArr = []
            param['_'] = mill
            Object.keys(param).forEach(key =>
                paramArr.push(`${key}=${param[key]}`)
            )
            paramStr = '?' + paramArr.join('&')
        }
        const targeturl = baseUrl + paramStr

        /*AJAX upload section*/
        const xhr = new XMLHttpRequest()
        xhr.open('POST', targeturl, true)

        /*Whether to enable authentication information across domains*/
        xhr.withCredentials = this.withCredentials
        /*Do you need to set the request header*/
        const rh = this.requestHeaders
        rh && Object.keys(rh).forEach(key =>
            xhr.setRequestHeader(key, rh[key])
        )

        /*Processing timed out. Use timer to judge timeout, 
        otherwise xhr state=4 catch error can't be judged to be timeout*/
        if(this.timeout) {
            xhr.timeout = this.timeout
            xhr.ontimeout = () => {
                this.uploadError({type: 'TIMEOUTERROR', message: 'timeout'})
                scope.isTimeout = false
            }
            scope.isTimeout = false
            setTimeout(()=>{
                scope.isTimeout = true
            },this.timeout)
        }

        xhr.onreadystatechange = () => {
            /*xhr finish*/
            try {
                if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400) {
                    const resp = this.dataType == 'json' ? JSON.parse(xhr.responseText) : xhr.responseText
                    this.uploadSuccess(resp)
                } else if (xhr.readyState == 4) {
                    /*xhr fail*/
                    const resp = this.dataType == 'json' ? JSON.parse(xhr.responseText) : xhr.responseText
                    this.uploadFail(resp)
                }
            } catch (e) {
                /*Timeout throws a different error and is not handled here*/
                !scope.isTimeout && this.uploadError({type: 'FINISHERROR', message: e.message})
            }
        }
        /*xhr error*/
        xhr.onerror = () => {
            try {
                const resp = this.dataType == 'json' ? JSON.parse(xhr.responseText) : xhr.responseText
                this.uploadError({type: 'XHRERROR', message: resp})
            } catch (e) {
                this.uploadError({type: 'XHRERROR', message: e.message})
            }
        }
        /*Here some browser implementations are inconsistent and IE does not have this method*/
        xhr.onprogress = xhr.upload.onprogress = progress => {
            this.uploading(progress, mill)
        }

        /*Without file upload, use for seconds*/
        this._withoutFileUpload ? xhr.send(null) : xhr.send(formData)

        /*Save xhr id*/
        xhrList.push(xhr)
        const cID = xhrList.length - 1
        currentXHRID = cID

        /*There is a response to abort*/
        xhr.onabort = () => this.onabort(mill, cID)

        /*Trigger Perform an uploaded user callback*/
        this.doUpload(this.files, mill, currentXHRID)

        /*Clear the input value*/
        this.refs['ajax_upload_file_input'].value = ''
    }

    /*Assembling custom objects added to FormData*/
    appendFieldsToFormData(formData){
        const field = typeof this.paramAddToField == 'function' ? this.paramAddToField() : this.paramAddToField
        field &&
        Object.keys(field).map(index=>
            formData.append(index, field[index])
        )
        return formData
    }

    /*Verify before iE selection*/
    /*Trigger beforeChoose*/
    IEBeforeChoose(e) {
        const jud = this.beforeChoose()
        jud != true && jud != undefined && e.preventDefault()
    }
    /*IE requires the user to actually click the upload button, so use the transparent button*/
    /*Trigger chooseFile*/
    IEChooseFile(e) {
        this.fileName = e.target.value.substring(e.target.value.lastIndexOf('\\') + 1)
        this.chooseFile(this.fileName)
        /*First execute IEUpload, configure the action and other parameters, then submit*/
        this.chooseAndUpload && (this.IEUpload() !== false) &&
        document.getElementById(`ajax_upload_file_form_${this.IETag}${currentIEID}`).submit()
        e.target.blur()
    }
    /*IE handles upload function*/
    /*Trigger beforeUpload doUpload*/
    IEUpload(e) {
        const mill = (new Date).getTime()
        const jud = this.beforeUpload(this.fileName, mill)
        if(!this.fileName || (jud != true && jud != undefined) ) {
            e && e.preventDefault()
            return false
        }
        const that = this

        /*Url parameter*/
        const baseUrl = this.baseUrl

        const param = typeof this.param === 'function' ? this.param(this.fileName) : this.param
        let paramStr = ''

        if (param) {
            const paramArr = []
            param['_'] = mill
            param['ie'] === undefined && (param['ie'] = 'true')
            for (const key in param) {
                if(param[key] != undefined) paramArr.push(`${key}=${param[key]}`)
            }
            paramStr = '?' + paramArr.join('&')
        }
        const targeturl = baseUrl + paramStr

        document.getElementById(`ajax_upload_file_form_${this.IETag}${currentIEID}`).setAttribute('action', targeturl)
        /*IE fake upload progress*/
        const getFakeProgress = this.fakeProgress()
        let loaded = 0,
            count = 0

        const progressInterval = setInterval(() => {
            loaded = getFakeProgress(loaded)
            this.uploading({
                loaded,
                total: 100
            },mill)
            /*Prevent permanent execution, set the maximum number of times. Temporarily 30 seconds(200*150)*/
            ++count >= 150 && clearInterval(progressInterval)
        },200)


        /*Current upload id*/
        const partIEID = currentIEID
        /*Callback*/
        window.attachEvent ?
            document.getElementById(`ajax_upload_file_frame_${this.IETag}${partIEID}`).attachEvent('onload', handleOnLoad) :
            document.getElementById(`ajax_upload_file_frame_${this.IETag}${partIEID}`).addEventListener('load', handleOnLoad)


        function handleOnLoad() {
            /*clear progress interval*/
            clearInterval(progressInterval)
            try {
                that.uploadSuccess(that.IECallback(that.dataType, partIEID))
            } catch (e) {
                that.uploadError(e)
            } finally {
                /*Clear the value of the input box*/
                const oInput = document.getElementById(`ajax_upload_hidden_input_${that.IETag}${partIEID}`)
                oInput.outerHTML = oInput.outerHTML
            }
        }
        this.doUpload(this.fileName, mill)
        /*Non-idle*/
        IEFormGroup[currentIEID] = false

    }
    /*IE callback function*/
    //TODO Processing Timeout
    IECallback(dataType, frameId) {
        /*Reply to idle*/
        IEFormGroup[frameId] = true

        const frame = document.getElementById(`ajax_upload_file_frame_${this.IETag}${frameId}`)
        const resp = {}
        const content = frame.contentWindow ? frame.contentWindow.document.body : frame.contentDocument.document.body
        if(!content) throw new Error('Your browser does not support async upload')
        try {
            resp.responseText = content.innerHTML || 'null innerHTML'
            resp.json = JSON ? JSON.parse(resp.responseText) : eval(`(${resp.responseText})`)
        } catch (e) {
            /*If it is included<pre>*/
            if (e.message && e.message.indexOf('Unexpected token') >= 0) {
                /*Contains returned json*/
                if (resp.responseText.indexOf('{') >= 0) {
                    const msg = resp.responseText.substring(resp.responseText.indexOf('{'), resp.responseText.lastIndexOf('}') + 1)
                    return JSON ? JSON.parse(msg) : eval(`(${msg})`)
                }
                return {type: 'FINISHERROR', message: e.message}
            }
            throw e
        }
        return dataType == 'json' ? resp.json : resp.responseText
    }

    /*External call method, active trigger selection file (equivalent to calling btn.click()), only supports modern browsers*/
    forwardChoose() {
        if(this.isIE) return false
        this.commonChooseFile()
    }

    /**
     * External call method, when multiple files are uploaded, use this method to actively delete a file in the list
     * TODO: This method should be able to manipulate the file array
     * @param func The function passed in when the user invokes it. The function receives the parameters files(filesAPI object)
     * @return Obj File API Object
     * File API Obj:
     * {
     *   0 : file,
     *   1 : file,
     *   length : 2
     * }
     */
    fowardRemoveFile(func) {
        this.files = func(this.files)
    }

    /*External call methods, incoming files (File API) 
    objects can immediately perform the upload action, IE does not support. The call then triggers beforeUpload*/
    filesToUpload(files) {
        if(this.isIE) return
        this.files = files
        this.commonUpload()
    }

    /*Call the method externally, cancel an ongoing xhr, specify the xhr for the passed id 
    (returned on doupload) or cancel the most recent one by default.*/
    abort(id) {
        id === undefined ?
            xhrList[currentXHRID].abort() :
            xhrList[id].abort()
    }

    /*Judging ie version*/
    checkIE() {
        const userAgent = this.userAgent;
        const version = userAgent.indexOf('MSIE')
        if (version < 0) return -1

        return parseFloat(userAgent.substring(version + 5, userAgent.indexOf(';', version)))
    }

    /*Generate fake IE upload progress*/
    fakeProgress() {
        let add = 6
        const decrease = 0.3,
            end = 98,
            min = 0.2
        return (lastTime) => {
            let start = lastTime
            if (start >= end) return start

            start += add
            add = add - decrease
            add < min && (add = min)

            return start
        }
    }

    getUserAgent() {
        const userAgentString = this.props.options && this.props.options.userAgent;
        const navigatorIsAvailable = typeof navigator !== 'undefined';
        if (!navigatorIsAvailable && !userAgentString) {
            throw new Error('\`options.userAgent\` must be set rendering react-fileuploader in situations when \`navigator\` is not defined in the global namespace. (on the server, for example)');
        }
        return navigatorIsAvailable ? navigator.userAgent : userAgentString;
    }



    componentWillMount() {
        this.userAgent = this.getUserAgent();
        this.isIE = !(this.checkIE() < 0 || this.checkIE() >= 10)
        /*Because IE needs to use a lot of form groups each time, 
        if more than one <FileUpload> is needed on the same page, 
        you can use the tags in options to distinguish them. 
        And does not change with subsequent props changes*/
        const tag = this.props.options && this.props.options.tag
        this.IETag = tag ? tag+'_' : ''

        this._updateProps(this.props)
    }

    componentDidMount() {
    }

    componentWillReceiveProps(newProps) {
        this._updateProps(newProps)
    }

    render() {
        return this._packRender()
    }


    /*Packaged render function*/
    _packRender() {
        /*IE upload using iframe form, other use ajax Formdata*/
        let render = ''
        if (this.isIE) {
            render = this._multiIEForm()
        } else {
            const restAttrs = {
                accept: this.accept,
                multiple: this.multiple
            }

            render = (
                <div className={this.props.className} style={this.props.style}>
                    {this.state.before}
                    <div onClick={(e) => this.commonChooseFile(e)}
                         style={{overflow:'hidden',postion:'relative',display:this.wrapperDisplay}}
                    >
                        {this.state.chooseBtn}
                    </div>
                    {this.state.middle}

                    <div onClick={(e) => this.commonUpload(e)}
                         style={{
                             overflow: 'hidden',
                             postion: 'relative',
                             display: this.chooseAndUpload ? 'none' : this.wrapperDisplay
                         }}
                    >
                        {this.state.uploadBtn}
                    </div>
                    {this.state.after}
                    <input type="file" name="ajax_upload_file_input" ref="ajax_upload_file_input"
                           style={{display:'none'}} onChange={(e) => this.commonChange(e)}
                           {...restAttrs}
                    />
                </div>
            )
        }
        return render
    }

        /* IE multi-file upload at the same time, the need for multiple forms + multiple form combinations. According to currentIEID represents how many forms. */
        /* All upload groups that are not idle (uploading) are inserted as display:none. The first free upload group will display:block capture. */
    _multiIEForm() {
        const formArr = []
        let hasFree = false

        /* In the case of IE, because the upload button is hidden by the input, the disabled button cannot be processed.
          * So when disabledIEChoose is true (or func returns true), IE uploads are prohibited.
          */
        const isDisabled =
            typeof this.disabledIEChoose === 'function' ? this.disabledIEChoose() : this.disabledIEChoose

       /* The length of the IEFormGroup will change, so you cannot save len*/
        for(let i = 0; i<IEFormGroup.length;  i++) {
            _insertIEForm.call(this,formArr,i)
           /* if the current upload group is free, hasFree=true, and specify the current upload group ID*/
            if(IEFormGroup[i] && !hasFree) {
                hasFree = true
                currentIEID = i
            }
            /* If all upload groups are not idle, push a new group */
            (i==IEFormGroup.length-1) && !hasFree && IEFormGroup.push(true)

        }

        return (
            <div className={this.props.className} style={this.props.style} id="react-file-uploader">
                {formArr}
            </div>
        )

        function _insertIEForm(formArr,i) {
            /* If you have already pushed an idle group and are currently idle group*/
            if(IEFormGroup[i] && hasFree) return
            /* Whether display*/
            const isShow = IEFormGroup[i]
            /*Input inline style*/
            const style = {
                position:'absolute',
                left:'-30px',
                top:0,
                zIndex:'50',
                fontSize:'80px',
                width:'200px',
                opacity:0,
                filter:'alpha(opacity=0)'
            }

            /* Whether to limit the file suffix and whether it is disabled*/
            const restAttrs = {
                accept: this.accept,
                disabled: isDisabled
            }

            const input =
                <input type="file" name={`ajax_upload_hidden_input_${i}`} id={`ajax_upload_hidden_input_${i}`}
                       ref={`ajax_upload_hidden_input_${i}`} onChange={(e) => this.IEChooseFile(e)} onClick={(e) => this.IEBeforeChoose(e)}
                       style={style} {...restAttrs}
                />

            i = `${this.IETag}${i}`
            formArr.push((
                <form id={`ajax_upload_file_form_${i}`} method="post" target={`ajax_upload_file_frame_${i}`}
                      key={`ajax_upload_file_form_${i}`}
                      encType="multipart/form-data" ref={`form_${i}`} onSubmit={(e) => this.IEUpload(e)}
                      style={{display:isShow? 'block':'none'}}
                >
                    {this.state.before}
                    <div style={{overflow:'hidden',position:'relative',display:'inline-block'}}>
                        {this.state.chooseBtn}
                        {/*input file The name cannot be omitted*/}
                        {input}
                    </div>
                    {this.state.middle}
                    <div style={{
                        overflow:'hidden',
                        position:'relative',
                        display:this.chooseAndUpload?'none':this.wrapperDisplay
                    }}
                    >
                        {this.state.uploadBtn}
                        <input type="submit"
                               style={{
                                   position:'absolute',
                                   left:0,
                                   top:0,
                                   fontSize:'50px',
                                   width:'200px',
                                   opacity:0
                               }}
                        />
                    </div>
                    {this.state.after}
                </form>
            ))
            formArr.push((
                <iframe id={`ajax_upload_file_frame_${i}`}
                        name={`ajax_upload_file_frame_${i}`}
                        key={`ajax_upload_file_frame_${i}`}
                        className="ajax_upload_file_frame"
                        style={{
                            display: 'none',
                            width: 0,
                            height: 0,
                            margin: 0,
                            border: 0
                        }}
                >
                </iframe>
            ))
        }
    }

}

FileUpload.propTypes = {
    options: PT.shape({
        /*basics*/
        baseUrl: PT.string.isRequired,
        param: PT.oneOfType([PT.object, PT.func]),
        dataType: PT.string,
        chooseAndUpload: PT.bool,
        paramAddToField: PT.oneOfType([PT.object, PT.func]),
        wrapperDisplay: PT.string,
        timeout: PT.number,
        accept: PT.string,
        multiple: PT.bool,
        numberLimit: PT.oneOfType([PT.number, PT.func]),
        fileFieldName: PT.oneOfType([PT.string, PT.func]),
        withCredentials: PT.bool,
        requestHeaders: PT.object,
        /*specials*/
        tag: PT.string,
        userAgent: PT.string,
        disabledIEChoose: PT.oneOfType([PT.bool, PT.func]),
        _withoutFileUpload: PT.bool,
        filesToUpload: PT.arrayOf(PT.object),
        textBeforeFiles: PT.bool,
        /*funcs*/
        beforeChoose: PT.func,
        chooseFile: PT.func,
        beforeUpload: PT.func,
        doUpload: PT.func,
        uploading: PT.func,
        uploadSuccess: PT.func,
        uploadError: PT.func,
        uploadFail: PT.func,
        onabort: PT.func
    }).isRequired,
    style: PT.object,
    className: PT.string
};

export default FileUpload;




