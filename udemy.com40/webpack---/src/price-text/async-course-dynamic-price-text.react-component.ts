import {withCoursePriceStore} from '../course-price-store/with-course-price-store';
import {DynamicPriceText} from './dynamic-price-text.react-component';

export const AsyncCourseDynamicPriceText = withCoursePriceStore(DynamicPriceText);
