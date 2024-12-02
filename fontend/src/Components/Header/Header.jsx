import "./header.css";
const Header = ({ title, background }) => {
  return (
    <main className="header-container">
      <div
        className="home-header"
        style={{ backgroundImage: `url(${background})` }}
      >
        {/* <img src="https://espfoizbmzncvmwdmtvy.supabase.co/storage/v1/object/sign/Event/IUH_logo.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJFdmVudC9JVUhfbG9nby5wbmciLCJpYXQiOjE3Mjc4OTExMzQsImV4cCI6MTc1OTQyNzEzNH0._ol1MSrAPbozrfLH2L0dRmZUx2Fur68-iLTj5PoaZC0&t=2024-10-02T17%3A45%3A33.724Z" width='3vw' alt="IUH logo"></img> */}
        <div className="header-title">{title}</div>
      </div>
    </main>
  );
};

export default Header;
