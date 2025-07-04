import './Loading.css'

const LoadingIndicator = () => {
  return (
    <div className="loading-container"
    style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    }}>
      <div className="loader"></div>
    </div>
  );
};

export default LoadingIndicator;