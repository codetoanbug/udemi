import { StaticPriceText } from "udemy-django-static/js/base-components/price-text/static-price-text.react-component";
import withCoursePriceStore from "udemy-django-static/js/course-price-store//udlite/with-course-price-store";

const AsyncCourseStaticPriceText = withCoursePriceStore(StaticPriceText);
export default AsyncCourseStaticPriceText;
