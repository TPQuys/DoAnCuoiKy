import "./footer.css";
import { Link, useNavigate } from "react-router-dom";
import FacebookIcon from '@mui/icons-material/Facebook';
import EmailIcon from '@mui/icons-material/Email';
import WebIcon from '@mui/icons-material/Web';

const Footer = () => {
    return (
        <main className="footer-container">
            <div className="footer-content">
                <div className="footer-info-box">
                    <h1 className="footer-logo">Logo</h1>
                    <div className="icon-box">
                        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                            <FacebookIcon />
                        </a>
                        <a href="mailto:info@eventiuh.com">
                            <EmailIcon />
                        </a>
                        <a href="https://iuh.edu.vn" target="_blank" rel="noopener noreferrer">
                            <WebIcon />
                        </a>
                    </div>
                    <div>
                        <h3>CÔNG TY CỔ PHẦN EVENTIUH</h3>
                        <p>12 Nguyễn Văn Bảo, Phường 3, Gò Vấp, Hồ Chí Minh</p>
                        <p><a href="https://iuh.edu.vn" target="_blank" rel="noopener noreferrer">https://iuh.edu.vn/</a></p>
                        <p>09712312322</p>
                    </div>
                </div>
                <div className="orther-info">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/bf/Logo_IUH.png" style={{ width: "300px", height: "auto" }} alt="IUH logo"></img>
                </div>
            </div>
        </main>
    );
};

export default Footer;
