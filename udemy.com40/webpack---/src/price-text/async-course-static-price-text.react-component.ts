import {withCoursePriceStore} from '../course-price-store/with-course-price-store';
import {StaticPriceText} from './static-price-text.react-component';

export const AsyncCourseStaticPriceText = withCoursePriceStore(StaticPriceText);
