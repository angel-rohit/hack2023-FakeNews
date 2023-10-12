import { A } from "@solidjs/router"
import menus from '../../constants/menu';

export default function Header(){
    return (
        <nav>
            <div class="flex space-between flex-wrap grid-end-1">
            <For each={menus()}>{menu => {
                return <A class="px-4 py-2 hover:bg-blue-100 hover:text-skin-select hover:rounded" activeClass="text-skin-select rounded font-semibold" href={menu.path}>
                    <span class={`${menu.icon} mr-2`}></span>
                    <span>{menu.title}</span>
                </A>
                }}</For>
            </div>
        </nav>
    )
}