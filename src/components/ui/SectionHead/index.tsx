import './index.scss';

const SectionHead = ({ label, title, description }: { label?: string, title?: string, description?: string }) => {
    return (
        <div className="ui-section-head">
            <div className="ui-section-head__container">  
                {label && <span className="ui-section-head__label">{label}</span>}
                <h2 className="ui-section-head__title">{title}</h2>
                {description && <p className="ui-section-head__desc">{description}</p>}
            </div>
        </div>
    )
}

export default SectionHead