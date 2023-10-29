export const buildURLParamsFromFormData = (formData: FormData) => {
    const params = new URLSearchParams();
    for (const [key, value] of formData.entries()) {
        params.append(key, value.toString());
    }
    return params;
};
