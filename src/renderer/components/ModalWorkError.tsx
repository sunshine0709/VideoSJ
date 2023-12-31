type Props = {
  onClose: (reason?: string) => void;
};

const ModalWorkError = ({ onClose }: Props) => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="80"
        height="80"
        fill="currentColor"
        className="text-red-600"
        viewBox="0 0 16 16"
      >
        <rect x="25%" y="25%" width="50%" height="50%" className="fill-white" />
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
      </svg>
      <p className="mt-3 text-xl font-semibold text-red-600">Oh no...</p>
      <small className="mt-3 text-slate-700 dark:text-slate-300">
        Something went wrong and the video could not be created.
      </small>
      <button
        type="button"
        className="mt-5 btn btn-primary"
        onClick={() => onClose()}
      >
        Close
      </button>
    </>
  );
};

export default ModalWorkError;
