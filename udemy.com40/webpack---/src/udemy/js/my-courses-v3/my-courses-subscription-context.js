import React from 'react';

const MyCoursesSubscriptionContext = React.createContext({
    smsSubscriptionsActive: false,
    consumerSubscriptionActive: false,
});

export default MyCoursesSubscriptionContext;
