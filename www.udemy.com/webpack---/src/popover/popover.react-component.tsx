import {Popper, PopperProps} from '../popper/popper.react-component';
import {makePopover, BasePopoverProps} from './basic-popover.react-component';

export type PopoverProps = PopperProps & BasePopoverProps;

/**
 * Popover component that supports features from {@link Popper}
 */
export const Popover = makePopover<PopperProps>(Popper, Popper.propTypes);
Popover.displayName = 'Popover';
