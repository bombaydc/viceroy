import './index.scss'

const DotLoader = () => {
    return (
        <span className="core-dot-loader">
            <div className="core-dot-loader__container">
                <div className="core-dot-loader__dot core-dot-loader__dot--one"></div>
                <div className="core-dot-loader__dot core-dot-loader__dot--two"></div>
                <div className="core-dot-loader__dot core-dot-loader__dot--three"></div>
            </div>
        </span>
    )
}

export default DotLoader