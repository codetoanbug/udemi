import {Loader} from '@udemy/react-reveal-components';
import React from 'react';

import './curriculum-item-view.less';

const CurriculumItemLoader = () => (
    <div styleName="loader">
        <Loader size="xxlarge" color="inherit" />
    </div>
);

export default CurriculumItemLoader;
