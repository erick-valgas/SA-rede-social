import { FormComponent, StyleForm } from '../../../styles/components';
import { useModalContext } from '../../../context/modal.context';
import { getUserLocalStorage } from '../../../auth/util';
import { useAuth } from '../../../auth/useAuth';
import TextField from '@mui/material/TextField';
import { Box, Button } from '@mui/material';
import Modal from '@mui/material/Modal';
import http from '../../../api/api';
import {useState} from 'react'
import './style.scss';
export default function ModalPost(){
    const modalContext = useModalContext();
    const [inputs, setInputs] = useState({
        content: ''
    });
    const [files, setFiles] = useState<File | null>(null)
    const {token} = useAuth();
    const user = getUserLocalStorage()
    const VerifyImages = (e : React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files?.length){
            setFiles(e.target.files[0]);
        }
        else{
            setFiles(null)
        }
    }
    async function SubmitForm(e: any){
        e.preventDefault();
        const formData = new FormData;
        formData.append('content', inputs.content);
        formData.append('autor', user._id)
        if(user?.email){
            formData.append('email', user.email)
        }
        if(token){
            formData.append('token', token)
        }
        if(files){
            formData.append('file', files)
        }
        http.request({
            
            url:'api/posts/new',
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            data: formData
        }).then((res) => {
            alert('Post criado com sucesso!');
            window.location.reload();
        })
        .catch(err =>  console.log(err));
    }
    function ToggleMode(){
        modalContext.openModal();
    }

    return(
        <Modal
            open={(modalContext.modalState.open === true) ? true : false}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >  
         <Box sx={StyleForm}>
            <div>
                <button onClick={ToggleMode} className="Button-back" >X</button>
            </div>
            <FormComponent method='post' onSubmit={SubmitForm} className='mx-10'>
                <TextField 
                    className="inputPost"
                    id="outlined-basic"
                    label="Escreva algo sobre a publica????o" 
                    variant="outlined"
                    required
                    type='text'
                    onChange={(e) => setInputs(prev => ({...prev, content: e.target.value}))}
                />
                <input type='file'className='self-center m-4' onChange={VerifyImages}/>
                <Button variant="contained" className="ButtonLogin" type="submit">Enviar Post</Button>
            </FormComponent>
         </Box>
        </Modal>
    );

}