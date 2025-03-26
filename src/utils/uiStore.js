import {create} from 'zustand';
import {alertStatus} from "./enums.js";

const uiStore = create((set, get) => ({
  alert: {
    isOpen: false,
    message: '',
    autoClose: true,
    closeTime: alertStatus.DEFAULT_ALERT_TIEM,
    type: alertStatus.SUCCESS,
    openAlert: ({message, autoClose, closeTime, type}) => {
      if (typeof message !== "string") {
        alert('잘못된 방식입니다.');
        console.error(`전달된 메시지 방식 : ${typeof message}`);
        return;
      }

      if (autoClose === undefined || typeof autoClose !== "boolean") {
        autoClose = true;
      }

      if (typeof closeTime !== "number" || closeTime < 0) {
        closeTime = alertStatus.DEFAULT_ALERT_TIEM;
      }

      if (typeof type !== "string") {
        type = alertStatus.SUCCESS;
      }

      set({
        alert: {
          ...get().alert,
          isOpen: true,
          message,
          autoClose,
          closeTime: closeTime,
          type: type,
        }
      })
    },
    closeAlert: () => {
      set({
        alert: {
          ...get().alert,
          isOpen: false,
          message: '',
          autoClose: true,
          closeTime: alertStatus.DEFAULT_ALERT_TIEM,
          type: alertStatus.SUCCESS,
        }
      })
    },
  },
  loading: {
    isOpen: false,
    isFullScreen: false,
    openLoading: ({isFullScreen}) => {
      if (isFullScreen === undefined || typeof isFullScreen !== "boolean") {
        isFullScreen = false;
      }

      set({
        loading : {
          ...get().loading,
          isOpen: true,
          isFullScreen: isFullScreen,
        }
      })
    },
    closeLoading: () => {
      set({
        loading : {
          ...get().loading,
          isOpen: false,
          isFullScreen: false,
        }
      })
    },
  },
  dialog: {
    isOpen: false,
    body: '',
    hasPrevious: false,
    onBack: null, // 콜백함수로 정의
    openDialog: ({body, hasPrevious}) => {
      set({
        dialog : {
          ...get().dialog,
          isOpen: true,
          body: body,
          hasPrevious: hasPrevious || false,
          onBack: null,
        }
      })
    },
    closeDialog: () => {
      set({
        dialog : {
          ...get().dialog,
          isOpen: false,
          body: '',
          hasPrevious: false,
          onBack: null
        }
      })
    },
    setHasPrevious: ({hasPrevious}) => {
      set({
        dialog : {
          ...get().dialog,
          hasPrevious: hasPrevious
        }
      })
    },
    setOnBack: ({onBack}) => {
      if (typeof onBack !== 'function') {
        console.error(`잘못된 형식입니다, 함수를 넣어주세요 : ${onBack}`);
        return;
      }

      set({
        dialog : {
          ...get().dialog,
          onBack: onBack || null,
        }
      })
    },
  }
}));

export default uiStore;
