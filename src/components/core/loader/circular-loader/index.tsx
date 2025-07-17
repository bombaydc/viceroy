import './index.scss'

const CircularLoader = () => {
    return (
        <svg className="core-circular-loader" viewBox="0 0 100 100">
            <circle className="core-circular-loader__spinner" cx="50%" cy="50%" r="16"></circle>
        </svg>
    )
}

export default CircularLoader