/* frameowrks */
import { onMount } from "solid-js";
import { Router, Routes, Route, Navigate} from "@solidjs/router"

/* Layouts */
import MainLayout from "./layouts/MainLayout";

/* Pages */
import FakeTrading from './pages/HomePage';
import AccountPage from './pages/AccountPage';

/* Data Functions */

function App() {
  onMount(()=>{
    console.log('* env variable at mount : '+import.meta.env.VITE_BASE_URL);
  });

  return (
    <Router>
      <div class="bg-gray-100">
        <Routes>
          <Route path="/" component={MainLayout}>
            <Route path="/" element={<Navigate href='/home'/>}/>
            <Route path="/home" component={FakeTrading} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
