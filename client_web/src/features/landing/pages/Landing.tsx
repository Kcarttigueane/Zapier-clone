import React from 'react';
import Footer from '../../../core/components/Footer';
import "./Landing.css";

const Landing: React.FC = () => {
	const handleLogin = () => {
		alert('Bouton Login cliqué !');
	};

	const handleStarted = () => {
		alert('Bouton Get started cliqué !');
	};

	return (
		<>
			<div className="top-bar">
				<img className="logo-bar" src="../src/core/assets/demo_page/logo.png" alt="Logo" />
				<h1 className="title-bar">Area</h1>
				<div className="buttons-bar">
					<button
						onClick={handleLogin}
						style={{
							background: 'none',
							border: 'none',
							outline: 'none',
							cursor: 'pointer',
							fontSize: 15,
							fontWeight: 400,
						}}
					>
						Log In
					</button>
					<button onClick={handleStarted} className="button-get-started">
						Get Started
					</button>
				</div>
			</div>
			<div className="automation-key">
				<div className="first-row">
					<img src="../src/core/assets/demo_page/logo/gmail.png" alt="Logo gmail" />
					<div>
						<p style={{ fontSize: 60, fontWeight: 'bold', textAlign: 'center', marginTop: 0 }}>Automation is key</p>
						<p style={{ fontSize: 36, fontWeight: 'bold', textAlign: 'center' }}>Save time and get more done</p>
					</div>
					<img src="../src/core/assets/demo_page/logo/discord.png" alt="Logo discord" />
				</div>
				<div className="second-row">
					<img src="../src/core/assets/demo_page/logo/tinder.png" alt="Logo Tinder" />
					<img src="../src/core/assets/demo_page/logo/reddit.png" alt="Logo Reddit" />
					<img src="../src/core/assets/demo_page/logo/twitter.png" alt="Logo Twitter" />
				</div>
				<div className="third-row">
					<img src="../src/core/assets/demo_page/logo/spotify.png" alt="Logo spotify" />
					<img src="../src/core/assets/demo_page/logo/whatsapp.png" alt="Logo whatsapp" />
					<img src="../src/core/assets/demo_page/logo/google.png" alt="Logo google" />
					<img src="../src/core/assets/demo_page/logo/youtube.png" alt="Logo youtube" />
				</div>
			</div>
			<div className="connect-phone">
				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<p>Connect your favorite service to create</p>
					<p>a seamless digital directly from your</p>
					<p> smart phone.</p>
					<ul>
						<li>Intelligent Triggers & Reactions</li>
						<li>Sync with the Web App</li>
						<li>Secure & Private</li>
					</ul>
					<div className="mobile-store-logos">
						<img src="../src/core/assets/demo_page/app_store.png" alt="app_store" />
						<img src="../src/core/assets/demo_page/google_store.png" alt="google_store" />
					</div>
				</div>
				<div style={{ display: 'flex', flexDirection: 'row' }}>
					<img src="../src/core/assets/demo_page/mockup_phone.png" alt="mockup phone" style={{ width: 252, height: 413 }} />
					<img
						src="../src/core/assets/demo_page/second_mockup_phone.png"
						alt="second_mockup_phone"
						style={{ width: 184, height: 341, marginTop: 72 }}
					/>
				</div>
			</div>
			<div className="guide">
				<div className="card">
					<img src="../src/core/assets/demo_page/first-card.png" alt="first" />
					<h2>Build custom workflows in minutes</h2>
					<p>Automate the busy work, so you can</p>
					<p>focus on your job, not your tools</p>
					<p>We'll show you how.</p>
				</div>
				<div className="card">
					<img src="../src/core/assets/demo_page/second-card.png" alt="second" />
					<h2>Get more power from your tools</h2>
					<p>Integrate your critical work apps into</p>
					<p>workflows, reclaim your time, and</p>
					<p>focus on impactful work.</p>
				</div>
				<div className="card">
					<img src="../src/core/assets/demo_page/third-card.png" alt="third" />
					<h2>Connect the apps you already love</h2>
					<p>Area supports more apps than any</p>
					<p>other platform, so you can optimize</p>
					<p>the tools you use.</p>
				</div>
			</div>
			<Footer />
		</>
	);
};

export default Landing;
