import React from 'react';
import ReactDOM from 'react-dom/client';
import DemoPage from './DemoPage.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<DemoPage></DemoPage>
	</React.StrictMode>,
);
