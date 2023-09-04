import React, { useState, createContext, useContext } from 'react';
// import { CreateModal } from './CreateModal';
// import { DeleteModal } from './DeleteModal';
import { TransactionFailedModal } from './TransactionFailedModal';
// import { UpdateModal } from './UpdateModal';
import { VerifyEmailModal } from './VerifyEmailModal';

export const MODAL_TYPES = {
    // CREATE_MODAL: "CREATE_MODAL",
    // DELETE_MODAL: "DELETE_MODAL",
    // UPDATE_MODAL: "UPDATE_MODAL",
    TRANSACTION_FAILED_MODAL: "TRANSACTION_FAILED_MODAL",
    VERIFY_EMAIL_MODAL: "VERIFY_EMAIL_MODAL"
};
const MODAL_COMPONENTS = {
    // [MODAL_TYPES.CREATE_MODAL]: CreateModal,
    // [MODAL_TYPES.DELETE_MODAL]: DeleteModal,
    // [MODAL_TYPES.UPDATE_MODAL]: UpdateModal,
    [MODAL_TYPES.TRANSACTION_FAILED_MODAL]: TransactionFailedModal,
    [MODAL_TYPES.VERIFY_EMAIL_MODAL]: VerifyEmailModal
};

const initalState = {
    showModal: () => { },
    hideModal: () => { },
    store: {}

};

const GlobalModalContext = createContext(initalState);
export const useGlobalModalContext = () => useContext(GlobalModalContext);

export const GlobalModal = ({ children }) => {

    const [store, setStore] = useState();
    const [transactionFailedMessage, setTransactionFailedMessage] = useState();
    const { modalType, modalProps } = store || {};

    const showModal = (modalType, modalProps = {}) => {
        setStore({
            ...store,
            modalType,
            modalProps
        });
    };

    const hideModal = () => {
        setStore({
            ...store,
            modalType: null,
            modalProps: {}
        });
    };

    const renderComponent = () => {
        const ModalComponent = MODAL_COMPONENTS[modalType];
        if (!modalType || !ModalComponent) {
            return null;
        }
        return <ModalComponent id="global-modal" {...modalProps} />;
    };

    return (
        <GlobalModalContext.Provider value={{ store, showModal, hideModal, setTransactionFailedMessage, transactionFailedMessage }}>
            {renderComponent()}
            {children}
        </GlobalModalContext.Provider>
    );
};
