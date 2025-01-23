import React from 'react';
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Link,
	useNavigate,
	useLocation,
} from 'react-router-dom';
import { locales, taskTypes } from './taskTypes';
import { generateUniqueKey } from './utils';
import './App.css';

function useQuery() {
	const { search } = useLocation();
	return React.useMemo(() => new URLSearchParams(search), [search]);
}

function Home() {
	return (
		<div>
			<h1>Rating Platform, Welcome!</h1>
			<nav>
				<Link to='/task'>Start Rating</Link>
			</nav>
		</div>
	);
}

function Instructions() {
	return (
		<div>
			<h2>Instructions</h2>
			<p>
				Welcome to our Rating Platform! Please rate the product/service based on your experience,
				with 1 being poor and 5 being excellent. You may also leave detailed feedback to help others
				make informed decisions. Your ratings and comments are valuable in improving our offerings.
				Ensure your feedback is constructive and respectful. Thank you for your time and input!
			</p>
			<nav>
				<Link
					to={`/task?encryptedTemplateKey=${generateUniqueKey()}&encryptedEvalRef=${generateUniqueKey()}`}>
					Continue
				</Link>
			</nav>
		</div>
	);
}

function Task() {
	const navigate = useNavigate();
	const taskType = taskTypes[Math.floor(Math.random() * taskTypes.length)];
	const locale = locales[Math.floor(Math.random() * locales.length)];

	const handleNextTask = () => {
		const newEncryptedTemplateKey = generateUniqueKey();
		const newEncryptedEvalRef = generateUniqueKey();
		navigate(
			`/task?encryptedTemplateKey=${newEncryptedTemplateKey}&encryptedEvalRef=${newEncryptedEvalRef}`
		);
	};

	return (
		<div>
			<h2 className='pageName'>
				<span className='taskTitle'>{taskType}</span>&nbsp;
				<span className='taskLocale'>({locale})</span>
			</h2>
			<p className='taskDescription'>
				Please rate the product/service based on your experience, with 1 being poor and 5 being. You
				may also leave detailed feedback to help others make informed decisions. Your ratings and
				comments are valuable in improving our offerings. Ensure your feedback is constructive and
				respectful. Thank you for your time and input!
			</p>
			<button onClick={handleNextTask} className='submitTaskButton'>
				Submit
			</button>
			<nav className='secondaryNav'>
				<Link to='/'>Home</Link>
				<Link to='/task'>Instructions</Link>
			</nav>
		</div>
	);
}

function TaskPageRouter() {
	const query = useQuery();
	const encryptedTemplateKey = query.get('encryptedTemplateKey');
	const encryptedEvalRef = query.get('encryptedEvalRef');

	// Conditionally render the Task or Instructions component
	if (encryptedTemplateKey && encryptedEvalRef) {
		return <Task />;
	}
	return <Instructions />;
}

function ErrorPage() {
	return (
		<div>
			<h1>404 - Page Not Found</h1>
			<nav>
				<Link to='/'>Go Back Home</Link>
			</nav>
		</div>
	);
}

function App() {
	return (
		<main>
			<Router basename='/rating'>
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/task' element={<TaskPageRouter />} />
					<Route path='*' element={<ErrorPage />} />
				</Routes>
			</Router>
		</main>
	);
}

export default App;
