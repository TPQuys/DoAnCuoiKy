import "./header.css";
const Header = ({ title, background }) => {
  return (
    <main className="header-container">
      <div 
        className="home-header" 
        style={{ backgroundImage: `url(${background})` }}
      >
        <div className="header-title">{title}</div>
      </div>
    </main>
  );
};

export default Header;
