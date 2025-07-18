import Stagger from '@/components/motion/stagger';
import './index.scss';

const SectionHead = ({ label, title, description }: { label?: string, title?: string, description?: string }) => {
    let index = 0;
    return (
        <Stagger as={"section"} className="ui-section-head">
            <div className="ui-section-head__container">  
                {label && <span className="ui-section-head__label" data-stagger-motion-index={index++} data-stagger-motion-type="sm">{label}</span>}
                <h2 className="ui-section-head__title" data-stagger-motion-index={index++} data-stagger-motion-type="sm">{title}</h2>
                {description && <p className="ui-section-head__desc" data-stagger-motion-index={index++} data-stagger-motion-type="sm">{description}</p>}
            </div>
        </Stagger>
    )
}

export default SectionHead