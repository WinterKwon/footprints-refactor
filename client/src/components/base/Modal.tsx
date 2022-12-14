import React, { PropsWithChildren } from 'react';
import styled from '@emotion/styled';
import { HiX } from 'react-icons/hi';

interface ModalDefaultType {
  onClickToggleModal: () => void;
  size?: 'small' | 'medium' | 'large';
}

function Modal({
  onClickToggleModal,
  children,
  size,
}: PropsWithChildren<ModalDefaultType>) {
  return (
    <ModalContainer>
      <DialogBox size={size}>
        <ExitButton onClick={onClickToggleModal}>
          <HiX />
        </ExitButton>
        {children}
      </DialogBox>
      <Backdrop
        onClick={(e: React.MouseEvent) => {
          e.preventDefault();

          if (onClickToggleModal) {
            onClickToggleModal();
          }
        }}
      />
    </ModalContainer>
  );
}

const ModalContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 10000;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ExitButton = styled.button`
  position: absolute;
  right: 28px;
  top: 34px;
  cursor: pointer;
  font-size: 20px;
  font-weight: bold;
  color: #000;
  background-color: transparent;
  border: none;
  outline: none;
`;

interface DialogBoxProps {
  size?: 'small' | 'medium' | 'large';
}

const DialogBox = styled.dialog<DialogBoxProps>`
  width: ${props => {
    switch (props.size) {
      case 'small':
        return '500px';
      case 'medium':
        return '700px';
      case 'large':
        return '900px';
      default:
        return '500px';
    }
  }};
  height: ${props => {
    switch (props.size) {
      case 'small':
        return '378px';
      case 'medium':
        return '678px';
      case 'large':
        return '830px';
      default:
        return '378px';
    }
  }};
  display: flex;
  flex-direction: column;
  align-items: center;
  border: none;
  border-radius: 15px;
  box-shadow: 0 0 30px rgba(30, 30, 30, 0.185);
  box-sizing: border-box;
  background-color: white;
  z-index: 10000;
`;

const Backdrop = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.2);
`;

export default Modal;
