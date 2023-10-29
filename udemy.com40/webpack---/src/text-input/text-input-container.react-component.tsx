import React from 'react';

// Note: TextInputContainer CSS is served up via the react-form-components.global.css file;

/**
 *
 * The TextInputContainer component.
 *
 * @remarks
 * This component is to wraps (in what is expected in most cases)
 * the TextInput component with a `<div>`.  That's it. That's the component.
 *
 * This component requires global CSS.
 * You must add this import to your application's `_app.tsx` global CSS import manifest:
 *
 * @example
 * `@import '~@udemy/react-form-components/dist/react-form-components.global.css';`
 */
export const TextInputContainer = ({children}: {children: React.ReactNode}) => (
    <div className="ud-text-input-container">
        {children}
        <div className="ud-text-input-box" />
    </div>
);
