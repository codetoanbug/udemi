import {Button} from '@udemy/react-core-components';
import {inject, observer} from 'mobx-react';
import React from 'react';

export default inject('priceStore')(
    observer(({priceStore}) => {
        return (
            <Button
                data-purpose="price-form-submit-button"
                disabled={!priceStore.form.canSubmit || priceStore.form.isSubmitting}
                type="submit"
            >
                {gettext('Save')}
            </Button>
        );
    }),
);
