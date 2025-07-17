import Link from "next/link";
import './index.scss';
import { cn } from "@/utils/cn";
import { MouseEvent as ReactMouseEvent  } from "react";

interface FilterTabProps {
    options: { label: string, value: string }[];
    activeValue?: string;
}

const FilterTab: React.FC<FilterTabProps> = ({ options = [], activeValue = "all" }) => {
    if (options.length === 0) { return null; }

    const handleClick = (e: ReactMouseEvent<HTMLAnchorElement>) => {
        const el = e.currentTarget;
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
    };
    return (
        <div className="ui-filter-tab">
            <div className="ui-filter-tab__container">
                <ul className="ui-filter-tab__list">
                    {
                        options.map((option, index) => (
                            <li key={index} className="ui-filter-tab__item">
                                <Link href={option.value}
                                    onClick={handleClick} className={cn("ui-filter-tab__button", activeValue === option.label.toLocaleLowerCase() ? 'is-active' : '')}>
                                    {option.label}
                                </Link>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </div >
    )
}

export default FilterTab