import {withI18n} from '@udemy/i18n';
import {Button} from '@udemy/react-core-components';
import {SkipToContentButton} from '@udemy/react-navigation-components';
import {useUDData} from '@udemy/ud-data';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import {isomorphic} from 'utils/isomorphic-rendering';

import styles from './link-bar.less';
import {categoryShape, subcategoryShape} from './shapes';

export function NavLink({className, sdNavItem}) {
    return (
        <Button
            className={styles['nav-button']}
            size="medium"
            componentClass="a"
            udStyle="ghost"
            href={sdNavItem.absolute_url}
        >
            <span className={classNames('ud-text-sm', className)}>{sdNavItem.title}</span>
        </Button>
    );
}
NavLink.propTypes = {
    sdNavItem: PropTypes.oneOfType([categoryShape, subcategoryShape]).isRequired,
    className: PropTypes.string,
};
NavLink.defaultProps = {
    className: null,
};

export function LinkBarSubcategory({subcategory}) {
    return (
        <li className={styles.subcategory}>
            <NavLink sdNavItem={subcategory} />
        </li>
    );
}
LinkBarSubcategory.propTypes = {
    subcategory: subcategoryShape.isRequired,
};

export function LinkBarSubcategories({subcategories}) {
    return (
        <div className={styles['subcategory-wrapper']}>
            <ul className={classNames('ud-unstyled-list', styles.subcategories)}>
                {subcategories.map((subcat) => (
                    <LinkBarSubcategory key={subcat.id} subcategory={subcat} />
                ))}
            </ul>
        </div>
    );
}
LinkBarSubcategories.propTypes = {
    subcategories: PropTypes.arrayOf(subcategoryShape).isRequired,
};

export function LinkBarCategory({category}) {
    const {Config: udConfig} = useUDData();
    const [hoverState, setHoverState] = React.useState(false);
    const isCategoryExpanded =
        udConfig.features.logged_in_home && udConfig.features.logged_in_home.linkbar_level_2;
    const handleMouseEnter = React.useCallback(() => {
        setHoverState(isCategoryExpanded);
    }, [isCategoryExpanded]);
    const handleMouseLeave = React.useCallback(() => {
        setHoverState(false);
    }, []);

    return (
        <li
            className={classNames(styles.category, {
                [styles['is-category-expanded']]: isCategoryExpanded,
            })}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className={styles['triangle-wrapper']}>
                <NavLink sdNavItem={category} />
            </div>
            {hoverState && <LinkBarSubcategories subcategories={category.children} />}
        </li>
    );
}
LinkBarCategory.propTypes = {
    category: categoryShape.isRequired,
};

@isomorphic
class LinkBar extends React.Component {
    static propTypes = {
        categories: PropTypes.arrayOf(categoryShape),
        gettext: PropTypes.func.isRequired,
    };

    static defaultProps = {
        categories: [],
    };

    render() {
        const {categories, gettext} = this.props;

        if (!categories.length) {
            return null;
        }

        return (
            <nav className={styles['link-bar']}>
                <SkipToContentButton
                    goToContentSelector=".page-content"
                    size="medium"
                    label={gettext('Skip to content')}
                />
                <ul className={classNames('ud-unstyled-list', styles.categories)}>
                    {categories.map((category) => (
                        <LinkBarCategory key={category.id} category={category} />
                    ))}
                </ul>
            </nav>
        );
    }
}

export default withI18n(LinkBar);
