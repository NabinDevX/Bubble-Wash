import { toast } from "react-toastify";

const DEFAULT_OPTIONS = {
  autoClose: 12000, // 12 seconds default
  position: "top-right",
  closeOnClick: true,
  pauseOnHover: true,
  hideProgressBar: false,
};

const notify = {
  success: (message, options = {}) =>
    toast.success(message, { ...DEFAULT_OPTIONS, ...options }),
  error: (message, options = {}) =>
    toast.error(message, { ...DEFAULT_OPTIONS, ...options }),
  info: (message, options = {}) =>
    toast.info(message, { ...DEFAULT_OPTIONS, ...options }),
  warning: (message, options = {}) =>
    toast.warning(message, { ...DEFAULT_OPTIONS, ...options }),
};

export default notify;
