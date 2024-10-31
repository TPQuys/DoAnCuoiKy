import "./decorePage.css";
import Header from '../Header/Header'

function DecorePage() {
    return <>
        <Header background="https://espfoizbmzncvmwdmtvy.supabase.co/storage/v1/object/sign/Event/homeheader.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJFdmVudC9ob21laGVhZGVyLmpwZyIsImlhdCI6MTcyNzYxODE4OSwiZXhwIjoxNzU5MTU0MTg5fQ.QU5J1wJV043dbnA6WzcnrIvAVUFGtf3Xc7QCsdIPvR8&t=2024-09-29T13%3A56%3A29.431Z" title="TRANG TRÍ" />
        <div className="d-flex w-75 justify-content-around align-items-center my-3">
            <h4>TẤT CẢ</h4>
            <div className="vr"></div>
            <h4>TIỆC CƯỚI</h4>
            <div className="vr"></div>
            <h4>HỘI NGHỊ</h4>
            <div className="vr"></div>
            <h4>SỰ KIỆN</h4>
        </div>
        <div className="row w-100">
            <DecoreImage 
                url="https://riversidepalace.vn/multidata/83935447_2316044821831065_1898518545768120320_o.jpg"
                tag="TIỆC CƯỚI"
                content="DEAR MY PRINCESS - GÓI TRANG TRÍ THANH LỊCH VÀ  LÃNG MẠN CHO CẶP ĐÔI"
            />
            <DecoreImage 
                url="https://riversidepalace.vn/multidata/1-221.jpg"
                tag="TIỆC CƯỚI"
                content="REAL WEDDING – LÃNG MẠN TRONG VƯỜN TÌNH YÊU GREEN RIVERSIDE"
            />
            <DecoreImage 
                url="https://riversidepalace.vn/multidata/49-663.jpg"
                tag="HỘI NGHỊ"
                content="CÁC PHONG CÁCH SẮP XẾP DÀNH CHO HỘI NGHỊ"
            />
            <DecoreImage 
                url="	https://riversidepalace.vn/multidata/22281560_2061899877172587_4801897351258541299_n.jpg"
                tag="SỰ KIỆN"
                content="HỌP BÁO SƠN TÙNG M-TP RA MẮT TỰ TRUYỆN"
            />
        </div>
    </>
}   

function DecoreImage({href = '', url = '', tag = '', content = ''}) {
    return <div className="col-md-4 oneGal">
        <a 
            href={href}
            className="thumb"
            style={{backgroundImage: `url(${url})`}}
        >
        </a>
        <h3 className="tit">
            <p style={{textAlign: 'left'}} href="#" className="kind">{tag}</p>
            <p style={{textAlign: 'left'}} href="">{content}</p>
        </h3>
    </div>
}

export default DecorePage;