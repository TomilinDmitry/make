export interface ModalWindow {
  isOpen: boolean;
  onClose: () => void;
}
export interface HeaderProps {
  onOpenAuth: () => void;
}

export interface ModalInfo {
  isOpen: boolean;
  onClose: () => void;
}

export interface AuthForm {
  isOpen?: boolean;
  onClose?: () => void;
}

export interface BurgerAuth {
  onOpen?: () => void;
}
