import './bootstrap';

import ReactDOM from 'react-dom/client';        
import App from './App';
import { TodoContextProvider } from './Contexts/todo';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <TodoContextProvider>
        <App />
    </TodoContextProvider>
);