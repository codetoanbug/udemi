import {Loader} from '@udemy/react-reveal-components';
import React from 'react';

import './uploading-backdrop.less';

const UploadingBackdrop = () => (
    <div styleName="backdrop">
        <Loader size="large" />
    </div>
);

export default UploadingBackdrop;
