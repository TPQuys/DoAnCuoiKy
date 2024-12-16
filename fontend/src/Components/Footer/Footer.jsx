import "./footer.css";
import FacebookIcon from '@mui/icons-material/Facebook';
import EmailIcon from '@mui/icons-material/Email';
import WebIcon from '@mui/icons-material/Web';
import { Grid } from "@mui/material";

const Footer = () => {
    return (
        <main className="footer-container">
            <div className="footer-content">
                <div className="footer-info-box">
                    {/* <h1 className="footer-logo">Logo</h1> */}
                    <img src="./whiteLogo.png" className="footer-logo" alt="IUH logo"></img>

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
                <div className="orther-info" >
                    <img src="https://espfoizbmzncvmwdmtvy.supabase.co/storage/v1/object/sign/Event/IUH_logo.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJFdmVudC9JVUhfbG9nby5wbmciLCJpYXQiOjE3Mjc4OTExMzQsImV4cCI6MTc1OTQyNzEzNH0._ol1MSrAPbozrfLH2L0dRmZUx2Fur68-iLTj5PoaZC0&t=2024-10-02T17%3A45%3A33.724Z" className="iuh_logo" alt="IUH logo"></img>
                    <div>
                        <Grid container justifyContent='space-around'>
                            <Grid item sx={4}>
                                <img src="https://espfoizbmzncvmwdmtvy.supabase.co/storage/v1/object/public/Event/Node.png?t=2024-12-16T10%3A22%3A28.970Z" alt="Node" width="100px" />
                            </Grid>
                            <Grid item sx={4}>
                                <img src="https://espfoizbmzncvmwdmtvy.supabase.co/storage/v1/object/public/Event/React.png?t=2024-12-16T10%3A22%3A03.566Z" alt="React" width="100px" />
                            </Grid>
                            <Grid item sx={4}>
                                <img src="https://espfoizbmzncvmwdmtvy.supabase.co/storage/v1/object/public/Event/Supabase.png?t=2024-12-16T10%3A21%3A30.474Z" alt="supabase" width="100px" />
                            </Grid>
                        </Grid>
                    </div>
                </div>

            </div>
        </main>
    );
};

export default Footer;
