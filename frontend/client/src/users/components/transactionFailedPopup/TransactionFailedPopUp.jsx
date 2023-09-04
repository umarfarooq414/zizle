import React, { useState } from 'react';
import { styled } from './style.module.css';
import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
const style = {
  position: 'absolute',
  top: '22%',
  left: '0',
  right: '0',
  height: 'auto',
  maxWidth: 360,
  // background: '0px 0px 10px rgba(0, 0, 0, 0.4)',
  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.12);',
  pt: 2,
  px: 4,
  py: 4,
  margin: 'auto',
  // background: '#fff',
  bgcolor: 'background.paper',
  borderRadius: '0.75rem',
};




const TransactionFailedPopUp = () => {
    const [open, setOpen] = React.useState(false);


    const firstHandleOpen = () => {
        setOpen(true);
    };
    const firstHandleClose = () => {
        setOpen(false);
    };
    return (

        <div className={styled.homeMainRegister1}>
            <div className={styled.wrapwidth}>
                <div className={styled.homeMainRegr}>
                    <div>
                        <Modal
                            open={open}
                            onClose={firstHandleClose}
                            aria-labelledby='parent-modal-title'
                            aria-describedby='parent-modal-description'
                        >
                            <Box sx={{ ...style, width: 'auto' }} className={styled.modelBoxReg}>
                                {/* <Button onClick={firstHandleClose} className={styled.closeBtnModal}>
                    <img src={CloseIcon} alt='cross icon' />
                  </Button> */}
                                <h2 id='parent-modal-title'>Create 10 Special Users</h2>

                                <p
                                    id='parent-modal-description'
                                    style={{
                                        textAlign: 'center',
                                        color: 'rgba(0,0,0,.7)',
                                        fontSize: '14px',
                                        lineHeight: '20px',
                                        margin: '0px 0px 10px;',
                                    }}
                                >
                                </p>

                                <form
                                    className={styled.formLogin}
                                >
                                    <div className={styled.formGroup}>
                                        <h5 style={{ textAlign: 'left', color: '#a2acba', fontWeight: 'lighter' }}>Min age</h5>
                                        {/* <select
                                            value={minAge}
                                            onChange={(e) => setMinAge(e.target.value)}
                                        >
                                            {Array.from({ length: 62 }, (_, index) => (
                                                <option key={index} value={index + 18}>{index + 18}</option>
                                            ))}
                                        </select> */}

                                    </div>
                                    <div className={styled.formGroup}>
                                        <h5 style={{ textAlign: 'left', color: '#a2acba', fontWeight: 'lighter' }}>Max age</h5>
                                        {/* <select
                                            value={maxAge}
                                            onChange={(e) => setMaxAge(e.target.value)}
                                        >
                                            {Array.from({ length: 50 }, (_, index) => (
                                                <option key={index} value={index + 30}>{index + 30}</option>
                                            ))}
                                        </select> */}

                                    </div>

                                    <div className={styled.formGroup}>
                                        <h5 style={{ textAlign: 'left', color: '#a2acba', fontWeight: 'lighter', fontWeight: 'lighter' }}>Gender</h5>
                                        {/* <select
                                            value={selectedGender}
                                            onChange={(e) => setSelectedGender(e.target.value)}
                                        >
                                            <option value="MALE">MALE</option>
                                            <option value="FEMALE">FEMALE</option>
                                        </select> */}

                                    </div>
                                    <div className={styled.formGroup}>
                                        <div><Button
                                            onClick={firstHandleClose}
                                            sx={{
                                                // backgroundColor: 'blue',
                                                border: '1px solid #cbcbcb',
                                                borderRadius: '4px',
                                                color: 'black',
                                                padding: '8px 16px',
                                                '&:hover': {
                                                    backgroundColor: '#cbcbcb',
                                                },
                                            }} >Cancel</Button></div>
                                        <div>
                                            <Button sx={{
                                                backgroundColor: '#308af3',
                                                border: '1px solid #cbcbcb',
                                                borderRadius: '4px',
                                                color: 'white',
                                                padding: '8px 16px',
                                                '&:hover': {
                                                    backgroundColor: '#287edf',
                                                },
                                            }}>Create</Button></div>


                                    </div>
                                    <div className={styled.clear}></div>
                                </form>

                            </Box>
                        </Modal>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TransactionFailedPopUp


