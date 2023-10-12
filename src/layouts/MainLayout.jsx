import { Outlet} from "@solidjs/router";
import { onMount } from "solid-js";

import Header from './partials/Header'

export default function MainLayout () {
    return (
        <>
            <Header />
            <div class="container mx-auto">
                <Outlet />  
            </div>
            
        </>
    )
}