import {withCoursePriceStore} from '@udemy/browse-course';

import StaticPriceText from 'base-components/price-text/static-price-text.react-component';

const AsyncCourseStaticPriceText = withCoursePriceStore(StaticPriceText);
export default AsyncCourseStaticPriceText;
