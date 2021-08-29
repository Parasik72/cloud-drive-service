import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFile } from '../../../../actions/file';
import FileLogo from '../../../../assets/img/FileLogo.png'
import FolderLogo from '../../../../assets/img/FolderLogo.png'
import ChangeLogo from '../../../../assets/img/ChangeLogo.png'
import DeleteLogo from '../../../../assets/img/DeleteLogo.png'
import DownloadLogo from '../../../../assets/img/DownloadLogo.png'
import { hideProfileMenu } from '../../../../reducers/appReducer';
import { clearSearch, pushDirStack, setCurrrentDir } from '../../../../reducers/fileReducer';
import styles from './file.module.scss';
import { PopUpRename } from './PopUpRename/PopUpRename';

export const File = ({file}) => {
    const {deleteFile, downloadFile} = useFile();
    const [optionDisplay, setOptionDisplay] = useState(false);
    const [popUpDisplay, setPopUpDisplay] = useState(false);
    const currentDir = useSelector(state => state.files.currentDir);
    const disableDelete = useSelector(state => state.files.disableDelete);
    const dispatch = useDispatch();
    const clickHandler = () => {
        if(file.type === 'dir'){
            dispatch(pushDirStack(currentDir));
            dispatch(setCurrrentDir(file._id));
            dispatch(clearSearch());
        }
    }
    function fileSize(size) {
        if(size === 0)
            return '0 B'
        var i = Math.floor( Math.log(size) / Math.log(1024) );
        return ( size / Math.pow(1024, i) ).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
    };
    const checkName = name => {
        if(name.length >= 30){
            const left = name.slice(0, 13), right = name.slice(-13);
            return left + '...' + right;
        }
        return name;
    }
    const optHandler = e => {
        e.stopPropagation();
        dispatch(hideProfileMenu());
        setOptionDisplay(!optionDisplay);
    }
    const deleteHandler = e => {
        e.stopPropagation();
        if(!disableDelete)
            dispatch(deleteFile(file._id));
    }
    const downloadHandler = e => {
        e.stopPropagation();
        downloadFile(file);
    }
    const renameHandler = e => {
        e.stopPropagation();
        setPopUpDisplay(true);
    }
    return (
        <>
        <div className={styles.file} onClick={() => clickHandler()}>
            <div className={styles.file__opt} onClick={optHandler}><div className={styles.file__options}></div></div>
            <div className={styles.file__logo}><img src={file.type === 'dir' ? FolderLogo : FileLogo} alt="FILELOGO" /></div>
            <div title={file.name} className={styles.file__name}>{checkName(file.name)}</div>
            <div className={styles.file__date}>{!optionDisplay ? new Date(file.date).toLocaleDateString() : file.type !== 'dir' ? <button className={styles.file__btn__download} onClick={downloadHandler}><img width={20} height={20} src={DownloadLogo} alt="DownloadLogo" /></button> : <button className={styles.file__btn__rename} onClick={renameHandler}><img width={20} height={20} src={ChangeLogo} alt="ChangeLogo" /></button>}</div>
            <div className={styles.file__size}>{!optionDisplay ? fileSize(file.size) : <button disabled={disableDelete} className={styles.file__btn__delete} onClick={deleteHandler}><img width={20} height={20} src={DeleteLogo} alt="DeleteLogo" /></button>}</div>
        </div>
        {popUpDisplay && <PopUpRename file={file} setPopUpDisplay={setPopUpDisplay}/>}
        </>
    );
}