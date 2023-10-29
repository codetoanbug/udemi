import {useI18n, withI18n} from '@udemy/i18n';
import MoreIcon from '@udemy/icons/dist/more.ud-icon';
import {BlockList, IconButton, Image} from '@udemy/react-core-components';
import {BasicPopover} from '@udemy/react-popup-components';
import {withUDData} from '@udemy/ud-data';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import debounce from 'utils/debounce';
import udLink from 'utils/ud-link';

import LinkBarItemModel from './link-bar-item.mobx-model';
import {NavLink} from './link-bar.react-isocomponent';
import {categoryShape, subcategoryShape} from './shapes';
import styles from './subcategory-link-bar.less';

function renderPopoverWrapper({className, ...props}, ...args) {
    return BasicPopover.defaultProps.renderContent(
        {
            className: classNames(className, 'ud-popover-dropdown-menu', styles['popover-wrapper']),
            ...props,
        },
        ...args,
    );
}

const AdditionalSubcategoryMenuPopover = ({subcategories}) => {
    const {gettext} = useI18n();
    return (
        <BasicPopover
            placement="bottom-end"
            trigger={
                <IconButton
                    udStyle="ghost"
                    size="medium"
                    className={classNames('ud-link-neutral', styles.dropdown)}
                >
                    <MoreIcon label={gettext('More subcategory menu links')} />
                </IconButton>
            }
            withArrow={false}
            withPadding={false}
            renderContent={renderPopoverWrapper}
        >
            <BlockList styleName="popover-content" size="small">
                {subcategories.map((subcategory) => (
                    <BlockList.Item
                        key={subcategory.id}
                        componentClass="a"
                        href={subcategory.absolute_url}
                        styleName="subcategory-in-dropdown"
                    >
                        {subcategory.title}
                    </BlockList.Item>
                ))}
            </BlockList>
        </BasicPopover>
    );
};

AdditionalSubcategoryMenuPopover.propTypes = {
    subcategories: PropTypes.arrayOf(subcategoryShape).isRequired,
};

@observer
class SubcategoryLinkBar extends React.Component {
    static propTypes = {
        category: categoryShape,
        gettext: PropTypes.func.isRequired,
        udData: PropTypes.object.isRequired,
    };

    static defaultProps = {
        category: null,
    };

    constructor(props) {
        super(props);
        this.subcatRefs = {};
        this.subcategories = [];

        // https://github.com/babel/eslint-plugin-babel/issues/185#issuecomment-569996329
        // Optional chaining and array methods will cause a lint error.
        // Fix will be implemented in js-tooling repo
        // eslint-disable-next-line no-unused-expressions
        props.category?.children?.forEach((subcategory) => {
            this.subcategories.push(new LinkBarItemModel(subcategory));
            this.subcatRefs[subcategory.id] = React.createRef();
        });
    }

    componentDidMount() {
        this.debouncedSetRefOffsets = debounce(this.setRefOffsets, 500);
        // Specifically uses resize event listener rather than match media because
        // this component needs to detect width change rather than a specific width
        window.addEventListener('resize', this.debouncedSetRefOffsets);
        this.setRefOffsets();
    }

    componentDidUpdate() {
        this.setRefOffsets();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.debouncedSetRefOffsets);
    }

    setRefOffsets = () => {
        this.subcategories.forEach((subcat) => {
            subcat.setDomOffsetTop(this.subcatRefs[subcat.id].offsetTop);
        });
    };

    setRef = (id) => {
        return (ref) => {
            this.subcatRefs[id] = ref;
        };
    };

    render() {
        const {category, gettext, udData} = this.props;
        const {Config} = udData;

        if (!category || !category.children?.length) {
            return null;
        }

        const subcategoriesInDropdown = this.subcategories.filter(
            (subcategory) => subcategory.isInDropdown,
        );

        return (
            <nav className={styles['subcategory-link-bar']}>
                <ul
                    className={classNames('ud-unstyled-list', styles['nav-list'])}
                    data-purposes="nav-list"
                >
                    <li className={styles['category-wrapper']} key={category.id}>
                        <NavLink className={styles.category} sdNavItem={category} />
                        <Image
                            src={udLink.toStorageStaticAsset(
                                'browse_components/link-bar/large-next.svg',
                                {Config},
                            )}
                            width={18}
                            height={56}
                            className={styles['large-next-icon']}
                            alt={gettext('Arrow pointing to subcategory menu links')}
                        />
                    </li>
                    {this.subcategories.map((subcategory) => (
                        <li key={subcategory.id} ref={this.setRef(subcategory.id)}>
                            <NavLink className={styles.subcategory} sdNavItem={subcategory} />
                        </li>
                    ))}
                </ul>
                {subcategoriesInDropdown.length > 0 && (
                    <AdditionalSubcategoryMenuPopover subcategories={subcategoriesInDropdown} />
                )}
            </nav>
        );
    }
}

export default withUDData(withI18n(SubcategoryLinkBar));
