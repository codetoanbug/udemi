import React from 'react';

const VerificationFlowStoreContext = React.createContext({});

export default VerificationFlowStoreContext;

export const VerificationFlowStateMap = {
    intro: 'intro',
    coinstructor: 'coinstructor',
    truliooError: 'truliooError',
    instructorOrPublisher: 'instructorOrPublisher',
    country: 'country',
    address: 'address',
    countryInvalid: 'countryInvalid',
    success: 'success',
    manual: 'manual',
    failed: 'failed',
};
