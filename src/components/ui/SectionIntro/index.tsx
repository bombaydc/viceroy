

const SectionIntro = ({ title, info }: { title?: string, info?: string }) => {
    return (
        <div className="sectional-header__title-group">
            <h2 className="sectional-header__title">{title}</h2>
            <p className="sectional-header__desc">{info}</p>
        </div>
    )
}

export default SectionIntro