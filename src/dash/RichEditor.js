import React from 'react'
// 引入编辑器组件
import BraftEditor from 'braft-editor'
// 引入编辑器样式
import 'braft-editor/dist/index.css'

import axios from 'axios'
import env from '../EnvLoader'




export default class EditorDemo extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            // 创建一个空的editorState作为初始值
            editorState: BraftEditor.createEditorState(null)
        }
    }

    saveEditorContent(htmlContent) {
        console.log('save:',htmlContent)
        axios({
            method: 'post',
            url: env.apiServerAddr + '/note/modifyNoteContent',
            data: {note_id:this.props.note.note_id,content:htmlContent},
            config: { headers: {'Content-Type': 'application/json' }}
          }).then((res)=>{ //post success
            if(res.data.success) {
                this.props.snackbarMsgHandler('success')('笔记保存成功！')
            } else {
                this.props.snackbarMsgHandler('error')('笔记保存失败: '+res.data.msg)
            }
          }).catch((err)=>{ //error
            console.log(err);
            this.props.snackbarMsgHandler('success')('笔记保存失败: '+err);
        });
    }


    submitContent = async () => {
        // 在编辑器获得焦点时按下ctrl+s会执行此方法
        // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
        const htmlContent = this.state.editorState.toHTML()
        await this.saveEditorContent(htmlContent)
    }

    handleEditorChange = (editorState) => {
        this.setState({ editorState })
    }

    async componentDidMount () {
        // 假设此处从服务端获取html格式的编辑器内容
        const htmlContent = this.props.note.content;
        // 使用BraftEditor.createEditorState将html字符串转换为编辑器需要的editorStat
        this.setState({
            editorState: BraftEditor.createEditorState(htmlContent),
            note:this.props.note,
        })
    }

    componentWillReceiveProps(){
        this.setState({
            editorState: BraftEditor.createEditorState(this.props.note.content),
            note:this.props.note,
        })
    }

    createValue = ()=>{
        return BraftEditor.createEditorState(this.props.note.content);
    }

    render () {
        const { editorState } = this.state;
        return (
            <div className="my-component">
                <BraftEditor
                    value={editorState}
                    onChange={this.handleEditorChange}
                    onSave={this.submitContent}
                />
                {/*<div>{this.props.note.note_title}</div>*/}
            </div>
        )

    }

}