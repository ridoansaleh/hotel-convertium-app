import "../css/room.css";

function Room({ title, sub_title, description, price, photo }) {
  return (
    <div className="room d-flex mb-16">
      <div className="details">
        <img src={photo} className="photo m-10" alt="Room Image" />
        <div className="d-flex flex-column m-10">
          <h3 className="my-0">{title}</h3>
          <h5 className="my-5">{sub_title}</h5>
          <p>{description}</p>
        </div>
      </div>
      <div className="price d-flex flex-column p-10">
        <h1 className="my-0">
          S${price}
          <span className="long-stay">/night</span>
        </h1>
        <p>Subject to GST and charges</p>
        <button className="book-btn">Book Room</button>
      </div>
    </div>
  );
}

export default Room;
