import CircularLoader from "./circular-loader"
import DotLoader from "./dot-loader"


const Loader = ({ type = 'circular' }: { type: 'circular' | 'dots' }) => {
    return (
        <div className='core-loader'>
            {
                type === 'circular' ?
                    <CircularLoader />
                    : <DotLoader />
            }
        </div>
    )
}

export default Loader