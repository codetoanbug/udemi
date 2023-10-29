import {withMatchMedia} from '@udemy/hooks';
import {withI18n} from '@udemy/i18n';
import {Tabs} from '@udemy/react-structure-components';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import CardContainer from './card-container.react-component';
import ImageBanner from './image-banner.react-component';
import styles from './window-shopping-unit.less';
import WindowShoppingUnitStore from './window-shopping-unit.mobx-store';

@withMatchMedia({hasPrimaryCoarsePointer: '(pointer: coarse)'})
@observer
class WindowShoppingUnit extends Component {
    static propTypes = {
        ariaLabelledBy: PropTypes.string,
        unit: PropTypes.object.isRequired,
        renderCta: PropTypes.object,
        showBannerImage: PropTypes.bool,
        showNumAdditionalCourses: PropTypes.bool,
        cardProps: PropTypes.object,
        hasPrimaryCoarsePointer: PropTypes.bool,
        gettext: PropTypes.func.isRequired,
        interpolate: PropTypes.func.isRequired,
    };

    static defaultProps = {
        ariaLabelledBy: 'exploreCollectionHeading',
        renderCta: undefined,
        showBannerImage: true,
        showNumAdditionalCourses: false,
        cardProps: undefined,
        hasPrimaryCoarsePointer: null,
    };

    constructor(props) {
        super(props);
        this.store = new WindowShoppingUnitStore(this.props.unit);
    }

    renderContentWithCTA(subUnit) {
        const {renderCta, showNumAdditionalCourses, cardProps, gettext, interpolate} = this.props;
        return (
            <div className={styles['content-with-cta']}>
                <CardContainer
                    unit={subUnit}
                    className={styles['card-container']}
                    cardProps={cardProps}
                />
                {showNumAdditionalCourses && (
                    <div
                        className={classNames('ud-heading-sm', styles['num-courses-text'])}
                        data-purpose="num-courses-text"
                    >
                        {interpolate(
                            gettext('+%(courseCount)s other top %(topic)s courses'),
                            // TODO update when we get course count in the unit
                            {courseCount: 0, topic: subUnit.title},
                            true,
                        )}
                    </div>
                )}
                {renderCta && (
                    <div className={styles['cta-wrapper']} data-purpose="cta-wrapper">
                        <div className="ud-heading-lg">
                            {gettext('Start exploring the collection today.')}
                        </div>
                        {renderCta}
                    </div>
                )}
            </div>
        );
    }

    render() {
        const {subUnits} = this.store;
        const {showBannerImage, ariaLabelledBy, hasPrimaryCoarsePointer} = this.props;

        return (
            <section aria-labelledby={ariaLabelledBy}>
                <Tabs prioritizeTouch={!!hasPrimaryCoarsePointer}>
                    {subUnits.map((subUnit) => {
                        return (
                            <Tabs.Tab title={subUnit.title} key={subUnit.title}>
                                {showBannerImage ? (
                                    <div className={styles.container}>
                                        <ImageBanner
                                            data-purpose="image-banner"
                                            sourceObjectId={subUnit.source_object_id}
                                        />
                                        {this.renderContentWithCTA(subUnit)}
                                    </div>
                                ) : (
                                    <>{this.renderContentWithCTA(subUnit)}</>
                                )}
                            </Tabs.Tab>
                        );
                    })}
                </Tabs>
            </section>
        );
    }
}

export default withI18n(WindowShoppingUnit);
