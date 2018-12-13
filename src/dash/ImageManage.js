import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import request from 'superagent';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import env from '../EnvLoader'
import axios from 'axios';
import ImagePreviewCard from './ImagePreviewCard';

const styles = theme => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing.unit * 2,
    },
    paper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    card: {
        margin: '10px',
        display: 'block',
        maxWidth: '100%',
        maxHeight: '100%',
    },
    media: {
        height: 140,
    },
    input: {
        display: 'none',
    },
    button: {
        margin: theme.spacing.unit,
    },
});

class ImageManage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dialogOpen:false,
            images:[],
        };
    }

    componentWillMount() {
        this.syncImages();
    }

    syncImages = ()=>{
        axios({
            method: 'post',
            url: env.apiServerAddr + '/image/allMyImage'
        }).then((res)=>{ //post success
            var data = res.data;
            console.log(data)
            if(data.success) {
                var data = data.data;
                this.setState({images:data});
            } else 
                this.props.snackbarMsgHandler('error')('同步图片列表失败: '+data.msg);
        }).catch((err)=>{ //error
            console.log(err);
            this.props.snackbarMsgHandler('error')('同步图片列表失败: '+err);
        });
    }

    deleteImage = (image_id)=>{
        axios({
            method: 'post',
            data:{image_id:image_id},
            url: env.apiServerAddr + '/image/deleteImage'
        }).then((res)=>{ //post success
            var data = res.data;
            console.log(data)
            if(data.success) {
                this.syncImages();
                this.props.snackbarMsgHandler('success')('删除图片成功');
            } else 
                this.props.snackbarMsgHandler('error')('删除图片失败: '+data.msg);
        }).catch((err)=>{ //error
            console.log(err);
            this.props.snackbarMsgHandler('error')('删除图片失败: '+err);
        });
    }

    render() {
        const { classes } = this.props;
        const images = this.state.images;

        return (
            <div className={classes.root}>
                <Grid container spacing={24}>
                <Button 
                    component="span" 
                    className={classes.button}
                    onClick={this.openUploadDialog.bind(this)} >
                    上传图片
                </Button>
                </Grid>

                <ImageUploadDialog 
                    open={this.state.dialogOpen} 
                    classes={classes}
                    openUploadDialog={this.openUploadDialog.bind(this)}
                    closeUploadDialog={this.closeUploadDialog.bind(this)}
                    snackbarMsgHandler={this.props.snackbarMsgHandler.bind(this)}
                    syncImages={this.syncImages.bind(this)}
                    closeDialog={this.closeUploadDialog.bind(this)}
                />
                <Grid container spacing={24}>
                    {images.reverse().map((image,index)=>(
                        <ImagePreviewCard image={image} key={image.image_id} deleteImage={this.deleteImage.bind(this)}/>
                    ))}

                </Grid>
            </div>
        );
    }

    openUploadDialog = ()=>{
        this.setState({dialogOpen:true});
    }

    closeUploadDialog = ()=>{
        this.setState({dialogOpen:false});
    }

}


export default withStyles(styles)(ImageManage);


class ImageUploadDialog extends React.Component {

    handleUpload = ()=>{ 
        let formData = new FormData();
        let input = document.getElementById('file-select');
        let file = input.files[0];
        formData.append('img',file);
        request
            .post(env.apiServerAddr+'/image/uploadImage')
            .send(formData)
            .end((err,res)=>{
                var data = res.body;
                if(err) {
                    //console.log(err);
                    this.props.snackbarMsgHandler('error')('上传图片失败: '+err);
                } else {
                    if(data.success) {
                        this.props.snackbarMsgHandler('success')('上传图片成功！');
                        this.props.syncImages();
                        this.props.closeDialog();
                    } else    
                        this.props.snackbarMsgHandler('error')('上传图片失败: '+data.msg);
                }
            });
    }
    
    render() {
        const {classes} = this.props;
    
        return (
            <Dialog
              open={this.props.open}
              onClose={this.props.handleClose}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">上传图片</DialogTitle>
              <DialogContent>
                <DialogContentText>上传图片并获得连接</DialogContentText>
                
                <input
                    accept="image/*"
                    className={classes.input}
                    id="file-select"
                    multiple
                    type="file"
                />
                <label htmlFor="file-select">
                    <Button component="span" className={classes.button }>
                    选择文件
                    </Button>
                </label>
    
                <Button 
                    variant="contained" 
                    color="primary" 
                    className={classes.button}
                    onClick={this.handleUpload.bind(this)}
                >
                    上传
                </Button>
            
              </DialogContent>
              <DialogActions>
                <Button onClick={this.props.closeUploadDialog.bind(this)} color="primary">
                  关闭
                </Button>
              </DialogActions>
            </Dialog>
        );
    }

}