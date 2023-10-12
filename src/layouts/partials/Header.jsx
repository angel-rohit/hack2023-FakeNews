import Menu from './Menu';

export default function Header(){
    return (
        <div class="bg-white py-2">
            <nav class="container relative mx-auto flex justify-between">
                <div class="flex flex-row">
                    <img 
                        src="https://d2u8j8b25aupc8.cloudfront.net/assets/icons/logo.svg" 
                        alt="AngelOne Logo"
                        class="h-7"
                    />
                </div>
                <Menu />
            </nav>
        </div>
    )
}