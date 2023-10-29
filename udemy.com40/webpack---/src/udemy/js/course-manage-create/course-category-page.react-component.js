import {OpportunityRootStore} from '@udemy/instructor';
import {FormGroup, Select} from '@udemy/react-form-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import qs from 'qs';
import React, {Component} from 'react';

import './create-course-flow.less';

import {AvailableOpportunitiesStore} from './course-manage-opportunity/available-opportunities.mobx-store';
import {AvailableOpportunities} from './course-manage-opportunity/available-opportunities.react-component';

@observer
export default class CourseCategoryPage extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        const queryParams = this.getQueryParams();
        this.rootStore = new OpportunityRootStore({
            queryParams,
            itemCountPerPage: 5,
            isIP: this.props.store.isIP,
            gettext,
        });
        this.availableOpportunitiesStore = new AvailableOpportunitiesStore();
    }

    @autobind
    getQueryParams() {
        const location = window.location;
        return qs.parse(location.search, {ignoreQueryPrefix: true});
    }

    @autobind
    onChange(e) {
        this.rootStore.setCategoryId(e.target.value);
        this.props.store.updateData('category', e.target.value);
    }

    renderAvailableOpportunities() {
        if (!this.rootStore.categoryId) {
            return null;
        }
        return (
            <AvailableOpportunities
                createCourseStore={this.props.store}
                opportunityRootStore={this.rootStore}
                availableOpportunitiesStore={this.availableOpportunitiesStore}
            />
        );
    }

    headerText = gettext("What category best fits the knowledge you'll share?");
    subHeadText = gettext("If you're not sure about the right category, you can change it later.");

    render() {
        return (
            <div>
                <h1
                    className="ud-heading-serif-xl"
                    styleName="header-text"
                    data-purpose="header-text"
                >
                    {this.headerText}
                </h1>
                <p styleName="subhead-text" data-purpose="subhead-text">
                    {this.subHeadText}
                </p>
                <form styleName="response-form">
                    <FormGroup
                        label={gettext('Course category')}
                        labelProps={{className: 'ud-sr-only'}}
                    >
                        <Select
                            value={this.props.store.pageData.category || 'default'}
                            onChange={this.onChange}
                        >
                            <option value="default">{gettext('Choose a category')}</option>
                            {this.props.store.categoryList.map((category) => (
                                <option value={category.id} key={category.id} name={category.id}>
                                    {category.title}
                                </option>
                            ))}
                            <option value={-1}>{gettext("I don't know yet")}</option>
                        </Select>
                    </FormGroup>
                </form>
                {this.props.store.isInSupplyGapsTargetGroup && this.renderAvailableOpportunities()}
            </div>
        );
    }
}
