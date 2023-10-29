import React from 'react';

import './two-columns.less';

const TwoColumns = (props) => <div {...props} styleName="two-columns" />;

const TwoColumnsGroup = (props) => <div {...props} styleName="two-columns-group" />;

TwoColumns.Group = TwoColumnsGroup;

export default TwoColumns;
