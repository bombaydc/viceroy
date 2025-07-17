import Image from "next/image"
import Link from "next/link"
import './index.scss';

const Header = () => {
    return (
        <header className="ui-header">
            <div className="ui-header__wrapper">
                <Link className='ui-header__logo-wrapper' href={""} aria-label='Home Page'><Image src={'/assets/common/logo/light-logo.svg'} alt="logo" width={134} height={32} className='ui-header__logo' /></Link>
            </div>
        </header>
    )
}

export default Header