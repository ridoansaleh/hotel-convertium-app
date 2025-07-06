import "../css/book-steps.css";

function BookSteps({ step }) {
  return (
    <div className="book-steps">
      <div
        className={`d-flex items-center mr-24 ${1 > step ? "not-active" : ""}`}
      >
        <div className="circle mr-10">1</div>
        <label>Search</label>
      </div>
      <div
        className={`d-flex items-center mr-24 ${2 > step ? "not-active" : ""}`}
      >
        <div className="circle mr-10">2</div>
        <label>Select Room</label>
      </div>
      <div
        className={`d-flex items-center mr-24 ${3 > step ? "not-active" : ""}`}
      >
        <div className="circle mr-10">3</div>
        <label>Contact Information</label>
      </div>
      <div className={`d-flex items-center ${3 > step ? "not-active" : ""}`}>
        <div className="circle mr-10">4</div>
        <label>Confirmation</label>
      </div>
    </div>
  );
}

export default BookSteps;
