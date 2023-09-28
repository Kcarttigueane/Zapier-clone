import './Footer.css';

const Footer = () => {
    return (
        <div className="my-footer">
            <img src="../../src/assets/demo_page/logo.jpg" alt="logo" style={{ width: 125, height: 131 }} />
            <ul>
                <li>About</li>
                <li>Features</li>
                <li>Pricing</li>
                <li>Gallery</li>
                <li>Team</li>
            </ul>
            <div style={{ display: 'flex', flexDirection: 'row', gap: 15, marginRight: 15 }}>
                <img src="../../src/assets/demo_page/Facebook.png" alt="Facebook" style={{ width: 60, height: 60 }} />
                <img src="../../src/assets/demo_page/linkedin.png" alt="linkedin" style={{ width: 60, height: 60 }} />
            </div>
        </div>
    );
};

export default Footer;